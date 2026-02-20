# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.4] - 2026-02-20

### Added

- React 19 + TypeScript + Vite 6 frontend application
- Tailwind CSS 3 dark-themed UI with responsive design
- Four enhancement modes: Enhance, Expand, Clarify, Rewrite
- Multi-model targeting: Anthropic Claude 4.6 Sonnet/Haiku, Google Gemini 3.1 Pro/Flash
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
