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

export interface Observation {
  properties: {
    temperature: {
      value: number;
    };
  };
}

export interface Period {
  detailedForecast: string;
  endTime: string;
  isDaytime: boolean;
  name: string;
  shortForecast: string;
  startTime: string;
  temperature: number;
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
