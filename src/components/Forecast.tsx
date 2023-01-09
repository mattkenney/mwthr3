import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useForecast } from '../hooks/nws';
import type { GridPoint } from '../types/nws';

interface ForecastProps {
  gridPoint?: GridPoint;
}

export function Forecast({ gridPoint }: ForecastProps) {
  const result = useForecast(gridPoint);
  const periods = result.data?.properties?.periods;

  return (
    <>
      <Divider />
      <Table>
        <TableBody>
          {(periods ?? []).map(row => (
            <TableRow
              key={row.startTime}
              selected={!row.isDaytime}
              sx={{ verticalAlign: 'top' }}
            >
              <TableCell>
                <Box sx={{ fontWeight: '500' }}>
                  {row.name}:
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
                <Box>{row.detailedForecast}</Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
