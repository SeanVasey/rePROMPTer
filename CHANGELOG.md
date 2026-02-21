# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.1] - 2026-02-21

### Fixed

- Updated expired Google Gemini preview model IDs (`gemini-2.5-pro-preview-05-06`, `gemini-2.5-flash-preview-05-20`) to stable GA versions (`gemini-2.5-pro`, `gemini-2.5-flash`), resolving "Enhancement service encountered an error" on Vercel deployment
- Updated Anthropic model IDs to current versions: Claude Sonnet 4.6 (`claude-sonnet-4-6-20260217`) and Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

### Changed

- Icon colors updated to match the app's red accent color scheme — pencil blade filled with accent red (`#E63946`), sparkles use accent stroke and translucent fill, pencil outline uses muted (`#9A9AAA`)
- Model display names corrected to match actual model versions (e.g., "Anthropic Claude Sonnet 4.6" instead of "Anthropic Claude 4.6 Sonnet")
- Regenerated all PWA icons from updated SVG

## [1.4.0] - 2026-02-21

### Added

- GitHub Pages deployment workflow (`pages.yml`) — builds with relative base for static hosting in preview mode
- Comprehensive README with enhancement modes, supported models, feature flags, API reference, architecture diagram, and deployment guides
- `vitest.config.ts` confirmed compatible with Vitest 4

### Changed

- Asset paths in `index.html` and `manifest.json` changed from absolute (`/`) to relative (`./`) for cross-deployment compatibility (Vercel + GitHub Pages)
- Service worker registration uses `import.meta.env.BASE_URL` for base-path-aware scope
- Service worker caches relative to its registration scope instead of hardcoded root paths
- Service worker cache version bumped to `repromter-v2`
- `ImageUpload` component refactored: replaced `useState` + `useEffect` with `useMemo` for derived preview URL (eliminates cascading renders)
- Upgraded Vitest from v2 to v4, ESLint plugins to latest compatible versions
- Fixed `ajv` audit vulnerability via `npm audit fix`

### Fixed

- GitHub Pages blank page: app now builds correctly for static hosting with relative asset references
- ESLint `react-hooks/set-state-in-effect` violation in `ImageUpload` component

## [1.3.0] - 2026-02-20

### Added

- PWA support: web app manifest, service worker with cache-first strategy, installable on mobile and desktop
- Full PWA icon set generated from source SVG (72–512px standard + 192/512 maskable + 180px Apple touch icon)
- `npm run generate-icons` script to regenerate icon PNGs from `public/favicon.svg`
- Apple PWA meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`)
- Image media-type auto-detection in API (PNG, JPEG, GIF, WebP) — no longer hardcoded to `image/png`
- Image payload size validation (5 MB limit) on the API endpoint

### Changed

- Security headers added to Vercel config: Content-Security-Policy, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, Permissions-Policy
- API error responses no longer leak internal SDK error messages; only known-safe messages are surfaced to clients
- SECURITY.md expanded with details on new CSP, header, and image validation policies

## [1.2.4] - 2026-02-20

### Added

- React 19 + TypeScript + Vite 6 frontend application
- Tailwind CSS 3 dark-themed UI with responsive design
- Four enhancement modes: Enhance, Expand, Clarify, Rewrite
- Multi-model targeting: Anthropic Claude Sonnet 4.6 / Haiku 4.5, Google Gemini 2.5 Pro / Flash
- Image upload with preview for visual context in prompt enhancement
- Vercel serverless API route (`api/enhance.js`) with Anthropic and Google AI SDK integration
- Secure zero-trust architecture — API keys never leave the server
- Preview mode fallback when no backend is connected
- Clipboard copy for enhanced output (modern Clipboard API with fallback)
- Accessible UI with ARIA attributes, keyboard navigation, and semantic HTML
- Component tests with Vitest and React Testing Library
- API client unit tests
- GitHub Actions CI pipeline (lint, typecheck, test, build)
- ESLint with TypeScript and React plugins
- Complete project documentation (README, CHANGELOG, SECURITY, CODE_OF_CONDUCT)
- Vercel deployment configuration
- `.env.example` with required environment variables
- `.editorconfig` and `.gitignore`
