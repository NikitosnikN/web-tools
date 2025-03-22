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
  
  try {
    // Use the ASSETS binding to fetch the static file
    const response = await c.env.ASSETS.fetch(newRequest);
    
    // If the response is not ok (e.g., 404), serve the custom 404 page
    if (!response.ok && response.status === 404) {
      // Create a new request for the 404 page
      const notFoundRequest = new Request(new URL('/404.html', c.req.url).toString(), c.req.raw);
      const notFoundResponse = await c.env.ASSETS.fetch(notFoundRequest);
      
      // Return the 404 page with the correct status code
      return new Response(notFoundResponse.body, {
        status: 404,
        headers: notFoundResponse.headers
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error serving file:', error);
    
    // Fallback to a simple error message if something goes wrong
    return new Response('An error occurred while serving the requested file', { 
      status: 500 
    });
  }
});

export default app;
