import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';

type Env = {
  __STATIC_CONTENT: KVNamespace;
  __STATIC_CONTENT_MANIFEST: string;
};

const app = new Hono<{ Bindings: Env }>();

// Redirect root to heic-to page
app.get('/', (c) => c.redirect('/heic-to'));

// Serve static files
app.get('/heic-to', serveStatic({ path: 'heic-to.html' }));
app.get('/heic-to.js', serveStatic({ path: 'heic-to.js' }));

// Catch-all route for any other static files
app.get('/*', serveStatic());

export default app;
