import { Hono } from 'hono';

// Define the environment interface with ASSETS binding
interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

// Create a new Hono app with the Env interface
const app = new Hono<{ Bindings: Env }>();

// For all other routes, use the ASSETS binding to serve static files
app.all('*', async (c) => {
  const url = new URL(c.req.url);
  let pathname = url.pathname;
  
  // Redirect root to index.html
  if (pathname === '/') {
    pathname = '/index.html';
  } else {
    // Validate the path to prevent directory traversal and other security issues
    // Only allow alphanumeric characters, hyphens, underscores, forward slashes, and periods
    const validPathRegex = /^[a-zA-Z0-9\-_\/\.]+$/;
    if (!validPathRegex.test(pathname)) {
      return new Response('Invalid path', { status: 400 });
    }
    
    // Prevent path traversal attempts
    if (pathname.includes('..')) {
      return new Response('Forbidden', { status: 403 });
    }
    
    // If path doesn't end with .html or another extension, append .html
    if (!pathname.includes('.')) {
      pathname = `${pathname}.html`;
    }
  }
  
  // Update the URL with the potentially modified pathname
  url.pathname = pathname;
  
  // Create a new request with the updated URL
  const newRequest = new Request(url.toString(), c.req.raw);
  
  // Use the ASSETS binding to fetch the static file
  return await c.env.ASSETS.fetch(newRequest);
});

export default app;
