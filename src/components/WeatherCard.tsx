import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { ReactNode } from 'react';

import { Summary } from '../components/Summary';
import type { GridPoint } from '../types/nws';

interface WeatherCardProps {
  children?: ReactNode;
  chooseWhere?: () => void;
  gridPoint?: GridPoint;
}

export function WeatherCard({
  children,
  chooseWhere,
  gridPoint,
}: WeatherCardProps) {
  return (
    <Card>
      <CardContent>
        <Summary chooseWhere={chooseWhere} gridPoint={gridPoint} />
        {!gridPoint && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size="1.6em" />
          </Box>
        )}
      </CardContent>
      {children}
    </Card>
  );
}
