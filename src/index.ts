import { Hono } from 'hono';

// Create a new Hono app
const app = new Hono();

// Define routes
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hono Hello World</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f2f5;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #4a5568;
        }
        p {
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello, World!</h1>
        <p>Welcome to my Hono + Cloudflare Workers site.</p>
      </div>
    </body>
    </html>
  `);
});

// API endpoint example
app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from Hono API!',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the pages directory
app.get('/static/*', async (c) => {
  const path = c.req.path.replace('/static/', '');
  
  // For demonstration, we'll just serve the index.html file
  if (path === 'index.html' || path === '') {
    return c.redirect('/');
  }
  
  return c.notFound();
});

export default app;
