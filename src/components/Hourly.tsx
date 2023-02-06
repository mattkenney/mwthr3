import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useHourlyForecast } from '../hooks/nws';
import type { GridPoint, Period } from '../types/nws';
import { formatName } from './Forecast';

interface HourlyProps {
  gridPoint?: GridPoint;
  onClose?: () => void;
  open?: boolean;
  period?: Period;
}

function formatTime(str: string) {
  return new Date(str).toLocaleString(undefined, {
    hour: 'numeric',
  });
}

export function Hourly({ gridPoint, period, onClose, open }: HourlyProps) {
  const fullScreen = !useMediaQuery('(min-width:460px)');
  const result = useHourlyForecast(gridPoint);
  const periods = result.data?.properties?.periods;

  if (!periods) return null;

  const range = periods.filter(
    row =>
      (!period?.startTime || row.startTime >= period?.startTime) &&
      (!period?.endTime || row.endTime <= period?.endTime)
  );

  return (
    <Dialog fullScreen={fullScreen} onClose={onClose} open={!!open}>
      <DialogTitle>
        <Stack direction="row">
          {fullScreen && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
          <Typography sx={{ flexGrow: 1, padding: '1.2ex 0' }}>
            {period && formatName(period)}
          </Typography>
          {!fullScreen && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableBody>
            {range.map(row => (
              <TableRow key={row.startTime}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {formatTime(row.startTime)}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {row.temperature}
                  <Typography
                    component="span"
                    sx={{
                      display: 'inline-block',
                      fontSize: '95%',
                      paddingLeft: '0.2ex',
                    }}
                  >
                    {`\u00B0F`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>{row.shortForecast}</Box>
                  <Box>
                    <Typography
                      component="span"
                      sx={{
                        display: 'inline-block',
                        fontSize: '95%',
                        paddingRight: '0.6ex',
                      }}
                    >
                      Wind:
                    </Typography>
                    {`${row.windDirection} ${row.windSpeed.split(' ')[0]}`}
                    <Typography
                      component="span"
                      sx={{
                        display: 'inline-block',
                        fontSize: '95%',
                        paddingLeft: '0.6ex',
                      }}
                    >
                      mph
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
