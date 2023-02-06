import { useQuery } from '@tanstack/react-query';
import { FeatureCollection } from 'geojson';

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
        console.log({ err });
      }
    },
  });
}
