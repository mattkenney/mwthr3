import { useEffect, useState } from 'react';

export function useGeolocation() {
  const [position, setPosition] = useState(
    undefined as undefined | GeolocationPosition,
  );

  const success = (position: GeolocationPosition) => {
    setPosition(position);
  };

  const error = (positionError: GeolocationPositionError) => {
    console.error({ positionError });
  };

  const effect = () => navigator.geolocation.getCurrentPosition(success, error);

  useEffect(effect, []);

  return position;
}
