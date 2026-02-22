# rePROMPTer

The precision prompt optimization studio. Enhance, expand, clarify, and rewrite AI prompts — optimized for any target model.

> **Status**: This repository has been reset to documentation only. The application code will be rebuilt from scratch. See [CHANGELOG.md](CHANGELOG.md) for history.

---

## Product Vision

rePROMPTer is a web application that takes user-written AI prompts and optimizes them for specific target models. It provides four distinct transformation modes, supports image context, and formats output according to each model's conventions.

---

## Features

- **Multi-mode optimization** — Four distinct modes (Enhance, Expand, Clarify, Rewrite) that each transform prompts differently
- **Multi-model targeting** — Output format adapts to the selected target model (XML tags for Claude, Markdown directives for Gemini)
- **Image context** — Upload reference images (PNG, JPEG, GIF, WebP; 5 MB max) to provide visual context during optimization
- **Installable PWA** — Add to home screen on mobile or desktop for an app-like experience with offline shell caching
- **Secure zero-trust architecture** — API keys never reach the browser; all AI calls route through serverless functions
- **Preview mode** — Fully functional demo without a backend; returns simulated model-specific output
- **One-click copy** — Copy enhanced output to clipboard
- **Responsive dark UI** — Dark-themed interface that works across desktop and mobile viewports
- **Accessible** — Keyboard-navigable with ARIA attributes, role-based semantics, and screen-reader support

---

## Enhancement Modes

| Mode | Icon | What It Does |
|------|------|--------------|
| **Enhance** | Sparkles | Improves specificity, structure, and detail while preserving original intent |
| **Expand** | Maximize | Adds context, constraints, examples, and supporting detail |
| **Clarify** | Settings | Removes ambiguity, adds precision, restructures for maximum clarity |
| **Rewrite** | Rotate | Complete reimagining from scratch using prompt engineering best practices |

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

## Architecture

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
│ API  │ │  Preview   │   Backend: serverless function → AI SDK
│ call │ │  fallback  │   No backend: simulated model-aware response
└──┬───┘ └─────┬─────┘
   │           │
   └─────┬─────┘
         ▼
┌─────────────────────┐
│  Enhanced output     │   6. View result + copy to clipboard
└─────────────────────┘
```

---

## Previous Tech Stack (v1.4.1)

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

## API Specification

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

## Environment Variables

| Variable           | Required | Description                      |
| ------------------ | -------- | -------------------------------- |
| `ANTHROPIC_API_KEY`| For Claude models | Anthropic API key       |
| `GOOGLE_AI_API_KEY`| For Gemini models | Google AI API key       |

Without API keys the app runs in **preview mode**, returning simulated responses.

---

## Security

See [SECURITY.md](SECURITY.md) for the security policy and reporting instructions.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).
