import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import {
  useIsFetching,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import type {
  CityState,
  Coordinates,
  Forecast,
  GridPoint,
  Observation,
  Stations,
} from '../types/nws';

const client = axios.create({ timeout: 6000 });

axiosRetry(client, {
  retries: 8,
  retryDelay: axiosRetry.exponentialDelay,
});

export function getCityState(point?: GridPoint): Partial<CityState> {
  return point?.properties?.relativeLocation?.properties ?? {};
}

export function getCoordinates(point?: GridPoint): Coordinates | undefined {
  return point?.properties?.relativeLocation?.geometry?.coordinates;
}

function getOptions<T>(url?: string, config?: AxiosRequestConfig) {
  return {
    enabled: !!url,
    queryKey: [url],
    queryFn: async () => {
      const res = await client.get<T>(url ?? '', config);
      return res.data;
    },
  };
}

export function useForecast(point?: GridPoint) {
  const url = point?.properties?.forecast;
  return useQuery(getOptions<Forecast>(url));
}

export function useGridPoint(coords?: string) {
  const url = coords && `https://api.weather.gov/points/${coords}`;
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
      return getOptions<Observation>(url, { validateStatus: () => true });
    }),
  });
}

export function useRefresh() {
  const client = useQueryClient();

  return () => {
    client.resetQueries();
  };
}

export function useStations(point?: GridPoint) {
  const url = point?.properties?.observationStations;
  return useQuery(getOptions<Stations>(url));
}
