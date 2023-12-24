import KDTree from 'mnemonist/kd-tree';

import { useObservations, useStations } from './nws';
import type {
  GridPoint,
  Observation,
  ObservationProperties,
  Stations,
} from '../types/nws';

type ObservationField = keyof ObservationProperties;

function nearest(stations?: Stations, coordinates?: [number, number]) {
  if (!stations?.features?.length || !coordinates) return [];
  const mapped = stations.features.map(s => [s.id, s.geometry.coordinates]);
  const kd = KDTree.from(mapped as [[string, number[]]], 2);
  return kd.kNearestNeighbors(6, coordinates);
}

function pickValue(obs: Observation[] | undefined, field: ObservationField) {
  if (!obs) return;

  // filter to observations that are numbers
  const values = obs
    .map(ob => ob?.properties?.[field]?.value)
    .filter(value => typeof value === 'number') as [number];

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

export function useBestObservation(gridPoint?: GridPoint) {
  const stations = useStations(gridPoint);
  const coordinates =
    gridPoint?.properties?.relativeLocation?.geometry?.coordinates;
  const ids = nearest(stations.data, coordinates);
  const observations = useObservations(ids);
  const results = observations.filter(r => !!r.data).map(r => r.data);
  const isError =
    stations.isError ||
    (observations?.length > 0 && observations.every(obs => obs.isError));
  let value = pickValue(results as Observation[], 'temperature');
  const temperature =
    typeof value === 'number' ? Math.round((value * 9) / 5 + 32) : null;
  value = pickValue(results as Observation[], 'windGust');
  const windGust =
    typeof value === 'number' ? Math.round((value * 15625) / 25146) : null;
  value = pickValue(results as Observation[], 'windSpeed');
  const windSpeed =
    typeof value === 'number' ? Math.round((value * 15625) / 25146) : null;

  if (temperature === null && windSpeed === null) return { isError };

  return {
    isError,
    properties: {
      temperature: { value: temperature },
      windGust: { value: windGust },
      windSpeed: { value: windSpeed },
    },
  };
}
