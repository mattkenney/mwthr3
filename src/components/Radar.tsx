import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, useMap } from 'react-leaflet';
import { WMSParams } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const dataElement = document.getElementById('data') as HTMLElement;
const { base, radar } = JSON.parse(dataElement.innerText) as Config;

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

export function Radar({ latitude, longitude }: RadarProps) {
  if (!latitude || !longitude) return null;
  const height = 'max(400px, min(60vh, 1152px))';
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={8}
      scrollWheelZoom={false}
      style={{ height }}
    >
      <Panner latitude={latitude} longitude={longitude} />
      <TileLayer attribution={base.attribution} url={base.url} />
      <WMSTileLayer url={radar.url} params={radar.params} />
    </MapContainer>
  );
}
