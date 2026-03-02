# AskPhilAI Chat

The user-facing chat interface for AskPhilAI. A polished, animated AI chatbot that calls the Anthropic API and reflects your admin portal configuration.

## Features

- **Live AI Chat** — Calls the Anthropic Messages API with your configured model, system prompt, and settings
- **Chat History Sidebar** — Tracks conversation sessions with a collapsible sidebar
- **Welcome Screen** — Branded landing with suggestion cards
- **Smooth Animations** — Slide-in bubbles, typing indicator, floating logo
- **Responsive** — Works on desktop and tablet
- **Configurable** — All branding and AI settings pulled from a central CONFIG object (matches your admin portal)

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
```

## Configuration

Edit the `CONFIG` object at the top of `src/App.jsx` to match your admin portal settings:

```js
const CONFIG = {
  brandName: "AskPhilAI",
  welcomeMessage: "Hello! I'm AskPhilAI. How can I help you today?",
  systemPrompt: "You are AskPhilAI, a helpful AI assistant...",
  model: "claude-sonnet-4-20250514",
  temperature: 0.7,
  maxTokens: 4096,
  accent: "#6366f1",        // Match your admin branding
  accentLight: "#818cf8",
  enableHistory: true,
};
```

> **Tip**: To connect this dynamically to your MCP server/admin portal, replace the `CONFIG` object with an API call to fetch settings from your backend.

## API Key

This GUI calls the Anthropic API directly from the browser. The API call is proxied through your hosting setup. For production, you should route requests through a backend proxy that attaches the API key server-side (never expose API keys client-side).

**Quick dev setup** — use a Vite proxy:

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      "/api/messages": {
        target: "https://api.anthropic.com/v1/messages",
        changeOrigin: true,
        rewrite: (path) => "",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      },
    },
  },
});
```

Then update `App.jsx` to call `/api/messages` instead of the direct Anthropic URL.

## Production Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview locally
```

The `dist/` folder is a fully static site — deploy anywhere (Vercel, Netlify, Cloudflare Pages, S3, etc).

## Project Structure

```
askphilai-chat-gui/
├── index.html            # Entry HTML with fonts
├── vite.config.js        # Vite configuration
├── package.json
├── public/
│   └── favicon.svg       # φ logo
├── src/
│   ├── main.jsx          # React mount
│   └── App.jsx           # Full chat GUI
└── dist/                 # Production build
```

## Design

- **Font**: Outfit (display) + JetBrains Mono (code)
- **Theme**: Deep dark (#09090b) with indigo accent
- **Animations**: Slide-in messages, floating logo, bouncing typing dots
- **Layout**: Optional sidebar + centered chat column with gradient input bar
