import { ElementType } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';

import logo from '../logo.svg';

const height = 96;

interface TabInfo {
  label: string;
  to: string;
}

interface AppBarTabsProps {
  component: ElementType;
  tabs: TabInfo[];
  value: string;
}

export function AppBarTabs({ component, tabs, value }: AppBarTabsProps) {
  const centered = useMediaQuery('(min-width:460px)');
  const variant = centered ? 'standard' : 'fullWidth';
  return (
    <Box sx={{ height: height }}>
      <AppBar sx={{ height }}>
        <Box sx={{ margin: 'auto' }}>
          <img alt="mwthr" src={logo} />
        </Box>
        <Tabs
          centered={centered}
          indicatorColor="secondary"
          textColor="inherit"
          value={value}
          variant={variant}
        >
          {tabs.map(tab => (
            <Tab
              key={tab.to}
              component={component}
              label={tab.label}
              to={`../${tab.to}`}
              value={tab.to}
            />
          ))}
        </Tabs>
      </AppBar>
    </Box>
  );
}
