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
 * Given a shapefile-to-GeoJSON-Feature source,
 * returns an array of features
 */
async function getFeatures(source) {
  const features = [];

  while (true) {
    const result = await source.read();
    if (result.done) break;
    features.push(result.value);
  }

  return features;
}

/*
 * Given a URL of a zipfile of shapefiles,
 * returns an array of shapefile-to-GeoJSON-Feature sources
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
    if (/\.shp$/.test(relativePath)) {
      promises.push(
        (async () => {
          const dbfPath = relativePath.replace(/\.shp$/, '.dbf');
          const shp = await file.async('uint8array');
          const dbf = await archive.file(dbfPath)?.async('uint8array');
          return shapefile.open(shp, dbf);
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

  return JSON.stringify({ features, type: 'GeometryCollection' });
}

processFeeds(...feeds).then(console.log);
//processFeeds(...feeds).then(x=>console.log(x?.length));
