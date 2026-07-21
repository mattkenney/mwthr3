import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Cyclone from '@mui/icons-material/Cyclone';

import type { Storm } from '../hooks/useTropics';

interface StormListProps {
  onSelect: (storm: Storm) => void;
  storms: Storm[];
}

export function StormList({ onSelect, storms }: StormListProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        left: 10,
        // leave room on the right for the top-right zoom control
        maxWidth: 'calc(100% - 64px)',
        p: 1,
        position: 'absolute',
        top: 10,
        zIndex: 1000,
      }}
    >
      <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap={true}>
        {storms.map(storm => (
          <Chip
            icon={<Cyclone />}
            key={storm.label}
            label={storm.name}
            onClick={() => onSelect(storm)}
            size="small"
          />
        ))}
      </Stack>
    </Paper>
  );
}
