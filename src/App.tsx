import { useState } from 'react';

import { AppRoutes } from './components/AppRoutes';
import { Where } from './components/Where';
import { useGeolocation } from './hooks/useGeolocation';
import { useGridPoint } from './hooks/nws';

export function App() {
  const [where, setWhere] = useState('');
  const [open, setOpen] = useState(false);
  const position = useGeolocation();
  const coords =
    position?.coords &&
    [position.coords.latitude, position.coords.longitude].join();
  const geoGrid = useGridPoint(coords);
  const whereGrid = useGridPoint(where);
  const grid = whereGrid.data || geoGrid.data;
  return (
    <>
      <AppRoutes gridPoint={grid} chooseWhere={() => setOpen(true)} />
      <Where open={open} setOpen={setOpen} setWhere={setWhere} />
    </>
  );
}
