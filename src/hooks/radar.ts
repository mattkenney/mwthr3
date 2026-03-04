import { createContext, useContext, useEffect, useState } from 'react';
import L, { WMSParams } from 'leaflet';
import { useMap } from 'react-leaflet';

interface Config {
  base: {
    url: string;
    attribution: string;
  };
  radar: {
    url: string;
    params: WMSParams;
  };
}

interface IRadarContext {
  isPlaying: boolean;
  interval: number;
  progress: number;
  setIsLoading?: (value: boolean) => unknown;
  setProgress?: (value: number) => unknown;
}

const dataElement = document.getElementById('data');
const { base, radar } = JSON.parse(dataElement?.innerText ?? '{}') as Config;

export const baseProps = { ...base };

const twoMinMillis = 2 * 60 * 1000;
const calculateInterval = (progress: number) => {
  const roundNow = Math.floor(Date.now() / twoMinMillis);
  return (roundNow - ((26 - progress / 4) % 26)) * twoMinMillis;
};

export const initialRadarContext = () => ({
  isPlaying: false,
  interval: calculateInterval(0),
  progress: 0,
});

export const RadarContext = createContext<IRadarContext>(initialRadarContext());

function time(ctx: IRadarContext) {
  return new Date(ctx.interval).toISOString();
}

export function useRadarIsLoading() {
  const ctx = useContext(RadarContext);
  const [isLoading, setIsLoading] = useState(false);
  ctx.setIsLoading = setIsLoading;

  return isLoading;
}

export function useRadarLayer() {
  const ctx = useContext(RadarContext);
  const map = useMap();

  useEffect(() => {
    let activeLayer = 0;
    // true if the pending layer is still fetching tiles, so skip new updates
    let loading = false;
    const t = time(ctx);
    const options = { ...radar.params, time: t, opacity: 0.7 } as WMSParams;
    const layers = [
      L.tileLayer.wms(radar.url, options),
      L.tileLayer.wms(radar.url, { ...options }),
    ];

    for (const layer of layers) {
      layer.on('loading', () => {
        if (!ctx.isPlaying) ctx.setIsLoading?.(true);
      });
      layer.on('load', () => ctx.setIsLoading?.(false));
    }

    layers[0].addTo(map);
    layers[1].addTo(map);
    const hiddenContainer = layers[1].getContainer();
    if (hiddenContainer) hiddenContainer.style.visibility = 'hidden';

    const intervalId = setInterval(() => {
      if (ctx.isPlaying) {
        const nextProgress = ctx.progress + 4;
        ctx.progress = nextProgress > 100 ? 0 : nextProgress;
        ctx.setProgress?.(ctx.progress);
      }
      const interval = calculateInterval(ctx.progress);
      if (ctx.interval !== interval && !loading) {
        ctx.interval = interval;
        // the layer loading new tiles, will become active on completion
        const pendingLayer = activeLayer === 0 ? 1 : 0;
        loading = true;

        layers[pendingLayer].once('load', () => {
          // wait for tile images to be decoded before showing,
          // Firefox defers decoding for hidden images
          const imgs = layers[pendingLayer]
            .getContainer()
            ?.querySelectorAll('img');
          const decoded = Array.from(imgs ?? []).map(img =>
            img.decode().catch((e: unknown) => console.error(e)),
          );
          Promise.all(decoded)
            .then(() => {
              const show = layers[pendingLayer].getContainer();
              const hide = layers[activeLayer].getContainer();
              if (show) show.style.visibility = '';
              if (hide) hide.style.visibility = 'hidden';
              activeLayer = pendingLayer;
              loading = false;
            })
            .catch((e: unknown) => console.error(e));
        });
        layers[pendingLayer].setParams({
          ...radar.params,
          time: time(ctx),
        } as WMSParams);
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
      if (map.hasLayer(layers[0])) map.removeLayer(layers[0]);
      if (map.hasLayer(layers[1])) map.removeLayer(layers[1]);
    };
  }, [ctx, map]);
}

export function useRadarPlaying() {
  const ctx = useContext(RadarContext);
  const [isPlaying, setIsPlaying] = useState(false);
  return {
    isPlaying,
    togglePlaying: () => {
      setIsPlaying(prevIsPlaying => {
        ctx.isPlaying = !prevIsPlaying;
        if (!ctx.isPlaying) {
          ctx.progress = 0;
          ctx.setProgress?.(ctx.progress);
        }
        return ctx.isPlaying;
      });
    },
  };
}

export function useRadarProgress() {
  const ctx = useContext(RadarContext);
  const [progress, setProgress] = useState(ctx.progress);
  ctx.setProgress = setProgress;
  return progress;
}
