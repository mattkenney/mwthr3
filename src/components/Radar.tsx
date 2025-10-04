import { ReactNode, useEffect, useState } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LinearProgress from '@mui/material/LinearProgress';

import {
  RadarContext,
  baseProps,
  initialRadarContext,
  useRadarIsLoading,
  useRadarLayerProps,
  useRadarProgress,
} from '../hooks/radar';
import { RadarPlayButton } from './RadarPlayButton';
import { Spinner } from './Spinner';

export interface RadarProps {
  latitude?: number;
  longitude?: number;
}

function Panner({ latitude, longitude }: RadarProps) {
  const map = useMap();
  const coords = [latitude, longitude].join();
  const [center, setCenter] = useState(coords);
  useEffect(() => {
    if (coords !== center) {
      map.panTo([latitude ?? 40, longitude ?? -75]);
      setCenter(coords);
    }
  }, [center, coords, latitude, longitude, map]);
  return null;
}

function RadarLayer() {
  const props = useRadarLayerProps();

  return <WMSTileLayer {...props} />;
}

function RadarProgress() {
  const progress = useRadarProgress();

  return <LinearProgress variant="determinate" value={progress} />;
}

interface RadarProviderProps {
  children?: ReactNode;
}

function RadarProvider({ children }: RadarProviderProps) {
  return (
    <RadarContext.Provider value={initialRadarContext()}>
      {children}
    </RadarContext.Provider>
  );
}

function RadarSpinner() {
  const isLoading = useRadarIsLoading();

  if (!isLoading) return null;

  return <Spinner />;
}

export default Radar;
export function Radar({ latitude, longitude }: RadarProps) {
  if (!latitude || !longitude) return null;

  const height = 'max(400px, min(60vh, 1152px))';
  return (
    <RadarProvider>
      <MapContainer
        center={[latitude, longitude]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height }}
      >
        <Panner latitude={latitude} longitude={longitude} />
        <TileLayer {...baseProps} />
        <RadarLayer />
        <RadarSpinner />
        <RadarPlayButton />
      </MapContainer>
      <RadarProgress />
    </RadarProvider>
  );
}
