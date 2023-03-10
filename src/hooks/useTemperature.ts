import KDTree from 'mnemonist/kd-tree';

import { useObservations, useStations } from './nws';
import type { GridPoint, Observation, Stations } from '../types/nws';

function nearest(stations?: Stations, coordinates?: [number, number]) {
  if (!stations || !coordinates) return [];
  const mapped = stations.features.map(s => [s.id, s.geometry.coordinates]);
  const kd = KDTree.from(mapped as [[string, number[]]], 2);
  return kd.kNearestNeighbors(6, coordinates);
}

function pickValue(obs?: Observation[]) {
  if (!obs) return;

  // filter to observations that are numbers
  const values = obs
    .map(ob => ob?.properties?.temperature?.value)
    .filter(value => typeof value === 'number');

  // throw out highest an lowest and return first remaining
  if (values.length > 2) {
    const max = values.reduce(
      (max, value) => (max < value ? value : max),
      Number.MIN_VALUE
    );
    const min = values.reduce(
      (min, value) => (min > value ? value : min),
      Number.MAX_VALUE
    );
    const filtered = values.filter(value => min < value && value < max);

    if (filtered.length) return filtered[0];
  }

  // but fall back to first value
  return values[0];
}

export function useTemperature(gridPoint?: GridPoint) {
  const stations = useStations(gridPoint);
  const coordinates =
    gridPoint?.properties?.relativeLocation?.geometry?.coordinates;
  const ids = nearest(stations.data, coordinates);
  const results = useObservations(ids)
    .filter(r => !!r.data)
    .map(r => r.data);
  const value = pickValue(results as Observation[]);
  return typeof value === 'number'
    ? ((value * 9) / 5 + 32).toFixed(0)
    : undefined;
}
