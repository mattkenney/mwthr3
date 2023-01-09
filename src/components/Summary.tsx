import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import type { GridPoint } from '../types/nws';
import { getCityState } from '../hooks/nws';
import { useTemperature } from '../hooks/useTemperature';

interface SummaryProps {
  chooseWhere?: () => void;
  gridPoint?: GridPoint;
}

export function Summary({ chooseWhere, gridPoint }: SummaryProps) {
  const { city, state } = getCityState(gridPoint);
  const temp = useTemperature(gridPoint);

  return (
    <Stack direction="row" spacing={1}>
      {city && state && (
        <Chip label={`Location: ${city}, ${state}`} onClick={chooseWhere} />
      )}
      {temp && <Chip label={`Now: ${temp} \u00B0F`} />}
    </Stack>
  );
}
