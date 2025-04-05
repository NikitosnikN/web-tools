# Web Tools

## Main Goal
The main goal of this project is to create a set of small, client-first web applications focused on simplicity and privacy. All processing happens directly in the user's browser - no data is sent to servers, ensuring complete privacy and security.

## Project Structure

```
root
├── .github/workflows/      # CI/CD workflows for automatic deployment
├── src/                    # Source code directory
│   ├── index.ts            # Main application entry point using Hono framework
│   └── pages/              # Individual tool pages as HTML files
│       ├── 404.html        # Custom 404 error page
│       ├── fractal-tree.html  # Fractal tree visualization tool
│       ├── golden-ratio.html  # Golden ratio visualization tool
│       ├── heic.html       # HEIC image converter tool
│       ├── index.html      # Main landing page with links to all tools
│       ├── pi-visualization.html  # Pi visualization tool
│       ├── template.html   # Template for creating new tools
│       ├── timer.html      # Breathing timer tool
│       └── wa.html         # WhatsApp link generator tool
├── .gitignore              # Git ignore file
├── .gitlab-ci.yml          # GitLab CI configuration
├── LICENSE                 # Project license (MIT)
├── package.json            # NPM package configuration
├── package-lock.json       # NPM dependency lock file
├── README.md               # Project documentation
├── tsconfig.json           # TypeScript configuration
└── wrangler.toml           # Cloudflare Workers configuration
```

## Technical Information

### Architecture Overview

This project is a collection of client-side web tools and visualizations built with a focus on privacy. The application is structured as a Cloudflare Workers site using the Hono framework for routing and serving static HTML files.

Key architectural features:
- **Client-first approach**: All processing happens in the browser
- **Zero server-side processing**: No user data is sent to any server
- **Static file serving**: HTML/CSS/JS files served directly from Cloudflare's edge
- **Privacy by design**: No tracking, no cookies, no data collection

### Technology Stack

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - TailwindCSS (loaded via CDN)
  - Font Awesome (for icons)
  - Various specialized libraries (heic-to, JSZip, FileSaver)
  - Canvas API for visualizations

- **Backend/Infrastructure**:
  - TypeScript
  - Hono (lightweight web framework)
  - Cloudflare Workers (for hosting and edge delivery)
  - GitHub Actions (for CI/CD)

### Available Tools

1. **HEIC Converter**: Convert iPhone HEIC photos to PNG or JPEG format entirely in the browser
   - Uses the `heic-to` library for conversion
   - Supports batch processing and downloading as ZIP
   - Provides detailed error handling and debugging information

2. **Fractal Tree Generator**: Create beautiful fractal trees with customizable parameters
   - Interactive canvas-based visualization
   - Adjustable parameters (iterations, branch length, angles, etc.)
   - Animation capabilities with adjustable speed
   - Download generated images as PNG

3. **Golden Ratio Visualization**: Interactive 3D visualization of the Golden Ratio spiral
   - Demonstrates the mathematical concept visually
   - Educational tool for understanding this important ratio

4. **Pi Visualization**: Interactive representation of π and its properties
   - Visualizes the relationship between a circle's circumference and diameter
   - Educational mathematical tool

5. **Breathing Timer**: Simple countdown/timer utility for breathing exercises
   - Customizable durations
   - Visual feedback for breathing exercises

6. **WhatsApp Link Generator**: Create WhatsApp chat links without saving contacts
   - Utility tool for quick communication

### Deployment

The project is automatically deployed to Cloudflare Workers when changes are pushed to the main branch using GitHub Actions. The deployment workflow is defined in `.github/workflows/deploy.yml`.

Custom domains:
- tools.belikewater.xyz
- tools.nikitayugov.com

### Development Guidelines

#### Adding a New Tool

1. Create a new HTML file in the `src/pages/` directory
2. Use `template.html` as a starting point for consistent styling
3. Implement client-side functionality using JavaScript
4. Add the tool to the grid in `index.html`
5. Update README.md to include the new tool

#### Best Practices

- **Privacy First**: Never send user data to external servers
- **Performance**: Optimize for speed and minimal resource usage
- **Accessibility**: Ensure tools work across devices and browsers
- **Dark Mode**: Support both light and dark themes
- **Error Handling**: Provide clear feedback for any issues
- **Documentation**: Comment code and update README as needed

#### Local Development

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Access the local development URL (typically http://localhost:8787)

### External Dependencies

- **CDN Resources**:
  - TailwindCSS: `https://cdn.tailwindcss.com`
  - Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
  - heic-to: `https://cdn.jsdelivr.net/npm/heic-to@1.1.0/dist/heic-to.min.js`
  - JSZip: `https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js`
  - FileSaver: `https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js`

- **NPM Dependencies**:
  - @cloudflare/workers-types: TypeScript types for Cloudflare Workers
  - hono: Lightweight web framework
  - typescript: Language support
  - wrangler: Cloudflare Workers CLI tool
