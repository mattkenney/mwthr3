import KDTree from 'mnemonist/kd-tree';

import { useObservations, useStations } from './nws';
import type {
  GridPoint,
  Observation,
  ObservationProperties,
  ObservationValue,
  Stations,
} from '../types/nws';

type ObservationField = keyof ObservationProperties;

const NEIGHBOR_COUNT = 6;
const OUTLIER_CUTOFF = 0.9;
const TIMESTAMP_CUTOFF = 12 * 60 * 60 * 1000;

function nearest(stations?: Stations, coordinates?: [number, number]) {
  if (!stations?.features?.length || !coordinates) return [];
  const mapped = stations.features.map(s => [s.id, s.geometry.coordinates]);
  const kd = KDTree.from(mapped as [[string, number[]]], 2);
  return kd.kNearestNeighbors(NEIGHBOR_COUNT, coordinates);
}

function pickValue(obs: Observation[] | undefined, field: ObservationField) {
  if (!obs) return;

  // filter to observations that are recent and contain a number value
  const timestamp = new Date(Date.now() - TIMESTAMP_CUTOFF).toISOString();
  const values = obs
    .filter(ob => (ob?.properties?.timestamp ?? '') > timestamp)
    .map(ob => (ob?.properties?.[field] as ObservationValue)?.value)
    .filter(value => typeof value === 'number') as [number];

  // throw out likely outliers and return first remaining
  if (values.length > 2) {
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const sigma = Math.sqrt(
      values.reduce(
        (variance, value) => variance + (value - mean) * (value - mean),
        0
      ) / values.length
    );
    const max = mean + sigma * OUTLIER_CUTOFF;
    const min = mean - sigma * OUTLIER_CUTOFF;
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
