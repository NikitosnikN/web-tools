import { Hono } from 'hono';

// Define the environment interface with ASSETS binding
interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

// Create a new Hono app with the Env interface
const app = new Hono<{ Bindings: Env }>();

// API endpoint example
app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from Hono API!',
    timestamp: new Date().toISOString()
  });
});

// For all other routes, use the ASSETS binding to serve static files
app.all('*', async (c) => {
  const url = new URL(c.req.url);
  
  // Redirect root to index.html
  if (url.pathname === '/') {
    url.pathname = '/index.html';
  }
  
  // Use the ASSETS binding to fetch the static file
  return await c.env.ASSETS.fetch(c.req.raw);
});

export default app;
