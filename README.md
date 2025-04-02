# Privacy-First Web Tools

A collection of client-side web tools and visualizations focused on simplicity and privacy. All processing happens directly in your browser - no data is sent to servers.

## 🌟 Features

- **Fractal Tree**: Explore the beauty of recursive fractal patterns
- **Golden Ratio**: Visualize and understand the golden ratio (φ ≈ 1.618)
- **Pi Visualization**: Interactive representation of π and its properties
- **Timer**: Simple countdown/timer utility
- **HEIC Converter**: Convert HEIC images to web formats entirely in your browser
- **WebAssembly Demo**: Showcase of client-side WebAssembly capabilities

## 🔒 Privacy Focus

All tools run entirely in your browser:
- No server-side processing
- No data collection
- No tracking
- No cookies

## 🚀 Deployment

This project is automatically deployed to Cloudflare Workers when changes are pushed to the main branch.

### Manual Deployment

```bash
# Install dependencies
npm ci

# Deploy to Cloudflare Workers
npx wrangler deploy
```

## 🛠️ Development

### Prerequisites

- Node.js 18 or higher
- npm
- Cloudflare account with Workers enabled

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/repository-name.git
   cd repository-name
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open your browser to the local development URL (typically http://localhost:8787)

## 📄 Pages

- **Home**: `/` - Main landing page with links to all visualizations
- **Fractal Tree**: `/fractal-tree` - Interactive fractal tree generator
- **Golden Ratio**: `/golden-ratio` - Golden ratio visualization
- **Pi Visualization**: `/pi-visualization` - Interactive π visualization
- **Timer**: `/timer` - Simple countdown timer
- **HEIC Converter**: `/heic` - Convert HEIC images to web formats
- **WebAssembly Demo**: `/wa` - WebAssembly demonstration

## 🔧 Technologies

- TypeScript
- Cloudflare Workers (for hosting only)
- WebAssembly (for client-side processing)
- HTML5 Canvas
- Modern JavaScript
- Zero server-side dependencies

## 📝 License

[MIT License](LICENSE)
