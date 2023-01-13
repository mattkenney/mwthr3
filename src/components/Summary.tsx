import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Place from '@mui/icons-material/Place';
import Refresh from '@mui/icons-material/Refresh';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { GridPoint } from '../types/nws';
import { getCityState, useRefresh } from '../hooks/nws';
import { useTemperature } from '../hooks/useTemperature';

interface SummaryProps {
  chooseWhere?: () => void;
  gridPoint?: GridPoint;
}

export function Summary({ chooseWhere, gridPoint }: SummaryProps) {
  const { city, state } = getCityState(gridPoint);
  const direction = useMediaQuery('(min-width:460px)') ? 'row' : 'column';
  const temp = useTemperature(gridPoint);
  const refresh = useRefresh();

  return (
    <Stack direction={direction} spacing={1}>
      {city && state && (
        <Box>
          <Chip
            icon={<Place />}
            label={`Location: ${city}, ${state}`}
            onClick={chooseWhere}
          />
        </Box>
      )}
      {temp && (
        <Box>
          <Chip
            icon={<Refresh />}
            label={`Now: ${temp} \u00B0F`}
            onClick={refresh}
          />
        </Box>
      )}
    </Stack>
  );
}
