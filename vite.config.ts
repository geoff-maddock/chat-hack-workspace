import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handler as chatHandler } from './src/api/chat';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function handleProxyRequest(req: any, res: any, retryCount = 0) {
  let body = '';
  req.on('data', chunk => body += chunk);

  req.on('end', async () => {
    try {
      const request = new Request('http://localhost:3000' + req.url, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body
      });

      console.log('Received request in handleProxyRequest:', req.method, req.url);

      const response = await chatHandler(request);
      const responseBody = await response.text();

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after-ms') || response.headers.get('retry-after');
        const retryDelay = retryAfter ? parseInt(retryAfter, 10) : 2000; // Default to 2 seconds if no header
        if (retryCount < 3) {
          console.warn(`Rate limit exceeded. Retrying after ${retryDelay}ms...`);
          await delay(retryDelay);
          return handleProxyRequest(req, res, retryCount + 1);
        } else {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }

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

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/chat': {
        target: 'http://localhost:3000',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req: any, res) => {
            handleProxyRequest(req, res);
          });
        }
      }
    }
  }
});