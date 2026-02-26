# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2026-02-26

### Added

- **Claude Haiku 4.5 model** — Fourth target model added to frontend and backend (`claude-haiku-4-5-20251001`), with full AI Gateway + fallback support
- **Frontend design overhaul** — Redesigned glassmorphism UI with enhanced visual effects:
  - Darker background palette (`#050505`)
  - Redesigned logo icon with crimson glow effect (no container square)
  - Enhanced glass-panel CSS (deeper blur, hover glow with crimson accent, smooth cubic-bezier transitions)
  - Three animated background orbs with `drift` parallax animation
  - Enhance button with continuous `shine` gradient sweep animation
  - Mode button hover effects with scoped group scaling
  - Select dropdown focus/hover styling with crimson accent
  - Output section slide-in entry animation
  - Error section fade-in zoom animation
  - Image overlay zoom-in entry animation
  - Textarea focus placeholder transition
- **`tailwindcss-animate`** dependency for entry animation utilities (`animate-in`, `fade-in`, `slide-in-from-bottom-*`, `zoom-in-*`)
- Custom Tailwind keyframes: `drift` (parallax orbs) and `shine` (button gradient sweep)

### Fixed

- **Hardcoded model IDs in provider functions** — `callAnthropic`, `callOpenAI`, and `callGoogle` now use `modelConfig.modelId` instead of hardcoded strings, enabling correct multi-model-per-provider routing
- Updated `api/enhance.js` to use Vercel AI Gateway as the primary routing path for all target models, with automatic fallback to provider-native SDK calls when gateway calls fail and provider keys are configured
- Added explicit server configuration handling so enhancement requests now fail fast with actionable errors when neither AI Gateway nor provider credentials are available

### Changed

- Version bumped from v2.2.0 to v2.3.0
- Model count increased from 3 to 4 (re-added Claude Haiku as a lightweight option)
- Test suite updated for 4-model assertions (16/16 tests passing)

---

## [2.2.1] - 2026-02-24

### Changed

- CLAUDE.md updated with workflow orchestration section (plan mode, subagent strategy, self-improvement loop, task management, autonomous bug fixing)
- Guiding principles refined: replaced "boring is beautiful" with "demand elegance, but stay practical" and added staff engineer approval check
- Added task tracking directory specification (tasks/todo.md, tasks/lessons.md) to repository completeness standards
- Updated "What Good Looks Like" section with lessons.md reference

### Added

- `tasks/` directory with `todo.md` (active task plan) and `lessons.md` (accumulated patterns)

---

## [2.2.0] - 2026-02-22

### Added

- React 19 + TypeScript + Vite 6 frontend rebuilt from scratch
- Three-model targeting: Anthropic Claude Sonnet 4.6, OpenAI ChatGPT-5.2, Google Gemini 3.0 Pro
- Vercel serverless API route (`api/enhance.js`) with Anthropic, OpenAI, and Google AI SDK integration
- OpenAI SDK dependency for ChatGPT-5.2 support
- Server-side input validation (prompt length, image size, mode/model whitelisting)
- Server-side MIME type detection from magic bytes
- Glassmorphic dark UI with responsive design
- Image upload with preview for visual context
- Clipboard copy with async API and fallback
- Component and API client tests (Vitest + React Testing Library)
- GitHub Actions CI pipeline (lint, typecheck, test, build)
- Security headers in Vercel config (CSP, X-Frame-Options, etc.)
- PWA support: web app manifest, service worker, full icon set (72–512px + maskable)
- iOS home screen installation support (apple-touch-icon, meta tags)
- Icon generation script (`scripts/generate-icons.mjs`) using sharp

### Changed

- Model lineup reduced from 4 to 3 (removed Claude Haiku and Gemini Flash; added OpenAI ChatGPT-5.2)
- API contract now uses lowercase mode IDs and short model IDs (`claude-sonnet`, `chatgpt-5`, `gemini-3`)
- Environment variables now include `OPENAI_API_KEY`

---

## [2.0.0] - 2026-02-22

### Removed

- All application source code (React frontend, Vercel serverless backend, tests, components)
- Build tooling (Vite, TypeScript configs, Tailwind, PostCSS, ESLint)
- CI/CD workflows (GitHub Actions)
- PWA assets (icons, manifest, service worker)
- npm dependencies (package.json, package-lock.json)
- Deployment configs (vercel.json, index.html)

### Changed

- README.md rewritten as a product specification for rebuilding the application from scratch
- SECURITY.md simplified to policy-only (implementation details removed pending rebuild)
- CHANGELOG.md updated with full version history preserved below

### Retained

- CLAUDE.md (engineering standards and guidelines)
- README.md (product spec: features, modes, models, API contract, architecture)
- CHANGELOG.md (version history)
- SECURITY.md (vulnerability reporting policy)
- LICENSE (Apache 2.0)
- CODE_OF_CONDUCT.md
- .editorconfig
- .env.example
- .gitignore

---

## Previous Releases (v1.x — removed)

### [1.4.1] - 2026-02-21

#### Fixed

- Updated expired Google Gemini preview model IDs (`gemini-2.5-pro-preview-05-06`, `gemini-2.5-flash-preview-05-20`) to stable GA versions (`gemini-2.5-pro`, `gemini-2.5-flash`)
- Updated Anthropic model IDs to current versions: Claude Sonnet 4.6 (`claude-sonnet-4-6-20260217`) and Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

#### Changed

- Icon colors updated to match the app's red accent color scheme
- Model display names corrected to match actual model versions
- Regenerated all PWA icons from updated SVG

### [1.4.0] - 2026-02-21

#### Added

- GitHub Pages deployment workflow
- Comprehensive README with enhancement modes, supported models, feature flags, API reference, architecture diagram, and deployment guides

#### Changed

- Asset paths changed from absolute to relative for cross-deployment compatibility
- Service worker registration uses `import.meta.env.BASE_URL` for base-path-aware scope
- Upgraded Vitest from v2 to v4, ESLint plugins to latest compatible versions

#### Fixed

- GitHub Pages blank page resolved with relative asset references

### [1.3.0] - 2026-02-20

#### Added

- PWA support: web app manifest, service worker, installable on mobile and desktop
- Full PWA icon set generated from source SVG
- Image media-type auto-detection in API (PNG, JPEG, GIF, WebP)
- Image payload size validation (5 MB limit)

#### Changed

- Security headers added to Vercel config (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- API error responses no longer leak internal SDK error messages

### [1.2.4] - 2026-02-20

#### Added

- React 19 + TypeScript + Vite 6 frontend application
- Tailwind CSS 3 dark-themed UI with responsive design
- Four enhancement modes: Enhance, Expand, Clarify, Rewrite
- Multi-model targeting: Claude Sonnet 4.6 / Haiku 4.5, Gemini 2.5 Pro / Flash
- Image upload with preview for visual context
- Vercel serverless API route with Anthropic and Google AI SDK integration
- Secure zero-trust architecture
- Preview mode fallback
- Clipboard copy with fallback
- Accessible UI with ARIA attributes and keyboard navigation
- Component and API client tests (Vitest + React Testing Library)
- GitHub Actions CI pipeline
- Complete project documentation
