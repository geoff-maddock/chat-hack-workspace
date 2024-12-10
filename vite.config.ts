import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handler as chatHandler } from './src/api/chat';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
import { IncomingMessage, ServerResponse } from 'http';

let proxyCount = 0;

async function handleProxyRequest(req: IncomingMessage, res: ServerResponse, retryCount = 0) {
  let body = '';
  req.on('data', chunk => body += chunk);

  // added to prevent infinite loop
  if (proxyCount > 5) {
    throw new Error('Proxy loop detected');
  }

  req.on('end', async () => {
    proxyCount++;
    if (proxyCount > 1) {
      console.log(`Proxy request ${proxyCount} for ${req.url}`);
    }
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
  plugins: [react(),
  {
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res, next) => {

        // Handle /api/users route
        if (req.method === 'POST') {

          handleProxyRequest(req, res);

          return
        }
        next()
      })
    }
  }
  ],
  server: {
    open: true,
  }
});