# rePROMPTer

The precision prompt optimization studio. Enhance, expand, clarify, and rewrite AI prompts — optimized for any target model.

## Features

- **Multi-mode optimization** — Choose from Enhance, Expand, Clarify, or Rewrite modes to transform your prompts
- **Multi-model targeting** — Optimize prompts for Anthropic Claude or Google Gemini models with format-aware output
- **Image context** — Upload reference images to provide visual context for prompt enhancement
- **Secure architecture** — Zero-trust frontend with all API keys isolated on the server via Vercel serverless functions
- **Copy to clipboard** — One-click copy of enhanced output
- **Preview mode** — Works without a backend for local development and demos
- **Responsive design** — Dark-themed UI that works across desktop and mobile
- **Accessible** — Keyboard-navigable with ARIA attributes and semantic HTML

## Tech Stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Frontend  | React 19, TypeScript, Tailwind CSS 3       |
| Build     | Vite 6                                     |
| Icons     | Lucide React                               |
| Backend   | Vercel Serverless Functions (Node.js)      |
| AI SDKs   | Anthropic SDK, Google Generative AI SDK    |
| Testing   | Vitest, React Testing Library              |
| Linting   | ESLint with TypeScript + React plugins     |
| CI        | GitHub Actions                             |

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

> Without API keys the app runs in **preview mode**, returning simulated responses.

### Run (Development)

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build

```bash
npm run build
```

Output goes to `dist/`.

### Test

```bash
npm test
```

### Lint & Typecheck

```bash
npm run lint
npm run typecheck
```

## Project Structure

```
├── api/
│   └── enhance.js           # Vercel serverless function (prompt enhancement API)
├── public/
│   └── favicon.svg           # App favicon
├── src/
│   ├── api.ts                # Frontend API client
│   ├── App.tsx               # Root application component
│   ├── constants.ts          # Shared types and configuration
│   ├── components/
│   │   ├── CustomIcon.tsx    # SVG logo component
│   │   ├── ImageUpload.tsx   # Image upload with preview
│   │   ├── ModelSelector.tsx # Target model dropdown
│   │   ├── ModeSelector.tsx  # Enhancement mode radio group
│   │   ├── NavBar.tsx        # Bottom navigation bar
│   │   └── OutputSection.tsx # Enhanced output display + copy
│   ├── index.css             # Tailwind base styles
│   ├── main.tsx              # React entry point
│   └── test/
│       ├── App.test.tsx      # Component integration tests
│       ├── api.test.ts       # API client unit tests
│       └── setup.ts          # Test configuration
├── .github/workflows/
│   └── ci.yml                # GitHub Actions CI pipeline
├── vercel.json               # Vercel deployment config
└── package.json
```

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Connect the repository to Vercel
2. Set `ANTHROPIC_API_KEY` and/or `GOOGLE_AI_API_KEY` in Vercel environment variables
3. Deploy — Vercel auto-detects the Vite framework and serverless functions in `api/`

## License

Apache 2.0 — see [LICENSE](LICENSE).
