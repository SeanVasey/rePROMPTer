# Task Plan

Active task plan with checkable items. Updated per session.

## Current Session (2026-03-04) — v2.4.0 Icon Update

- [x] Copy finalized icon (`rPr Icon update 2.svg`) to `public/favicon.svg` and `public/reprompter-icon.svg`
- [x] Delete legacy root-level SVG files (`rPr Icon.svg`, `rPr Icon update 2.svg`, `reprompter_icon_new.svg`)
- [x] Regenerate all PWA icon PNGs via `npm run generate-icons`
- [x] Bump service worker cache version to `reprompter-v2.4.0`
- [x] Bump version to v2.4.0 (`package.json`, `constants.ts`, test assertion)
- [x] Align `CustomLogoIcon` glow colors from `#E63946` to `#fa5d60` to match new icon
- [x] Update CHANGELOG.md with v2.4.0 release entry
- [x] Full verification: lint ✓ | typecheck ✓ | test (16/16) ✓ | build ✓
- [x] Commit, push to `claude/update-app-icon-xok5I`

## Review

All verification steps passed:
- **Lint**: Clean (0 warnings)
- **Typecheck**: Clean (no errors)
- **Tests**: 16/16 passed (3 test files)
- **Build**: Successful (`dist/` output generated, 6.36s)

---

## Previous Session (2026-02-26) — v2.3.1 Patch

- [x] Apply Issue #16 fix: replace inline `style={{ animationDuration: '3s' }}` with Tailwind `[animation-duration:3s]` in `App.tsx`
- [x] Apply Issue #17 fix: move `tailwindcss-animate` from `dependencies` to `devDependencies` in `package.json`
- [x] Bump version to v2.3.1 (`package.json`, `constants.ts`, test assertion)
- [x] Update CHANGELOG.md with v2.3.1 release entry (closes #16, #17)
- [x] Update tasks/todo.md and tasks/lessons.md
- [x] Full verification: lint ✓ | typecheck ✓ | test (16/16) ✓ | build ✓
- [x] Commit, push, and create pull request

---

## Previous Session (2026-02-26) — v2.3.0

- [x] Install `tailwindcss-animate` plugin
- [x] Add `drift` and `shine` keyframes to `tailwind.config.js`
- [x] Update `.glass-panel` CSS with enhanced blur, hover glow, transitions
- [x] Add Claude Haiku 4.5 to `constants.ts`
- [x] Add `claude-haiku` to backend `MODEL_MAP` in `api/enhance.js`
- [x] Fix hardcoded model IDs in `callAnthropic`/`callOpenAI`/`callGoogle` — now use `modelConfig.modelId`
- [x] Apply full visual overhaul to `App.tsx` (logo, background orbs, button animations, mode/select hover effects, entry animations)
- [x] Update tests for 4-model assertions
- [x] Update lessons.md with session patterns
- [x] Bump version to v2.3.0 (`package.json`, `constants.ts`, test assertion)
- [x] Update CHANGELOG.md with v2.3.0 release entry
- [x] Update README.md (4-model targeting, supported models table, API spec, tech stack, folder structure)
- [x] Update .env.example to mention Haiku
- [x] Full verification: lint ✓ | typecheck ✓ | test (16/16) ✓ | build ✓

---

## Previous Session (2026-02-24)

- [x] Update CLAUDE.md with workflow orchestration and task tracking sections
- [x] Verify all dependencies install cleanly
- [x] Review CI workflows and Vercel configuration
- [x] Run lint, typecheck, tests, and build — all passing
- [x] Create tasks/ directory with todo.md and lessons.md
- [x] Update CHANGELOG.md with documentation changes
