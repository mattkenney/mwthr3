import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Place from '@mui/icons-material/Place';
import Refresh from '@mui/icons-material/Refresh';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { GridPoint, Observation } from '../types/nws';
import { getCityState, useRefresh } from '../hooks/nws';
import { useBestObservation } from '../hooks/useBestObservation';

function makeObservationLabel(obs: Observation) {
  const parts = [];

  const props = obs?.properties;
  if (typeof props?.temperature?.value === 'number') {
    parts.push('Now: ', props.temperature.value, ' \u00B0F');
  }
  if (typeof props?.windSpeed?.value === 'number') {
    parts.push(parts.length ? ', ' : 'Now: ');
    parts.push(props.windSpeed.value);
    if (typeof props.windGust?.value === 'number') {
      parts.push('-', props.windGust.value);
    }
    parts.push(' \u1D0D\u1D18\u029C');
  }

  return parts.join('');
}

interface SummaryProps {
  chooseWhere?: () => void;
  gridPoint?: GridPoint;
}

export function Summary({ chooseWhere, gridPoint }: SummaryProps) {
  const { city, state } = getCityState(gridPoint);
  const isWide = useMediaQuery('(min-width:460px)');
  const observation = useBestObservation(gridPoint);
  const refresh = useRefresh();

  return (
    <Stack
      direction={isWide ? 'row' : 'column'}
      spacing={1}
      sx={{ minHeight: isWide ? 32 : 72 }}
    >
      {city && state && (
        <Box>
          <Chip
            icon={<Place />}
            label={`Location: ${city}, ${state}`}
            onClick={chooseWhere}
          />
        </Box>
      )}
      {observation && (
        <Box>
          <Chip
            icon={<Refresh />}
            label={makeObservationLabel(observation)}
            onClick={refresh}
          />
        </Box>
      )}
    </Stack>
  );
}
