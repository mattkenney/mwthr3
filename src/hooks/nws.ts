import {
  useIsFetching,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { logger } from '../logger';
import type {
  CityState,
  Coordinates,
  Forecast,
  GridPoint,
  Observation,
  Stations,
  WxAlerts,
} from '../types/nws';

export function getCityState(point?: GridPoint): Partial<CityState> {
  return point?.properties?.relativeLocation?.properties ?? {};
}

export function getCoordinates(point?: GridPoint): Coordinates | undefined {
  return point?.properties?.relativeLocation?.geometry?.coordinates;
}

function getOptions<T>(url?: string, allStatusOK = false) {
  return {
    enabled: !!url,
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url ?? '', { signal: AbortSignal.timeout(6000) });
      if (!allStatusOK && res.status >= 300) {
        throw new Error(`HTTP error ${String(res.status)}: ${res.statusText}`);
      }
      return res.json() as Promise<T>;
    },
    retry: 5,
    retryDelay: (n: number) => 100 * Math.pow(2, n),
  };
}

export function useAlerts(point?: GridPoint) {
  const coordinates = getCoordinates(point);
  const coords = coordinates?.slice().reverse().join();
  const url = coords && `https://api.weather.gov/alerts/active?point=${coords}`;
  return useQuery(getOptions<WxAlerts>(url));
}

export function useForecast(point?: GridPoint) {
  const url = point?.properties?.forecast;
  return useQuery(getOptions<Forecast>(url));
}

export function useGridPoint(coords?: string) {
  const fixed = coords
    ?.split(',')
    .map(part => Number(part).toFixed(4))
    .join();
  const url = fixed && `https://api.weather.gov/points/${fixed}`;
  return useQuery(getOptions<GridPoint>(url));
}

export function useHourlyForecast(point?: GridPoint) {
  const url = point?.properties?.forecastHourly;
  return useQuery(getOptions<Forecast>(url));
}

export { useIsFetching };

export function useObservations(ids?: string[]) {
  return useQueries({
    queries: (ids ?? []).map(id => {
      const url = id && `${id}/observations/latest`;
      return getOptions<Observation>(url, true);
    }),
  });
}

export function useRefresh() {
  const client = useQueryClient();

  return () => {
    client.resetQueries().catch((err: unknown) => {
      logger.error(err);
    });
  };
}

export function useStations(point?: GridPoint) {
  const url = point?.properties?.observationStations;
  return useQuery(getOptions<Stations>(url));
}
