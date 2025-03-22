import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';

// Create a new Hono app
const app = new Hono();

// Redirect root to index.html
app.get('/', (c) => c.redirect('/index.html'));

// API endpoint example
app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from Hono API!',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the pages directory
app.get('/*', serveStatic({ root: './src/pages' }));

export default app;
