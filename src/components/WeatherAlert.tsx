import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import type { WxAlerts } from '../types/nws';

export interface WeatherAlertProps {
  data?: WxAlerts;
  onClose?: () => void;
  title?: string;
}

export function WeatherAlert({ data, onClose, title }: WeatherAlertProps) {
  const features = data?.features?.filter(
    feature => feature?.properties?.event === title
  );

  return (
    <Dialog open={!!features?.length} onClose={onClose} maxWidth="lg">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            backgroundColor: '#f4f4f4',
            borderRadius: '0.5ex',
            color: '#111',
            fontFamily: 'monospace',
            fontSize: '9pt',
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
                {feature?.properties?.description}
              </Box>
            </Box>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
