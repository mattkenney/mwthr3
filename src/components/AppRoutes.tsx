import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

import { AppBarTabs } from './AppBarTabs';
import { WeatherCard } from './WeatherCard';
import { getCoordinates } from '../hooks/nws';
import type { GridPoint } from '../types/nws';

const Forecast = lazy(() => import('./Forecast'));
const Radar = lazy(() => import('./Radar'));
const Tropics = lazy(() => import('./Tropics'));

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
                <Suspense>
                  <Radar longitude={longitude} latitude={latitude} />
                </Suspense>
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
                <Suspense>
                  <Forecast gridPoint={gridPoint} />
                </Suspense>
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
                <Suspense>
                  <Tropics />
                </Suspense>
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
                <Suspense>
                  <Tropics pacific={true} />
                </Suspense>
              </WeatherCard>
            </>
          }
        />
        <Route path="*" element={<Navigate to="radar" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
}
