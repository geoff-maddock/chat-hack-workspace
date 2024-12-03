import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handler as chatHandler } from './src/api/chat';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/chat': {
        target: 'http://localhost:3000',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req: any, res) => {
            if (req.url === '/api/chat') {
              let body = '';
              req.on('data', chunk => body += chunk);

              req.on('end', async () => {
                try {
                  const request = new Request('http://localhost:3000' + req.url, {
                    method: req.method,
                    headers: req.headers as Record<string, string>,
                    body
                  });

                  const response = await chatHandler(request);
                  const responseBody = await response.text();

                  if (!res.headersSent) {
                    response.headers.forEach((value, key) => {
                      res.setHeader(key, value);
                    });
                    res.statusCode = response.status;
                    res.end(responseBody);
                  }
                } catch (error) {
                  if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                  }
                }
              });
            }
          });
        }
      }
    }
  }
});