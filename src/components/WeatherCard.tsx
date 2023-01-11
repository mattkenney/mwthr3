import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { ReactNode } from 'react';

import { Summary } from '../components/Summary';
import { useIsFetching } from '../hooks/nws';
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
  const fetchingCount = useIsFetching();
  const isLoading = !gridPoint || fetchingCount > 0;

  return (
    <Card>
      <CardContent sx={{ minHeight: 64 }}>
        {isLoading && (
          <Box sx={{ height: 0, textAlign: 'center' }}>
            <CircularProgress size="1.6em" />
          </Box>
        )}
        <Summary chooseWhere={chooseWhere} gridPoint={gridPoint} />
      </CardContent>
      {children}
    </Card>
  );
}
