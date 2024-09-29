import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';

import './main.css';
import { App } from './App';
import { theme } from './theme';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);

  const queryClient = new QueryClient();

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container sx={{ paddingBottom: 2, paddingTop: 2 }}>
            <App />
          </Container>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
