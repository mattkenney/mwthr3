#!/usr/bin/env node

import fetch from 'node-fetch';
import JSZip from 'jszip';
import Parser from 'rss-parser';
import shapefile from 'shapefile';

// const feeds = [
//   'http://www.nhc.noaa.gov/gis-at.xml',
//   'http://www.nhc.noaa.gov/gis-ep.xml',
// ];
const feeds = [
  'http://www.nhc.noaa.gov/rss_examples/gis-at-20130605.xml',
  'http://www.nhc.noaa.gov/rss_examples/gis-ep-20130530.xml',
];

/*
 * Add `label` property to one storm path point per storm
 */
function addLabels(features) {
  const filenames = new Set();
  features
    .filter(feature => /_pts$/.test(feature.properties.filename))
    .forEach(feature => {
      if (filenames.has(feature.properties.filename)) return;
      filenames.add(feature.properties.filename);
      const sameName = features.filter(
        other => other.properties.filename === feature.properties.filename
      );
      let other = sameName.find(other =>
        /(^TS)|(^Tropical Storm)|(^HU)/i.test(other.properties.STORMTYPE)
      );
      if (!other?.properties?.STORMNAME) {
        other = sameName.find(other => !!other.properties.STORMNAME);
      }
      if (other) {
        feature.properties.label = other.properties.STORMNAME;
      }
    });
}

/*
 * Given a [filename, shapefile-to-GeoJSON-Feature source] pair,
 * returns an array of features
 */
async function getFeatures([filename, source]) {
  const features = [];

  while (true) {
    const result = await source.read();
    if (result.done) break;
    result.value.properties.filename = filename;
    features.push(result.value);
  }

  return features;
}

/*
 * Given a URL of a zipfile of shapefiles,
 * returns an array of [filename, shapefile-to-GeoJSON-Feature source] pairs
 */
async function getFeatureSources(link) {
  const res = await fetch(link);
  if (res.status !== 200) {
    console.error({ link, message: 'fetch error', status: res.status });
    return [];
  }
  const bytes = await res.arrayBuffer();
  const archive = await JSZip.loadAsync(bytes);

  const promises = [];
  archive.forEach((relativePath, file) => {
    if (/(_5day_lin|_5day_pgn|_5day_pts|wwlin)\.shp$/.test(relativePath)) {
      const filename = relativePath.slice(0, -4);
      const dbfPath = `${filename}.dbf`;
      promises.push(
        (async () => {
          const shp = await file.async('uint8array');
          const dbf = await archive.file(dbfPath)?.async('uint8array');
          const source = await shapefile.open(shp, dbf);
          return [filename, source];
        })()
      );
    }
  });

  return Promise.all(promises);
}

/*
 * Given the URL of a National Hurricane Center GIS Data RSS feed,
 * returns the links to cyclone data shapefile zipfiles that it contains
 */
async function getZipLinks(url) {
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  return feed.items
    .map(item => item.link)
    .filter(link =>
      /((_5day_[^/]*)|(_best_track_latest)|(_fcst_[^/]*)).zip$/.test(link)
    );
}

async function processFeeds(...feeds) {
  const links = (await Promise.all(feeds.map(getZipLinks))).flat();
  const sources = (await Promise.all(links.map(getFeatureSources))).flat();
  const features = (await Promise.all(sources.map(getFeatures))).flat();
  addLabels(features);

  return JSON.stringify({ features, type: 'FeatureCollection' });
}

processFeeds(...feeds).then(console.log);
