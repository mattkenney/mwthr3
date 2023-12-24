import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Schedule from '@mui/icons-material/Schedule';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';

import { useForecast } from '../hooks/nws';
import type { GridPoint, Period } from '../types/nws';
import { Hourly } from './Hourly';

function formatDate(str: string) {
  return new Date(str).toLocaleString(undefined, {
    month: 'numeric',
    day: 'numeric',
  });
}

export function formatName(row: Period) {
  if (row.isDaytime) {
    const when = formatDate(row.startTime);
    return `${row.name} ${when}`;
  }
  return row.name;
}

interface ForecastProps {
  gridPoint?: GridPoint;
}

export function Forecast({ gridPoint }: ForecastProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const result = useForecast(gridPoint);
  const periods = result.data?.properties?.periods;
  const hash = location.hash.substring(1);
  const n = /^[1-9][0-9]*$/.test(hash) ? Number(hash) : 0;
  const hourlyPeriod = periods?.[n - 1];

  if (result.isError) {
    return (
      <>
        <Divider />
        <Alert severity="error">
          Something went wrong getting the forecast from the NWS.
        </Alert>
      </>
    );
  }

  if (!periods) return null;

  return (
    <>
      <Divider />
      <Table>
        <TableBody>
          {periods.map((row, n, rows) => (
            <TableRow
              key={row.startTime}
              selected={!row.isDaytime}
              sx={{ verticalAlign: 'top' }}
            >
              <TableCell>
                <Stack>
                  <Box sx={{ fontWeight: '500' }}>
                    {formatName(row)}:
                    <Typography
                      component="span"
                      sx={{
                        display: 'inline-block',
                        fontSize: '95%',
                        padding: '0 0.5ex 0 1ex',
                      }}
                    >
                      {row.isDaytime ? '\u2264' : '\u2265'}
                    </Typography>
                    {row.temperature}
                    <Typography
                      component="span"
                      sx={{
                        display: 'inline-block',
                        fontSize: '95%',
                        padding: '0 0.8ex 0 0.2ex',
                      }}
                    >
                      {`\u00B0F`}
                    </Typography>
                    {row.shortForecast}
                  </Box>
                  <Box>
                    {row.detailedForecast}
                    {n + 1 < rows.length && (
                      <IconButton
                        onClick={() => navigate(`#${n + 1}`)}
                        sx={{ float: 'right' }}
                      >
                        <Schedule />
                      </IconButton>
                    )}
                  </Box>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {hourlyPeriod && (
        <Hourly
          gridPoint={gridPoint}
          onClose={() => navigate('#')}
          open={true}
          period={hourlyPeriod}
        />
      )}
    </>
  );
}
