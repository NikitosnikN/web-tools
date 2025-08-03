import { Hono } from 'hono';

// Define the environment interface with ASSETS binding
interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
}

// Create a new Hono app with the Env interface
const app = new Hono<{ Bindings: Env }>();

// For all routes, use the ASSETS binding to serve static files from Next.js export
app.all('*', async (c) => {
  const url = new URL(c.req.url);
  let pathname = url.pathname;
  
  // For root, serve index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // For directory-like paths without extension, try appending .html
  if (!pathname.includes('.') && !pathname.endsWith('/')) {
    pathname = `${pathname}.html`;
  }
  
  // If path ends with /, try serving index.html from that directory
  if (pathname.endsWith('/') && pathname !== '/') {
    pathname = `${pathname}index.html`;
  }
  
  // Update the URL with the potentially modified pathname
  url.pathname = pathname;
  
  // Create a new request with the updated URL
  const newRequest = new Request(url.toString(), c.req.raw);
  
  try {
    // Use the ASSETS binding to fetch the static file
    const response = await c.env.ASSETS.fetch(newRequest);
    
    // If the file is found, return it
    if (response.ok) {
      return response;
    }
    
    // If not found, try the 404.html page
    const notFoundRequest = new Request(new URL('/404.html', c.req.url).toString());
    const notFoundResponse = await c.env.ASSETS.fetch(notFoundRequest);
    
    if (notFoundResponse.ok) {
      const content = await notFoundResponse.text();
      return c.html(content, 404);
    } else {
      // Fallback if 404.html can't be found
      return c.html(`
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
    console.error('Error serving file:', error);
    return c.text('An error occurred while serving the requested file', 500);
  }
});

export default app;