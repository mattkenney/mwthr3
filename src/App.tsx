import { useState } from 'react';

import { AppRoutes } from './components/AppRoutes';
import { Where } from './components/Where';

export function App() {
  const [open, setOpen] = useState(false);
  const [where, setWhere] = useState('');
  return (
    <>
      <AppRoutes chooseWhere={() => setOpen(true)} where={where} />
      <Where open={open} setOpen={setOpen} setWhere={setWhere} />
    </>
  );
}
