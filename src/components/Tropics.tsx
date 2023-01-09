import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Config {
  base: {
    url: string;
    attribution: string;
  };
}

const dataElement = document.getElementById('data') as HTMLElement;
const { base } = JSON.parse(dataElement.innerText) as Config;

const getCenter = (pacific?: boolean): [number, number] =>
  pacific ? [30, -125] : [30, -50];

interface TropicsProps {
  pacific?: boolean;
}

function Panner({ pacific }: TropicsProps) {
  const map = useMap();
  const [isPacific, setPacific] = useState(!!pacific);
  useEffect(() => {
    if (isPacific !== !!pacific) {
      map.panTo(getCenter(pacific));
      setPacific(!!pacific);
    }
  }, [pacific]);
  return null;
}

export function Tropics({ pacific }: TropicsProps) {
  const height = 'max(400px, min(60vh, 1152px))';
  const center = getCenter(pacific);
  return (
    <MapContainer
      center={center}
      zoom={4}
      scrollWheelZoom={false}
      style={{ height }}
    >
      <Panner pacific={pacific} />
      <TileLayer attribution={base.attribution} url={base.url} />
      <Marker opacity={0} position={center}>
        <Tooltip direction="center" permanent={true}>
          {pacific
            ? 'No active tropical cyclones in the Eastern Pacific'
            : 'No active tropical cyclones in the Atlantic'}
        </Tooltip>
      </Marker>
    </MapContainer>
  );
}
