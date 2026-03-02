# AskPhilAI Admin Portal

Dark-themed admin dashboard for managing your AskPhilAI chatbot instance.

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
```

## Production Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the build locally
```

The `dist/` folder is a fully static site you can deploy anywhere.

## Deploy Options

### Vercel
```bash
# From your repo root:
npx vercel
```
Or connect your GitHub repo at [vercel.com](https://vercel.com) — it auto-detects Vite.

### Netlify
Drag & drop the `dist/` folder at [app.netlify.com/drop](https://app.netlify.com/drop), or connect your repo with:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

### Any Static Host (S3, Cloudflare Pages, etc.)
Upload the contents of `dist/` to your host's public directory.

## Project Structure

```
askphilai-admin-portal/
├── index.html              # Entry HTML with font loading
├── vite.config.js          # Vite configuration
├── package.json
├── public/
│   └── favicon.svg         # φ logo favicon
├── src/
│   ├── main.jsx            # React entry point
│   └── App.jsx             # Full admin dashboard (single-file)
└── dist/                   # Production build output
```
