import { Feature, FeatureCollection, GeoJsonObject, Geometry } from 'geojson';
import { GeoJSON } from 'react-leaflet';
import * as leaflet from 'leaflet';

const pointToLayer = (_: unknown, center: leaflet.LatLngExpression) =>
  new leaflet.Circle(center, { color: '#333', opacity: 0.5, radius: 9 });

const style = (feat?: Feature<Geometry>) => {
  switch (feat?.properties?.kind) {
    case 'lin': // AKA line - storm path forecast
      return {
        color: '#666',
        opacity: 0.4,
      };

    case 'pgn': // AKA polygon - storm path cone
      return {
        color: '#666',
        opacity: 0.3,
        stroke: false,
      };

    case 'wwlin': // watch & warning line
      return {
        color: feat?.properties?.TCWW === 'TWR' ? '#f00' : '#fb0',
      };

    default: // 'pts' AKA points - storm path points
      return {};
  }
};

export interface CycloneLayerProps {
  data?: FeatureCollection;
}

export function CycloneLayer({ data }: CycloneLayerProps) {
  if (!data) return null;

  // The react-leaflet GeoJSON data property TypeScript declaration is wrong,
  // so we make a bugus cast to make TypeScript happy
  const dataProp = data as GeoJsonObject;
  return <GeoJSON data={dataProp} pointToLayer={pointToLayer} style={style} />;
}
