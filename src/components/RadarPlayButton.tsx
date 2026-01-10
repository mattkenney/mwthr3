import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Button from '@mui/material/Button';

import { useRadarPlaying } from '../hooks/radar';

export function RadarPlayButton() {
  const { isPlaying, togglePlaying } = useRadarPlaying();

  return (
    <div className="leaflet-bottom leaflet-left">
      <div
        className="leaflet-bar leaflet-control"
        style={{ backgroundColor: 'white' }}
      >
        <Button onClick={togglePlaying} size="small" style={{ minWidth: 0 }}>
          {isPlaying ? (
            <PauseIcon fontSize="small" />
          ) : (
            <PlayArrowIcon fontSize="small" />
          )}
        </Button>
      </div>
    </div>
  );
}
