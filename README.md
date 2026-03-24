# ⚡ APITester

A fast, lightweight Postman alternative that runs entirely in the browser. No accounts, no cloud, no BS.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **HTTP Methods** — GET, POST, PUT, PATCH, DELETE
- **Request Builder** — Query params, headers, body (JSON/form-data/raw), auth (Bearer/Basic)
- **Response Viewer** — Status, timing, size, headers, syntax-highlighted JSON with collapsible tree
- **Request History** — Last 50 requests, searchable, one-click replay
- **Collections** — Save and organize requests by project, import/export as JSON
- **Environment Variables** — Define `{{baseUrl}}`, `{{apiKey}}` etc. with automatic substitution
- **Copy as cURL** — Export any request as a cURL command
- **Dark/Light Mode** — Developer-focused dark theme with purple accents, plus light mode
- **100% Client-Side** — All data stored in localStorage, requests made via browser fetch API

## Getting Started

```bash
# Clone
git clone https://github.com/yourusername/APITester.git
cd APITester

# Install
npm install

# Dev
npm run dev

# Build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** (state management)
- **Lucide React** (icons)

## Architecture

```
src/
├── app/             # Next.js app router
├── components/      # UI components
│   ├── AppShell     # Main layout with sidebar toggle
│   ├── UrlBar       # Method selector + URL input + send
│   ├── RequestTabs  # Params, Headers, Body, Auth tabs
│   ├── ResponsePanel# Response viewer with JSON tree
│   ├── Sidebar      # History, Collections, Environments
│   ├── JsonViewer   # Collapsible JSON tree renderer
│   └── ...
├── lib/             # HTTP client, cURL generator
├── store/           # Zustand store with persistence
└── types/           # TypeScript interfaces
```

## Environment Variables

Create environments and define variables like `baseUrl`, `apiKey`, etc. Use them in URLs, headers, and body with `{{variableName}}` syntax. Activate an environment and all requests will auto-substitute.

## Import/Export

Export your collections as JSON for backup or sharing. Import collections from JSON files — great for team collaboration.

## License

MIT — do whatever you want with it.
