import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Place from '@mui/icons-material/Place';
import Refresh from '@mui/icons-material/Refresh';
import WarningAmber from '@mui/icons-material/WarningAmber';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { GridPoint, Observation, WxAlerts } from '../types/nws';
import { useAlerts, getCityState, useRefresh } from '../hooks/nws';
import { useBestObservation } from '../hooks/useBestObservation';
import { WeatherAlert } from './WeatherAlert';

function makeAlertLabels(wx?: WxAlerts) {
  const distinct = new Set<string>();
  wx?.features?.forEach(feature => distinct.add(feature?.properties?.event));
  return Array.from(distinct.values())
    .filter(e => !!e)
    .sort();
}

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

export interface SummaryProps {
  chooseWhere?: () => void;
  gridPoint?: GridPoint;
}

export function Summary({ chooseWhere, gridPoint }: SummaryProps) {
  const { city, state } = getCityState(gridPoint);
  const observation = useBestObservation(gridPoint);
  const refresh = useRefresh();
  const [alertLabel, setAlertLabel] = useState('');
  const alerts = useAlerts(gridPoint);
  const alertLabels = makeAlertLabels(alerts?.data);
  const count =
    (city && state ? 1 : 0) +
    (observation ? 1 : 0) +
    (alertLabels ? alertLabels.length : 0);
  const isWide = useMediaQuery(`(min-width:${230 * count}px)`);

  return (
    <Stack
      direction={isWide ? 'row' : 'column'}
      spacing={1}
      sx={{ minHeight: isWide ? 32 : 72 }}
    >
      <WeatherAlert
        data={alerts?.data}
        onClose={() => setAlertLabel('')}
        title={alertLabel}
      />
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
      {alertLabels?.map(label => (
        <Box key={label}>
          <Chip
            icon={<WarningAmber />}
            label={label}
            onClick={() => setAlertLabel(label)}
          />
        </Box>
      ))}
    </Stack>
  );
}
