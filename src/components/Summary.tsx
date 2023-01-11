import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Place from '@mui/icons-material/Place';
import Refresh from '@mui/icons-material/Refresh';

import type { GridPoint } from '../types/nws';
import { getCityState, useRefresh } from '../hooks/nws';
import { useTemperature } from '../hooks/useTemperature';

interface SummaryProps {
  chooseWhere?: () => void;
  gridPoint?: GridPoint;
}

export function Summary({ chooseWhere, gridPoint }: SummaryProps) {
  const { city, state } = getCityState(gridPoint);
  const temp = useTemperature(gridPoint);
  const refresh = useRefresh();

  return (
    <Stack direction="row" spacing={1}>
      {city && state && (
        <Chip
          icon={<Place />}
          label={`Location: ${city}, ${state}`}
          onClick={chooseWhere}
        />
      )}
      {temp && (
        <Chip
          icon={<Refresh />}
          label={`Now: ${temp} \u00B0F`}
          onClick={refresh}
        />
      )}
    </Stack>
  );
}
