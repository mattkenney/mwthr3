import { readFileSync } from 'node:fs';
import { defineConfig, type ServerOptions } from 'vite';
import react from '@vitejs/plugin-react';

let server: ServerOptions | undefined;

try {
  const cert = readFileSync('cert.local/live/mwthr.com/fullchain.pem');
  const key = readFileSync('cert.local/live/mwthr.com/privkey.pem');
  server = {
    hmr: {
      host: 'mwthr.com',
    },
    host: '0.0.0.0',
    https: { cert, key },
    port: 443,
  };
  console.log('HTTPS enabled - add "mwthr.com" to /etc/hosts to use');
} catch (ex) {
  console.log('cert and key found - not enabling https');
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server,
});
