import { Hono } from 'hono';
import fs from 'node:fs';
import path from 'node:path';

const app = new Hono();

// Redirect root to heic-to page
app.get('/', (c) => c.redirect('/heic-to'));

// Serve static files from the pages directory
app.get('/heic-to', async (c) => {
  const content = await fs.promises.readFile(path.join(process.cwd(), 'src/pages/heic-to.html'), 'utf8');
  return c.html(content);
});

app.get('/heic-to.js', async (c) => {
  const content = await fs.promises.readFile(path.join(process.cwd(), 'src/pages/heic-to.js'), 'utf8');
  return c.header('Content-Type', 'application/javascript').body(content);
});

// Catch-all route for any other static files in the pages directory
app.get('/*', async (c) => {
  const filePath = c.req.path.replace(/^\//, '');
  try {
    const content = await fs.promises.readFile(path.join(process.cwd(), 'src/pages', filePath), 'utf8');
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    
    if (ext === '.html') contentType = 'text/html';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.json') contentType = 'application/json';
    
    return c.header('Content-Type', contentType).body(content);
  } catch (error) {
    return c.notFound();
  }
});

export default app;
