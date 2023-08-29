import { Feature, FeatureCollection, GeoJsonObject, Geometry } from 'geojson';
import { GeoJSON } from 'react-leaflet';
import * as leaflet from 'leaflet';

const pointToLayer = (feat: Feature, center: leaflet.LatLngExpression) => {
  if (feat.properties?.label) {
    return new leaflet.Marker(center, { opacity: 0 }).bindTooltip(
      feat.properties.label,
      {
        className: 'cyclone',
        direction: 'center',
        offset: [-20, 40],
        permanent: true,
      }
    );
  }
  return new leaflet.Circle(center, { color: '#333', opacity: 0.5, radius: 9 });
};

const style = (feat?: Feature<Geometry>) => {
  switch (feat?.properties?.filename?.split('_')?.pop()) {
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
        color: /^[HT]WA$/.test(feat?.properties?.TCWW) ? '#fb0' : '#f00',
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
