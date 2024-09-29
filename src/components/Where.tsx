import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type Row = [string, number, number];

export const fallback = '40.6509,-74.0113';

let count = 0;

function makeError(
  currentCount: number,
  setIsError: (flag: boolean) => void,
  setIsLocating: (flag: boolean) => void,
  setWhere?: (where: string) => void,
) {
  return (positionError: GeolocationPositionError) => {
    console.error({ count, currentCount, positionError });
    if (currentCount !== count) return;

    setIsError(true);
    setIsLocating(false);
    setWhere && setWhere(fallback);
  };
}

function makeSuccess(
  currentCount: number,
  setIsLocating: (flag: boolean) => void,
  setWhere?: (where: string) => void,
) {
  return (position: GeolocationPosition) => {
    if (currentCount !== count) return;

    const coords =
      position?.coords &&
      [position.coords.latitude, position.coords.longitude].join();
    if (coords && setWhere) {
      setWhere(coords);
    }
    setIsLocating(false);
  };
}

interface WhereProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  setWhere?: (where: string) => void;
}

export function Where({ open, setOpen, setWhere }: WhereProps) {
  const [isLocating, setIsLocating] = useState(true);
  const [isError, setIsError] = useState(false);

  const getWhere = () => {
    if (navigator.geolocation) {
      count++;
      navigator.geolocation.getCurrentPosition(
        makeSuccess(count, setIsLocating, setWhere),
        makeError(count, setIsError, setIsLocating, setWhere),
      );
    } else {
      setIsLocating(false);
      setWhere && setWhere(fallback);
    }
  };

  useEffect(getWhere, []);

  const [value, setValue] = useState('');
  const url = /^[0-9a-z]/i.test(value)
    ? `/data/${value[0].toLowerCase()}.json`
    : undefined;
  const result = useQuery({
    enabled: !!url,
    queryKey: [url, value],
    queryFn: async () => {
      const res = await fetch(url ?? '');
      const rows = (await res.json()) as Row[];
      const prefix = value.toLowerCase();
      return rows
        .filter(row => row[0].toLowerCase().startsWith(prefix))
        .slice(0, 7);
    },
  });
  const options = result.data?.map(row => row[0]) ?? [];

  const handleCancel = () => {
    setValue('');
    setIsError(false);
    setIsLocating(false);
    setOpen && setOpen(false);
  };

  const handleClear = () => {
    setValue('');
    setWhere && setWhere('');
    setOpen && setOpen(false);
    setIsError(false);
    setIsLocating(true);
    getWhere();
  };

  const handleOK = () => {
    const prefix = value.toLowerCase();
    const where = result.data
      ?.find(row => row[0].toLowerCase().startsWith(prefix))
      ?.slice(1)
      .join();
    setValue('');
    setWhere && setWhere(where ?? fallback);
    setOpen && setOpen(false);
  };

  const handleStop = () => {
    // increment the count to cancel pending callbacks
    count++;
    setWhere && setWhere(fallback);
    setIsLocating(false);
  };

  return (
    <>
      <Dialog open={isLocating} onClose={handleStop}>
        <DialogTitle>Finding your location...</DialogTitle>
        <DialogActions>
          <Button onClick={handleStop}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!open} onClose={handleCancel}>
        <DialogTitle>Location Search</DialogTitle>
        <DialogContent>
          <Autocomplete
            noOptionsText="No search results"
            onChange={(_evt, v) => setValue(v ?? '')}
            options={options}
            sx={{ width: 275 }}
            renderInput={params => (
              <TextField
                autoFocus
                margin="dense"
                label="City"
                onChange={evt => setValue(evt.target.value)}
                type="email"
                value={value}
                variant="standard"
                {...params}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleOK}>OK</Button>
        </DialogActions>
        <Divider />
        <DialogActions>
          <Button onClick={handleClear}>Use current location</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        key="location"
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        message={'Couldn\u2019t find your location'}
        onClose={() => setIsError(false)}
        open={isError}
      />
    </>
  );
}
