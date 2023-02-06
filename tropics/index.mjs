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
 * Given a [kind, shapefile-to-GeoJSON-Feature source] pair,
 * returns an array of features
 */
async function getFeatures([kind, source]) {
  const features = [];

  while (true) {
    const result = await source.read();
    if (result.done) break;
    result.value.properties.kind = kind;
    features.push(result.value);
  }

  return features;
}

/*
 * Given a URL of a zipfile of shapefiles,
 * returns an array of [kind, shapefile-to-GeoJSON-Feature source] pairs
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
    const match = /_(lin|pgn|pts|wwlin)\.shp$/.exec(relativePath);
    if (match) {
      const dbfPath = `${relativePath.slice(0, -4)}.dbf`;
      const kind = match[1];
      promises.push(
        (async () => {
          const shp = await file.async('uint8array');
          const dbf = await archive.file(dbfPath)?.async('uint8array');
          const source = await shapefile.open(shp, dbf);
          return [kind, source];
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

  return JSON.stringify({ features, type: 'FeatureCollection' });
}

processFeeds(...feeds).then(console.log);
