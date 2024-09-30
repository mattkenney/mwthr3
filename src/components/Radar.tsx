import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, useMap } from 'react-leaflet';
import { WMSParams } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { SetBooleanFn, Spinner } from './Spinner';

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

const dataElement = document.getElementById('data');
const { base, radar } = JSON.parse(dataElement?.innerText ?? '{}') as Config;

// two minute cache interval
const interval = () => Math.round(Date.now() / (2 * 60 * 1000));

function Panner({ latitude, longitude }: RadarProps) {
  const map = useMap();
  const coords = [latitude, longitude].join();
  const [center, setCenter] = useState(coords);
  useEffect(() => {
    if (coords !== center) {
      map.panTo([latitude ?? 40, longitude ?? -75]);
      setCenter(coords);
    }
  }, [latitude, longitude]);
  return null;
}

interface RadarProps {
  latitude?: number;
  longitude?: number;
}

export default Radar;
export function Radar({ latitude, longitude }: RadarProps) {
  const spinnerRef = useRef<SetBooleanFn>();
  const [timestamp, setTimestamp] = useState(interval());

  const handler = useCallback(() => {
    if (document.visibilityState === 'visible') {
      setTimestamp(interval());
      spinnerRef.current && spinnerRef.current(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('focus', handler, false);
    window.addEventListener('visibilitychange', handler, false);
    return () => {
      window.removeEventListener('focus', handler);
      window.removeEventListener('visibilitychange', handler);
    };
  }, [handler]);

  if (!latitude || !longitude) return null;

  const height = 'max(400px, min(60vh, 1152px))';
  const params = { ...radar.params, _: timestamp } as WMSParams;
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={8}
      scrollWheelZoom={false}
      style={{ height }}
    >
      <Panner latitude={latitude} longitude={longitude} />
      <TileLayer attribution={base.attribution} url={base.url} />
      <WMSTileLayer
        eventHandlers={{
          load: () => spinnerRef.current && spinnerRef.current(false),
          loading: () => spinnerRef.current && spinnerRef.current(true),
        }}
        opacity={0.7}
        params={params}
        url={radar.url}
      />
      <Spinner spinnerRef={spinnerRef} />
    </MapContainer>
  );
}
