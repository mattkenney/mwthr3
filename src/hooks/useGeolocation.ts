import { useEffect, useState } from 'react';

import { logger } from '../logger';

export function useGeolocation() {
  const [position, setPosition] = useState(
    undefined as undefined | GeolocationPosition,
  );

  const success = (position: GeolocationPosition) => {
    setPosition(position);
  };

  const error = (positionError: GeolocationPositionError) => {
    logger.error({ positionError });
  };

  const effect = () => navigator.geolocation.getCurrentPosition(success, error);

  useEffect(effect, []);

  return position;
}
