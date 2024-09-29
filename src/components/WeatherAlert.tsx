import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { WxAlerts } from '../types/nws';

const rewrap = (text: string) =>
  text.replaceAll(/(?<=[,A-Za-z])\n(?=[A-Za-z])/g, ' ');

export interface WeatherAlertProps {
  data?: WxAlerts;
  onClose?: () => void;
  title?: string;
}

export function WeatherAlert({ data, onClose, title }: WeatherAlertProps) {
  const fullScreen = !useMediaQuery('(min-width:460px)');

  const features = data?.features?.filter(
    feature => feature?.properties?.event === title,
  );

  return (
    <Dialog fullScreen={fullScreen} open={!!features?.length} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row">
          {fullScreen && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
          <Typography sx={{ flexGrow: 1, padding: '1.2ex 0' }}>
            {title}
          </Typography>
          {!fullScreen && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            backgroundColor: '#f4f4f4',
            borderRadius: '0.5ex',
            color: '#111',
            padding: '1ex',
            whiteSpace: 'pre-wrap',
          }}
        >
          {features?.map(feature => (
            <Box key={feature.id}>
              <Box sx={{ fontWeight: 'bold' }}>
                {feature?.properties?.headline}
              </Box>
              <Box sx={{ paddingBottom: '3ex' }}>
                {rewrap(feature?.properties?.description)}
              </Box>
            </Box>
          ))}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
