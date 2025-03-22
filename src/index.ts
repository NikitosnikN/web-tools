import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';

const app = new Hono();

// Serve static files from the pages directory
app.get('/heic-to', serveStatic({ path: './heic-to.html', root: './src/pages' }));
app.get('/heic-to.js', serveStatic({ path: './heic-to.js', root: './src/pages' }));

// Redirect root to heic-to page
app.get('/', (c) => c.redirect('/heic-to'));

// Catch-all route for any other static files in the pages directory
app.get('/*', serveStatic({ root: './src/pages' }));

export default app;
