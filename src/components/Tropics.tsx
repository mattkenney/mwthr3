import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useResizeDetector } from 'react-resize-detector';

interface Config {
  base: {
    url: string;
    attribution: string;
  };
}

const dataElement = document.getElementById('data') as HTMLElement;
const { base } = JSON.parse(dataElement.innerText) as Config;

const getCenter = (width: number, pacific?: boolean): [number, number] => {
  const longitude = -Math.max(50, Math.min(70, 95 - width * 0.05));
  return pacific ? [35, -125] : [35, longitude];
};

interface PannerProps {
  pacific?: boolean;
  width: number;
}

function Panner({ pacific, width }: PannerProps) {
  const map = useMap();
  const [isPacific, setPacific] = useState(!!pacific);
  useEffect(() => {
    if (isPacific !== !!pacific) {
      map.panTo(getCenter(width, pacific));
      setPacific(!!pacific);
    }
  }, [pacific]);
  return null;
}

interface TropicsProps {
  pacific?: boolean;
}

export function Tropics({ pacific }: TropicsProps) {
  const height = 'max(400px, min(60vh, 1152px))';
  const { ref, width } = useResizeDetector();
  const center = width && getCenter(width, pacific);

  return (
    <div ref={ref}>
      {center && (
        <MapContainer
          center={center}
          zoom={4}
          scrollWheelZoom={false}
          style={{ height }}
        >
          <Panner pacific={pacific} width={width} />
          <TileLayer attribution={base.attribution} url={base.url} />
          <Marker opacity={0} position={center}>
            <Tooltip direction="center" permanent={true}>
              {pacific
                ? 'No active tropical cyclones in the Eastern Pacific'
                : 'No active tropical cyclones in the Atlantic'}
            </Tooltip>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}
