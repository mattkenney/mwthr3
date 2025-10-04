import { createContext, useContext, useEffect, useState } from 'react';
import { useMap, WMSTileLayer } from 'react-leaflet';
import { WMSParams, TileLayer } from 'leaflet';

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

export function useRadarEventHandlers() {
  const ctx = useContext(RadarContext);
  return {
    load: () => ctx.setIsLoading && ctx.setIsLoading(false),
    loading: () => ctx.setIsLoading && ctx.setIsLoading(true),
  };
}

export function useRadarIsLoading() {
  const ctx = useContext(RadarContext);
  const [isLoading, setIsLoading] = useState(false);
  ctx.setIsLoading = setIsLoading;

  return isLoading;
}

export function useRadarLayerProps() {
  const ctx = useContext(RadarContext);
  const map = useMap();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (ctx.isPlaying) {
        const nextProgress = ctx.progress + 4;
        ctx.progress = nextProgress > 100 ? 0 : nextProgress;
        ctx.setProgress && ctx.setProgress(ctx.progress);
      }
      const interval = calculateInterval(ctx.progress);
      if (ctx.interval != interval) {
        ctx.interval = interval;
        map.eachLayer(layer => {
          if ('setParams' in layer) {
            const wmsLayer = layer as TileLayer.WMS;
            wmsLayer.setParams({
              ...radar.params,
              time: time(ctx),
            } as WMSParams);
          }
        });
      }
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return {
    eventHandlers: {
      load: () => ctx.setIsLoading && ctx.setIsLoading(false),
      loading: () => ctx.setIsLoading && ctx.setIsLoading(true),
    },
    opacity: 0.7,
    params: { ...radar.params, time: time(ctx) } as WMSParams,
    url: radar.url,
  };
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
          ctx.setProgress && ctx.setProgress(ctx.progress);
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
