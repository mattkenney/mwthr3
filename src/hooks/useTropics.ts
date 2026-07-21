import { useQuery } from '@tanstack/react-query';
import { Feature, FeatureCollection } from 'geojson';

import { logger } from '../logger';

export function useTropics() {
  const url = '/data/tropics.json';
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      try {
        const res = await fetch(url);
        if (res.status === 200) {
          return (await res.json()) as FeatureCollection;
        }
      } catch (err: unknown) {
        logger.error({ err, url });
      }
      return { features: [], type: 'FeatureCollection' } as FeatureCollection;
    },
  });
}

export interface Storm {
  // full name including classification, e.g. "Tropical Storm Fausto"
  label: string;
  // just the storm name for compact display, e.g. "Fausto"
  name: string;
  pacific: boolean;
  // Leaflet order: [latitude, longitude]
  position: [number, number];
}

// Sort by classification, strongest first. The labeled point's STORMTYPE code
// is unreliable (forecast track points carry mixed/future types), so we rank
// on the displayed name, which always reads "<Classification> <Name>".
const stormOrder = [
  /^hurricane/i,
  /^(sub)?tropical storm/i,
  /^(sub)?tropical depression/i,
  /^potential tropical cyclone/i,
  /^post-tropical/i,
];

function stormRank(label: string): number {
  const rank = stormOrder.findIndex(regex => regex.test(label));
  return rank < 0 ? stormOrder.length : rank;
}

// Leading classification to strip so chips can show just the storm name.
const classification =
  /^((?:major )?hurricane|(?:sub)?tropical (?:storm|depression)|(?:potential |post-)?tropical cyclone)\s+/i;

/*
 * Pull the one labeled point per active storm out of the feed, from both
 * basins, into a {label, basin, current position} list sorted by intensity.
 */
export function getStorms(features: Feature[] | undefined): Storm[] {
  const storms: Storm[] = [];
  for (const feature of features ?? []) {
    if (!feature.properties?.label || feature.geometry?.type !== 'Point') {
      continue;
    }
    const [longitude, latitude] = feature.geometry.coordinates;
    const label = String(feature.properties.label);
    storms.push({
      label,
      name: label.replace(classification, '') || label,
      pacific: /^ep$/i.test(String(feature.properties?.BASIN)),
      position: [latitude, longitude],
    });
  }
  return storms.sort((a, b) => {
    const rank = stormRank(a.label) - stormRank(b.label);
    return rank === 0 ? a.label.localeCompare(b.label) : rank;
  });
}
