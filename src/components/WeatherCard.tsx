import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ReactNode } from 'react';

import { Spinner } from '../components/Spinner';
import { Summary } from '../components/Summary';
import { useIsFetchingNws } from '../hooks/nws';
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
  const fetchingCount = useIsFetchingNws();
  const isLoading = fetchingCount > 0;

  return (
    <Card>
      <CardContent>
        {isLoading && (
          <Box sx={{ height: 0 }}>
            <Spinner />
          </Box>
        )}
        <Summary chooseWhere={chooseWhere} gridPoint={gridPoint} />
      </CardContent>
      {children}
    </Card>
  );
}
