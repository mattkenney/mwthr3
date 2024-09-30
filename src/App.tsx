import Snackbar from '@mui/material/Snackbar';
import { lazy, Suspense, useEffect, useState } from 'react';

import { AppRoutes } from './components/AppRoutes';
import { useGridPoint } from './hooks/nws';

const Where = lazy(() => import('./components/Where'));

const fallback = '40.6509,-74.0113';

export function App() {
  const [chooseOpen, setChooseOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [where, setWhere] = useState('');
  const result = useGridPoint(where);
  const gridPoint = result.data;
  const isError = !!result.error;
  useEffect(() => {
    if (isError) {
      setSnackbarOpen(true);
      setWhere(fallback);
    }
  }, [where, isError]);
  return (
    <>
      <AppRoutes
        chooseWhere={() => setChooseOpen(true)}
        gridPoint={gridPoint}
      />
      <Suspense>
        <Where
          fallback={fallback}
          open={chooseOpen}
          setOpen={setChooseOpen}
          setWhere={setWhere}
        />
      </Suspense>
      <Snackbar
        key="gridpoint"
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        message={'Couldn\u2019t find your location in USA'}
        onClose={() => setSnackbarOpen(false)}
        open={snackbarOpen}
      />
    </>
  );
}
