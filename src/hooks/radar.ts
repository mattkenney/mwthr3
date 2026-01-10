import { createContext, useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Map, TileLayer, WMSParams } from 'leaflet';

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
  radarTime: number;
  progress: number;
  setIsLoading?: (value: boolean) => unknown;
  setProgress?: (value: number) => unknown;
}

interface NwsWmsParams extends WMSParams {
  time?: string;
}

const dataElement = document.getElementById('data');
const { base, radar } = JSON.parse(dataElement?.innerText ?? '{}') as Config;

export const baseProps = { ...base };

// repeating [ 0, 25, 24, 23, ..., 3, 2, 1 ]
const calculateStep = (progress: number) => (26 - progress / 4) % 26;

const twoMinMillis = 2 * 60 * 1000;
function calculateRadarTime(progress: number) {
  const roundNow = Math.floor(Date.now() / twoMinMillis);
  return (roundNow - calculateStep(progress)) * twoMinMillis;
}

function getOrCreateRadarLayer(
  ctx: IRadarContext,
  map: Map,
  id: string,
): TileLayer.WMS {
  let result = getRadarLayer(map, id);
  if (!result) {
    result = new TileLayer.WMS(radar.url, {
      id,
      ...makeNwsWmsParams(ctx),
    });
    result.on('load', () => ctx.setIsLoading && ctx.setIsLoading(false));
    result.on(
      'loading',
      () => !ctx.isPlaying && ctx.setIsLoading && ctx.setIsLoading(true),
    );
    result.addTo(map);
  }
  return result;
}

function getRadarLayer(map: Map, id: string) {
  let result: TileLayer.WMS | undefined;
  map.eachLayer(layer => {
    if ('setParams' in layer) {
      const wmsLayer = layer as TileLayer.WMS;
      if (wmsLayer.options.id === id) {
        result = wmsLayer;
      }
    }
  });
  return result;
}

export const initialRadarContext = () => ({
  isPlaying: false,
  radarTime: 0,
  progress: 0,
});

export const RadarContext = createContext<IRadarContext>(initialRadarContext());

function makeNwsWmsParams(ctx: IRadarContext): NwsWmsParams {
  const time = new Date(ctx.radarTime).toISOString();
  return { ...radar.params, time };
}

function setVisibility(map: Map, id: string, visible: boolean) {
  const wmsLayer = getRadarLayer(map, id);
  const elem = wmsLayer?.getContainer();
  if (elem) {
    elem.style.visibility = visible ? 'visible' : 'hidden';
  }
}

export function useRadarIsLoading() {
  const ctx = useContext(RadarContext);
  const [isLoading, setIsLoading] = useState(false);
  ctx.setIsLoading = setIsLoading;

  return isLoading;
}

export function useRadarPlaying() {
  const ctx = useContext(RadarContext);
  const map = useMap();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (ctx.isPlaying) {
        const nextProgress = ctx.progress + 4;
        ctx.progress = nextProgress > 100 ? 0 : nextProgress;
        ctx.setProgress && ctx.setProgress(ctx.progress);
      }
      const radarTime = calculateRadarTime(ctx.progress);
      if (ctx.radarTime != radarTime) {
        ctx.radarTime = radarTime;
        const idSelector = calculateStep(ctx.progress) % 2;
        const id = idSelector ? 'radarB' : 'radarA';
        const wmsLayer = getOrCreateRadarLayer(ctx, map, id);
        if (ctx.isPlaying) {
          setVisibility(map, id, false);
          const otherId = idSelector ? 'radarA' : 'radarB';
          setVisibility(map, otherId, true);
        } else {
          setVisibility(map, id, true);
        }
        wmsLayer.setParams(makeNwsWmsParams(ctx));
      }
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
