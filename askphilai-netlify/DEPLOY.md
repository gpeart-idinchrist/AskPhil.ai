# AskPhilAI — Netlify Deployment Guide

Deploy your admin portal and user-facing chat as two separate Netlify sites.

---

## Overview

| Site | Directory | Purpose | URL (example) |
|------|-----------|---------|---------------|
| **Admin Portal** | `admin/` | Manage AI config, knowledge base, conversations | `askphilai-admin.netlify.app` |
| **Chat GUI** | `chat/` | User-facing AI chatbot | `askphilai.netlify.app` |

---

## Prerequisites

- A [Netlify account](https://app.netlify.com/signup) (free tier works)
- A GitHub repo (you said you have one)
- An [Anthropic API key](https://console.anthropic.com/) (for the chat GUI)

---

## Option A: Deploy via Netlify CLI (Fastest)

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
netlify login
```

### 2. Deploy the Admin Portal

```bash
cd admin
npm install
npm run build
netlify deploy --prod --dir=dist
```

Netlify will prompt you to create a new site — give it a name like `askphilai-admin`.

### 3. Deploy the Chat GUI

```bash
cd ../chat
npm install
npm run build
netlify deploy --prod --dir=dist --functions=netlify/functions
```

Give it a name like `askphilai-chat`.

### 4. Set the API Key for Chat

```bash
cd ../chat
netlify env:set ANTHROPIC_API_KEY "sk-ant-your-key-here"
```

Or set it in the Netlify dashboard: **Site Settings → Environment Variables → Add variable**

- Key: `ANTHROPIC_API_KEY`
- Value: your Anthropic API key

Then redeploy:

```bash
netlify deploy --prod --dir=dist --functions=netlify/functions
```

---

## Option B: Deploy via GitHub (Auto-Deploy on Push)

### 1. Push to Your Repo

Structure your repo however you like. Two common options:

**Option 1 — Monorepo (both in one repo):**
```
your-repo/
├── admin/          ← entire admin/ folder
├── chat/           ← entire chat/ folder
└── README.md
```

**Option 2 — Separate repos:**
Push `admin/` and `chat/` as individual repos.

### 2. Connect to Netlify

Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → Select your GitHub repo.

**For Admin Portal:**
| Setting | Value |
|---------|-------|
| Base directory | `admin` (if monorepo) |
| Build command | `npm run build` |
| Publish directory | `admin/dist` (or `dist` if separate repo) |

**For Chat GUI:**
| Setting | Value |
|---------|-------|
| Base directory | `chat` (if monorepo) |
| Build command | `npm run build` |
| Publish directory | `chat/dist` (or `dist` if separate repo) |
| Functions directory | `chat/netlify/functions` (or `netlify/functions`) |

### 3. Set Environment Variable for Chat

In the Netlify dashboard for the **chat** site:

**Site Settings** → **Environment Variables** → **Add a variable**

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-your-key-here` |

Click **Save**, then trigger a redeploy: **Deploys** → **Trigger deploy** → **Deploy site**.

---

## Option C: Drag & Drop (Quickest Test)

1. Build both projects locally:
   ```bash
   cd admin && npm install && npm run build
   cd ../chat && npm install && npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `admin/dist` folder → creates your admin site
4. Drag the `chat/dist` folder → creates your chat site

> **Note:** Drag & drop won't deploy the serverless function for the chat API proxy. You'll need the CLI or GitHub method for the chat site to work with real AI responses.

---

## How It Works

### Admin Portal
Static React app. No backend needed — all data is display/configuration only. Deploys as a simple static site.

### Chat GUI
- **Frontend** (`dist/`): React chat interface
- **Serverless function** (`netlify/functions/chat.mjs`): Proxies requests to the Anthropic API
- **Flow**: Browser → `/api/chat` → Netlify Function → Anthropic API → response back to browser
- **Security**: Your `ANTHROPIC_API_KEY` lives in Netlify's environment variables — never exposed to the browser

### Architecture Diagram
```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  User's      │────▶│  Netlify CDN     │────▶│  Static      │
│  Browser     │     │  (chat site)     │     │  React App   │
└──────┬───────┘     └──────────────────┘     └──────────────┘
       │
       │ POST /api/chat
       ▼
┌──────────────────┐     ┌──────────────────┐
│  Netlify         │────▶│  Anthropic API   │
│  Function        │     │  (with API key)  │
│  (chat.mjs)      │◀────│                  │
└──────────────────┘     └──────────────────┘
```

---

## Verify Deployment

### Admin Portal
Visit your admin URL — you should see the dark dashboard with sidebar navigation.

### Chat GUI
1. Visit your chat URL — you should see the welcome screen with the φ logo
2. Type a message and send
3. If you see an AI response → everything is working
4. If you see an error → check:
   - `ANTHROPIC_API_KEY` is set in Netlify environment variables
   - The function deployed (check **Functions** tab in Netlify dashboard)
   - Redeploy after setting the env var

---

## Custom Domains (Optional)

In the Netlify dashboard for each site:

**Domain management** → **Add custom domain**

Example:
- `admin.askphilai.com` → admin portal
- `chat.askphilai.com` → chat GUI

Netlify auto-provisions HTTPS via Let's Encrypt.

---

## File Reference

```
admin/
├── index.html              # Entry HTML
├── vite.config.js
├── package.json
├── netlify.toml            # Netlify build + SPA routing
├── public/favicon.svg
└── src/
    ├── main.jsx
    └── App.jsx             # Full admin dashboard

chat/
├── index.html              # Entry HTML
├── vite.config.js
├── package.json
├── netlify.toml            # Build + function proxy + SPA routing
├── public/favicon.svg
├── netlify/
│   └── functions/
│       └── chat.mjs        # Serverless API proxy
└── src/
    ├── main.jsx
    └── App.jsx             # Full chat GUI
```
