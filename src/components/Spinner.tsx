import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export function Spinner() {
  return (
    <>
      <CircularProgress
        sx={{
          height: 0,
          left: '50%',
          margin: '0 -20px',
          position: 'relative',
          top: '45%',
          zIndex: 1000,
        }}
      />
      <Box
        sx={{
          bottom: 0,
          fontSize: '1rem',
          fontStyle: 'italic',
          left: 0,
          padding: '0.5ex 1ex',
          position: 'fixed',
          textShadow:
            '-1px -1px 0 #eee, 1px -1px 0 #eee, -1px 1px 0 #eee, 1px 1px 0 #eee',
          zIndex: 1000,
        }}
      >
        Getting weather data from US NWS...
      </Box>
    </>
  );
}
