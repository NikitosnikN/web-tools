import { Hono } from 'hono';
import { html } from 'hono/html';

// Define the environment interface with ASSETS binding
interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

// Create a new Hono app with the Env interface
const app = new Hono<{ Bindings: Env }>();

// Custom 404 handler
app.notFound(async (c) => {
  try {
    // Try to fetch the custom 404 page
    const notFoundRequest = new Request(new URL('/404.html', c.req.url).toString());
    const notFoundResponse = await c.env.ASSETS.fetch(notFoundRequest);
    
    if (notFoundResponse.ok) {
      const content = await notFoundResponse.text();
      return c.html(content, 404);
    } else {
      // Fallback if 404.html can't be found
      return c.html(html`
        <!DOCTYPE html>
        <html>
          <head>
            <title>404 - Not Found</title>
          </head>
          <body>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go back to homepage</a>
          </body>
        </html>
      `, 404);
    }
  } catch (error) {
    console.error('Error serving 404 page:', error);
    return c.text('404 - Page Not Found', 404);
  }
});

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
      return c.text('Invalid path', 400);
    }
    
    // Prevent path traversal attempts
    if (pathname.includes('..')) {
      return c.text('Forbidden', 403);
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
  
  try {
    // Use the ASSETS binding to fetch the static file
    const response = await c.env.ASSETS.fetch(newRequest);
    
    // If the file is not found, let Hono's notFound handler take over
    if (!response.ok && response.status === 404) {
      return c.notFound();
    }
    
    // Return the successful response
    return response;
  } catch (error) {
    console.error('Error serving file:', error);
    
    // Fallback to a simple error message if something goes wrong
    return c.text('An error occurred while serving the requested file', 500);
  }
});

export default app;
