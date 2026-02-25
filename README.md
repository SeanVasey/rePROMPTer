# rePROMPTer

The advanced prompt optimization engine. Enhance, expand, clarify, and rewrite AI prompts — optimized for any target model.

---

## Features

- **Multi-mode optimization** — Four distinct modes (Enhance, Expand, Clarify, Rewrite) that each transform prompts differently
- **Three-model targeting** — Output adapts to: Anthropic Claude Sonnet 4.6, OpenAI ChatGPT-5.2, or Google Gemini 3.0 Pro
- **Image context** — Upload reference images (PNG, JPEG, GIF, WebP; 5 MB max) to provide visual context during optimization
- **Secure zero-trust architecture** — API keys never reach the browser; all AI calls route through Vercel serverless functions
- **Installable PWA** — Add to home screen on mobile (iOS/Android) or desktop for an app-like experience with offline shell caching
- **One-click copy** — Copy enhanced output to clipboard with toast notification
- **Responsive dark UI** — Glassmorphic dark-themed interface that works across desktop and mobile viewports
- **Accessible** — Keyboard-navigable with semantic HTML and screen-reader support

---

## Enhancement Modes

| Mode | Icon | What It Does |
|------|------|--------------|
| **Enhance** | Sparkles | Improves specificity, structure, and detail while preserving original intent |
| **Expand** | Maximize | Adds context, constraints, examples, and supporting detail |
| **Clarify** | Layers | Removes ambiguity, adds precision, restructures for maximum clarity |
| **Rewrite** | Edit3 | Complete reimagining from scratch using prompt engineering best practices |

All modes return **only** the optimized prompt text — no commentary, labels, or meta-text.

---

## Supported Models

| Display Name | Provider | Backend Model ID | Prompt Format |
|-------------|----------|------------------|---------------|
| Anthropic Claude Sonnet 4.6 | Anthropic | `claude-sonnet-4-6-20260217` | XML tags (`<context>`, `<task>`, `<example>`) |
| OpenAI ChatGPT-5.2 | OpenAI | `chatgpt-4o-latest` | Markdown + personas/roles |
| Google Gemini 3.0 Pro | Google | `gemini-2.5-pro` | Structured headings + direct instructions |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript 5.7, Tailwind CSS 3 |
| Build | Vite 6 |
| Icons | Lucide React |
| PWA | Web App Manifest, Service Worker |
| Backend | Vercel Serverless Functions (Node.js) |
| AI SDKs | Anthropic SDK, OpenAI SDK, Google Generative AI SDK |
| Testing | Vitest, React Testing Library |
| Linting | ESLint 9 with TypeScript + React plugins |
| CI | GitHub Actions (lint, typecheck, test, build) |

---

## Setup

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/SeanVasey/rePROMPTer.git
cd rePROMPTer
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

| Variable | Required For | Description |
|----------|-------------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic fallback | Used when AI Gateway is disabled or unavailable |
| `OPENAI_API_KEY` | OpenAI fallback / optional gateway auth | Direct OpenAI usage and optional token source for gateway calls |
| `GOOGLE_AI_API_KEY` | Google fallback | Used when AI Gateway is disabled or unavailable |
| `AI_GATEWAY_API_KEY` | AI Gateway | Recommended for local development; optional in Vercel production |
| `AI_GATEWAY_BASE_URL` | AI Gateway | Optional endpoint override (default: `https://ai-gateway.vercel.sh/v1`) |
| `AI_GATEWAY_ENABLED` | Routing control | Set to `false` to force direct provider SDK calls |

On Vercel, configure the gateway variable(s) and keep provider keys as a safe fallback path.

### Development

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + production build
npm run preview    # Preview production build
npm run lint       # ESLint
npm run typecheck  # TypeScript type checking
npm run test       # Run tests
```

---

## Architecture

```
┌─────────────────────┐
│   Enter your prompt  │   1. Type or paste a prompt
│   + optional image   │   2. Optionally upload a reference image
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Select target model │   3. Pick: Claude / ChatGPT / Gemini
│  Select mode         │   4. Choose an optimization mode
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Press Enhance      │   5. Submit for optimization
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   POST /api/enhance  │   Vercel serverless function
│   ├─ AI Gateway      │   Primary route (OpenAI-compatible)
│   ├─ Anthropic SDK   │   Automatic fallback if gateway fails
│   ├─ OpenAI SDK      │   or gateway disabled
│   └─ Google AI SDK   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Enhanced output     │   6. View result + copy to clipboard
└─────────────────────┘
```

---

## API Specification

### `POST /api/enhance`

Optimizes a prompt using the selected AI model and enhancement mode.

**Request body** (JSON):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | `string` | Yes | The prompt to optimize (1–50,000 characters) |
| `image` | `string` | No | Base64 data URI for visual context (max 5 MB) |
| `mode` | `string` | Yes | One of: `enhance`, `expand`, `clarify`, `rewrite` |
| `targetModel` | `string` | Yes | One of: `claude-sonnet`, `chatgpt-5`, `gemini-3` |

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

Deploy to Vercel:

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in project settings (`AI_GATEWAY_API_KEY`, optional `AI_GATEWAY_ENABLED`, plus provider fallbacks: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_AI_API_KEY`)
4. Deploy — Vercel auto-detects Vite and configures the build; the API route automatically attempts AI Gateway first

The `api/enhance.js` file is automatically deployed as a serverless function.

---

## Folder Structure

```
rePROMPTer/
├── api/
│   └── enhance.js          # Vercel serverless function (Anthropic + OpenAI + Google)
├── public/
│   ├── favicon.svg          # SVG app icon
│   ├── manifest.json        # PWA web app manifest
│   ├── sw.js                # Service worker (offline caching)
│   ├── apple-touch-icon.png # iOS home screen icon
│   └── icon-*.png           # PWA icon set (72–512px + maskable)
├── src/
│   ├── api.ts               # Frontend API client
│   ├── App.tsx              # Main React component
│   ├── constants.ts         # Models, modes, version
│   ├── index.css            # Global styles + Tailwind
│   ├── main.tsx             # React entry point
│   └── vite-env.d.ts       # Vite type definitions
├── test/
│   ├── App.test.tsx         # Component tests
│   ├── api.test.ts          # API client tests
│   └── setup.ts             # Vitest setup
├── scripts/
│   └── generate-icons.mjs   # Generate PWA icons from SVG
├── tasks/
│   ├── todo.md              # Active task plan (updated per session)
│   └── lessons.md           # Accumulated patterns from corrections
├── .env.example             # Environment variable template
├── .github/workflows/ci.yml # CI pipeline
├── index.html               # HTML entry point + PWA meta tags
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json              # Vercel deployment config + security headers
└── vite.config.ts
```

---

## Security

See [SECURITY.md](SECURITY.md) for the security policy and reporting instructions.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).
