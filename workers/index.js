import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module';

const app = new Hono();

// Serve static files from the 'pages' directory
app.use('/pages/*', serveStatic({ root: './' }));

// Handle 404 for non-existent paths
app.notFound((c) => {
  return c.text('404 Not Found', 404);
});

export default app;
