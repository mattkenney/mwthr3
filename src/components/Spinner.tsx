import { MutableRefObject, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export type SetBooleanFn = (value: boolean) => void;

/*
 * Using a ref to update state instead of lifting the state to prevent the map
 * from flashing while the user drags it.
 */
interface SpinnerProps {
  spinnerRef: MutableRefObject<SetBooleanFn | undefined>;
}

export function Spinner({ spinnerRef }: SpinnerProps) {
  const [isLoading, setIsLoading] = useState(false);
  spinnerRef.current = setIsLoading;

  if (!isLoading) return null;

  return (
    <CircularProgress
      sx={{
        left: '50%',
        margin: '0 -20px',
        position: 'relative',
        top: '45%',
        zIndex: 1000,
      }}
    />
  );
}
