import { useQuery } from '@tanstack/react-query';
import { GeometryCollection } from 'geojson';

export function useTropics() {
  const url = '/data/tropics.json';
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      try {
        const res = await fetch(url);
        if (res.status === 200) {
          return (await res.json()) as GeometryCollection;
        }
      } catch (err: unknown) {
        console.log({ err });
      }
      return { features: [], type: 'GeometryCollection' };
    },
  });
}
