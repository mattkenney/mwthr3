import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type Row = [string, number, number];

interface WhereProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  setWhere?: (where: string) => void;
}

export function Where({ open, setOpen, setWhere }: WhereProps) {
  const [value, setValue] = useState('');
  const url = /^[a-z]/i.test(value)
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
    setOpen && setOpen(false);
  };

  const handleClear = () => {
    setValue('');
    setWhere && setWhere('');
    setOpen && setOpen(false);
  };

  const handleOK = () => {
    const prefix = value.toLowerCase();
    const where = result.data
      ?.find(row => row[0].toLowerCase().startsWith(prefix))
      ?.slice(1)
      .join();
    setValue('');
    setWhere && setWhere(where ?? '');
    setOpen && setOpen(false);
  };

  return (
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
        <Button onClick={handleClear}>Use current location</Button>
      </DialogActions>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOK}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
