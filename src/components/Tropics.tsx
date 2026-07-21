import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResizeDetector } from 'react-resize-detector';
import LinearProgress from '@mui/material/LinearProgress';

import { baseProps } from '../hooks/radar';
import { getStorms, useTropics, type Storm } from '../hooks/useTropics';
import { CycloneLayer } from './CycloneLayer';
import { StormList } from './StormList';

const getCenter = (width: number, pacific?: boolean): [number, number] => {
  const longitude = -Math.max(50, Math.min(70, 95 - width * 0.05));
  return pacific ? [30, -125] : [30, longitude];
};

// A storm's current location carried across a tab switch via router state.
interface LocationState {
  center?: [number, number];
}

interface PannerProps {
  pacific?: boolean;
  width: number;
}

function Panner({ pacific, width }: PannerProps) {
  const map = useMap();
  const location = useLocation();
  const [key, setKey] = useState(location.key);
  useEffect(() => {
    // Every tab switch produces a new location key. Pan to the storm carried
    // in router state (cross-basin storm click) or the basin's default center.
    if (location.key !== key) {
      const target = (location.state as LocationState | null)?.center;
      map.panTo(target ?? getCenter(width, pacific));
      setKey(location.key);
    }
  }, [key, location.key, location.state, map, pacific, width]);
  return null;
}

interface TropicsProps {
  pacific?: boolean;
}

export default Tropics;
export function Tropics({ pacific }: TropicsProps) {
  const height = 'max(400px, min(60vh, 1152px))';
  const { ref, width } = useResizeDetector();
  const mapRef = useRef<LeafletMap>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const tropics = useTropics();

  const routeCenter = (location.state as LocationState | null)?.center;
  const center = width && (routeCenter ?? getCenter(width, pacific));

  const storms = getStorms(tropics.data?.features);
  const showNoActivity = !storms.some(storm => storm.pacific === !!pacific);

  const handleSelect = (storm: Storm) => {
    if (storm.pacific === !!pacific) {
      mapRef.current?.panTo(storm.position);
    } else {
      // Switch to the storm's basin tab, carrying its location across. Replace
      // rather than push so storm clicks don't pile up in the back history.
      navigate(storm.pacific ? '/pacific' : '/atlantic', {
        replace: true,
        state: { center: storm.position },
      });
    }
  };

  return (
    <div ref={ref}>
      {center && tropics.data && (
        <>
          <div style={{ position: 'relative' }}>
            <MapContainer
              center={center}
              ref={mapRef}
              scrollWheelZoom={false}
              style={{ height }}
              zoom={4}
              zoomControl={false}
            >
              <Panner pacific={pacific} width={width} />
              <ZoomControl position="topright" />
              <TileLayer {...baseProps} />
              {showNoActivity && (
                <Marker opacity={0} position={center}>
                  <Tooltip direction="center" permanent={true}>
                    {pacific
                      ? 'No active tropical cyclones in the Eastern Pacific'
                      : 'No active tropical cyclones in the Atlantic'}
                  </Tooltip>
                </Marker>
              )}
              <CycloneLayer data={tropics.data} />
            </MapContainer>
            {storms.length > 0 && (
              <StormList onSelect={handleSelect} storms={storms} />
            )}
          </div>
          <LinearProgress variant="determinate" value={0} />
        </>
      )}
    </div>
  );
}
