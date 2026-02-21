# rePROMPTer

The precision prompt optimization studio. Enhance, expand, clarify, and rewrite AI prompts — optimized for any target model.

---

## Features

- **Multi-mode optimization** — Four distinct optimization modes (Enhance, Expand, Clarify, Rewrite) that each transform prompts differently
- **Multi-model targeting** — Output format adapts to the selected target model (XML tags for Claude, Markdown directives for Gemini)
- **Image context** — Upload reference images (PNG, JPEG, GIF, WebP; 5 MB max) to provide visual context during optimization
- **Installable PWA** — Add to home screen on mobile or desktop for an app-like experience with offline shell caching
- **Secure zero-trust architecture** — API keys never reach the browser; all AI calls route through Vercel serverless functions
- **Preview mode** — Fully functional demo without a backend; returns simulated model-specific output
- **One-click copy** — Copy enhanced output to clipboard (modern Clipboard API with legacy fallback)
- **Responsive dark UI** — Dark-themed interface that works across desktop and mobile viewports
- **Accessible** — Keyboard-navigable with ARIA attributes, role-based semantics, and screen-reader support

---

## How It Works

```
┌─────────────────────┐
│   Enter your prompt  │   1. Type or paste a prompt
│   + optional image   │   2. Optionally upload a reference image
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Select target model │   3. Pick which AI model the output targets
│  Select mode         │   4. Choose an optimization mode
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Press Re-Prompt    │   5. Submit for optimization
└────────┬────────────┘
         │
    ┌────┴─────┐
    │ Backend? │
    └────┬─────┘
    Yes  │  No
    ▼    ▼
┌──────┐ ┌───────────┐
│ API  │ │  Preview   │   Backend: Vercel serverless → AI SDK
│ call │ │  fallback  │   No backend: simulated model-aware response
└──┬───┘ └─────┬─────┘
   │           │
   └─────┬─────┘
         ▼
┌─────────────────────┐
│  Enhanced output     │   6. View result + copy to clipboard
└─────────────────────┘
```

**Backend flow**: The frontend POSTs to `/api/enhance`. The Vercel serverless function validates the request, selects the appropriate AI SDK (Anthropic or Google), calls the model with a mode-specific system prompt, and returns the enhanced text. API keys remain server-side.

**Preview mode flow**: When no backend responds (HTTP 404), the app generates a simulated preview response locally, formatted for the selected target model. No API keys or network connectivity required.

---

## Enhancement Modes

| Mode | Icon | What It Does |
|------|------|--------------|
| **Enhance** | Sparkles | Improves specificity, structure, and detail while preserving original intent. Adds clarity without changing scope. |
| **Expand** | Maximize | Adds context, constraints, examples, and supporting detail for richer, more comprehensive AI responses. |
| **Clarify** | Settings | Removes ambiguity, adds precision, and restructures for maximum clarity. Makes prompts unambiguous and well-organized. |
| **Rewrite** | Rotate | Complete reimagining from scratch using prompt engineering best practices. Same goal, significantly more effective approach. |

All modes return **only** the optimized prompt text — no commentary, labels, or meta-text.

---

## Supported Models

| Display Name | Provider | Model ID | Format |
|-------------|----------|----------|--------|
| Anthropic Claude Sonnet 4.6 | Anthropic | `claude-sonnet-4-6-20260217` | XML tags (`<instructions>`, `<context>`) |
| Anthropic Claude Haiku 4.5 | Anthropic | `claude-haiku-4-5-20251001` | XML tags |
| Google Gemini 2.5 Pro | Google | `gemini-2.5-pro` | Markdown + concise directives |
| Google Gemini 2.5 Flash | Google | `gemini-2.5-flash` | Markdown + concise directives |

The target model selection controls:
- Which AI SDK handles the request (Anthropic SDK or Google Generative AI SDK)
- How the optimized prompt is formatted (XML tags for Claude, Markdown for Gemini)
- Which model processes the optimization on the backend

---

## Feature Flags & Behavior

| Feature | Condition | Behavior |
|---------|-----------|----------|
| **Preview mode** | No backend (API returns 404) | App generates a simulated, model-aware preview response locally. No API keys needed. |
| **Image context** | User uploads an image | Image is base64-encoded and sent alongside the prompt. AI models receive it as visual context. Supports PNG, JPEG, GIF, WebP up to 5 MB. |
| **PWA install** | Modern browser with HTTPS | App can be installed to home screen. Service worker caches static shell for offline access. |
| **Clipboard copy** | Modern browser | Uses `navigator.clipboard.writeText()`. Falls back to `document.execCommand('copy')` in older environments. |
| **Backend API** | `ANTHROPIC_API_KEY` and/or `GOOGLE_AI_API_KEY` set | Enables live AI model calls. Without keys, relevant models return a configuration error. |

---

## Tech Stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Frontend  | React 19, TypeScript 5.7, Tailwind CSS 3   |
| Build     | Vite 6                                     |
| Icons     | Lucide React                               |
| PWA       | Web App Manifest, Service Worker           |
| Backend   | Vercel Serverless Functions (Node.js)      |
| AI SDKs   | Anthropic SDK, Google Generative AI SDK    |
| Testing   | Vitest, React Testing Library              |
| Linting   | ESLint 9 with TypeScript + React plugins   |
| CI        | GitHub Actions (lint, typecheck, test, build) |

---

## Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
git clone https://github.com/SeanVasey/rePROMPTer.git
cd rePROMPTer
npm install
```

### Environment Variables

Copy the example file and add your API keys:

```bash
cp .env.example .env
```

| Variable           | Required | Description                      |
| ------------------ | -------- | -------------------------------- |
| `ANTHROPIC_API_KEY`| For Claude models | Anthropic API key       |
| `GOOGLE_AI_API_KEY`| For Gemini models | Google AI API key       |

> Without API keys the app runs in **preview mode**, returning simulated responses that demonstrate the output format for each model.

### Run (Development)

```bash
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server proxies `/api` requests to `localhost:3001` (configure a local API server or use preview mode).

### Build

```bash
npm run build
```

Output goes to `dist/`.

### Test

```bash
npm test                # Run all tests once
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Lint & Typecheck

```bash
npm run lint
npm run typecheck
```

### Regenerate PWA Icons

If you change `public/favicon.svg`, regenerate the PNG icon set:

```bash
npm run generate-icons
```

This produces all required PWA sizes (72–512px), maskable variants, and the Apple touch icon from the source SVG.

---

## Project Structure

```
├── api/
│   └── enhance.js           # Vercel serverless function (prompt enhancement API)
├── public/
│   ├── favicon.svg           # Source SVG icon (pencil + sparkles)
│   ├── manifest.json         # PWA web app manifest
│   ├── sw.js                 # Service worker (cache-first static, network-only API)
│   ├── apple-touch-icon.png  # iOS home-screen icon (180x180)
│   └── icon-*.png            # PWA icons at standard sizes + maskable variants
├── scripts/
│   └── generate-icons.mjs    # Generates PNG icons from favicon.svg
├── src/
│   ├── api.ts                # Frontend API client + preview mode fallback
│   ├── App.tsx               # Root application component (state, layout, handlers)
│   ├── constants.ts          # Shared types, modes, models, version
│   ├── components/
│   │   ├── CustomIcon.tsx    # SVG logo component (pencil + sparkles)
│   │   ├── ImageUpload.tsx   # Image upload with preview + removal
│   │   ├── ModelSelector.tsx # Target model dropdown (listbox)
│   │   ├── ModeSelector.tsx  # Enhancement mode radio group
│   │   ├── NavBar.tsx        # Bottom navigation bar
│   │   └── OutputSection.tsx # Enhanced output display + copy button
│   ├── index.css             # Tailwind base styles + custom scrollbar
│   ├── main.tsx              # React entry point + service worker registration
│   └── test/
│       ├── App.test.tsx      # Component integration tests (16 tests)
│       ├── api.test.ts       # API client unit tests (9 tests)
│       └── setup.ts          # Vitest + jsdom configuration
├── .github/workflows/
│   ├── ci.yml                # CI pipeline (lint, typecheck, test, build)
│   └── pages.yml             # GitHub Pages deployment (builds with relative base)
├── vercel.json               # Vercel deployment config + security headers
└── package.json
```

---

## API Reference

### `POST /api/enhance`

Optimizes a prompt using the selected AI model and enhancement mode.

**Request body** (JSON):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | `string` | Yes | The prompt to optimize (1–10,000 characters) |
| `image` | `string \| null` | No | Base64-encoded image for visual context (max 5 MB) |
| `mode` | `string` | Yes | One of: `Enhance`, `Expand`, `Clarify`, `Rewrite` |
| `targetModel` | `string` | Yes | One of the supported model display names |

**Success response** (`200`):

```json
{ "enhancedPrompt": "The optimized prompt text..." }
```

**Error responses**:

| Status | Condition |
|--------|-----------|
| `400` | Validation failure (empty prompt, invalid mode/model, image too large) |
| `405` | Non-POST request |
| `500` | AI service error (safe message returned; internal details not leaked) |

---

## Deployment

### Vercel (recommended)

1. Connect the repository to [Vercel](https://vercel.com)
2. Set `ANTHROPIC_API_KEY` and/or `GOOGLE_AI_API_KEY` in Vercel environment variables
3. Deploy — Vercel auto-detects the Vite framework and serverless functions in `api/`

The `vercel.json` configures security headers (CSP, X-Frame-Options, etc.) and SPA rewrites.

### GitHub Pages (preview mode only)

GitHub Pages serves the static build without serverless functions. The app runs in **preview mode** (simulated responses).

1. In repo Settings > Pages, set source to **GitHub Actions**
2. The `pages.yml` workflow builds and deploys automatically on push to `main`/`master`
3. Visit `https://<username>.github.io/rePROMPTer/`

---

## Security

See [SECURITY.md](SECURITY.md) for the full security policy.

**Highlights**:
- **Zero-trust frontend** — API keys never reach the browser
- **Content Security Policy** — Blocks XSS, clickjacking, and data injection
- **Input validation** — Prompt length, image size, mode/model whitelists enforced server-side
- **Error sanitization** — Internal SDK errors never leak to clients
- **Security headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
- **Image validation** — MIME type detected from actual content (magic bytes), not client headers

---

## License

Apache 2.0 — see [LICENSE](LICENSE).
