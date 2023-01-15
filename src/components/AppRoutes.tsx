import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

import { AppBarTabs } from './AppBarTabs';
import { Forecast } from './Forecast';
import { Radar } from './Radar';
import { Tropics } from './Tropics';
import { WeatherCard } from './WeatherCard';
import { getCoordinates } from '../hooks/nws';
import type { GridPoint } from '../types/nws';

const tabs = [
  { label: 'Radar', to: 'radar' },
  { label: 'Forecast', to: 'forecast' },
  { label: 'Atlantic', to: 'atlantic' },
  { label: 'Pacific', to: 'pacific' },
];

interface AppRoutesProps {
  chooseWhere?: () => void;
  gridPoint?: GridPoint;
}

export function AppRoutes({ chooseWhere, gridPoint }: AppRoutesProps) {
  const [longitude, latitude] = getCoordinates(gridPoint) ?? [];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/radar"
          element={
            <>
              <AppBarTabs component={Link} tabs={tabs} value="radar" />
              <WeatherCard chooseWhere={chooseWhere} gridPoint={gridPoint}>
                <Radar longitude={longitude} latitude={latitude} />
              </WeatherCard>
            </>
          }
        />
        <Route
          path="/forecast"
          element={
            <>
              <AppBarTabs component={Link} tabs={tabs} value="forecast" />
              <WeatherCard chooseWhere={chooseWhere} gridPoint={gridPoint}>
                <Forecast gridPoint={gridPoint} />
              </WeatherCard>
            </>
          }
        />
        <Route
          path="/atlantic"
          element={
            <>
              <AppBarTabs component={Link} tabs={tabs} value="atlantic" />
              <WeatherCard chooseWhere={chooseWhere} gridPoint={gridPoint}>
                <Tropics />
              </WeatherCard>
            </>
          }
        />
        <Route
          path="/pacific"
          element={
            <>
              <AppBarTabs component={Link} tabs={tabs} value="pacific" />
              <WeatherCard chooseWhere={chooseWhere} gridPoint={gridPoint}>
                <Tropics pacific={true} />
              </WeatherCard>
            </>
          }
        />
        <Route path="*" element={<Navigate to="radar" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
}
