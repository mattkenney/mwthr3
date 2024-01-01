export interface CityState {
  city: string;
  state: string;
}

export type Coordinates = [number, number];

export interface Forecast {
  properties: {
    periods: Period[];
  };
}

export interface GridPoint {
  properties: {
    forecast: string;
    forecastHourly: string;
    observationStations: string;
    relativeLocation: {
      geometry: {
        coordinates: Coordinates;
      };
      properties: CityState;
    };
  };
}

export interface ObservationValue {
  value: number | null;
}

export interface ObservationProperties {
  temperature?: ObservationValue;
  timestamp?: string;
  windGust?: ObservationValue;
  windSpeed?: ObservationValue;
}

export interface Observation {
  properties: ObservationProperties;
}

export interface Period {
  detailedForecast: string;
  endTime: string;
  isDaytime: boolean;
  name: string;
  shortForecast: string;
  startTime: string;
  temperature: number;
  windDirection: string;
  windSpeed: string;
}

export interface Station {
  geometry: {
    coordinates: [number, number];
  };
  id: string;
}

export interface Stations {
  features: Station[];
}

export interface WxAlert {
  id: string;
  properties: {
    event: string;
    headline: string;
    description: string;
  };
}

export interface WxAlerts {
  features: WxAlert[];
}
