import { useQuery } from '@tanstack/react-query';
import { FeatureCollection } from 'geojson';

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
