import { MutableRefObject, useState } from 'react';

import { Spinner } from './Spinner';

export type SetBooleanFn = (value: boolean) => void;

/*
 * Using a ref to update state instead of lifting the state to prevent the map
 * from flashing while the user drags it.
 */
interface RadarSpinnerProps {
  spinnerRef: MutableRefObject<SetBooleanFn | undefined>;
}

export function RadarSpinner({ spinnerRef }: RadarSpinnerProps) {
  const [isLoading, setIsLoading] = useState(false);
  spinnerRef.current = setIsLoading;

  if (!isLoading) return null;

  return <Spinner />;
}
