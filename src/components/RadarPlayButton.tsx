import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Button from '@mui/material/Button';

import { useRadarPlaying } from '../hooks/radar';

/*
// round down to last even minute
const twoMinMillis = 2 * 60 *1000;
const roundNow = () => Math.floor(Date.now() / twoMinMillis);

function time(timestamp: number, progress: number) {
  const r = new Date((timestamp - ((26 - progress/4)%26)) * twoMinMillis).toISOString();
  console.log(r, timestamp, progress);
  return r;
}
*/

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
