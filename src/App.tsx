import Snackbar from '@mui/material/Snackbar';
import { useEffect, useState } from 'react';

import { AppRoutes } from './components/AppRoutes';
import { fallback, Where } from './components/Where';
import { useGridPoint } from './hooks/nws';

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
      <Where open={chooseOpen} setOpen={setChooseOpen} setWhere={setWhere} />
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
