# Lessons Learned

Accumulated patterns from corrections and mistakes. Reviewed at session start.

## Session: 2026-02-24

- Initial session — no corrections yet. This file will grow as patterns are identified.

## Session: 2026-02-26

- **Never adopt client-side API calls from design prototypes.** The user's new frontend code included a `callGemini()` function with an inline API key — this was correctly rejected in favor of the existing server-side `enhancePrompt` architecture.
- **Verify data-testid attributes survive visual refactors.** Tests depend on `prompt-input`, `enhance-button`, and `model-select` — all must be preserved during UI overhauls.
- **When adding a new model to the frontend, update the backend MODEL_MAP simultaneously.** Adding `claude-haiku` required changes to both `constants.ts` and `api/enhance.js`.
- **Fix hardcoded model IDs in provider functions when adding models for the same provider.** `callAnthropic` had `'claude-sonnet-4-6-20260217'` hardcoded — adding Haiku would have silently routed to Sonnet without parameterizing `modelConfig.modelId`.

## Session: 2026-02-26 (v2.3.1 Patch)

- **Use Tailwind arbitrary values over inline styles.** Inline `style={{ animationDuration: '3s' }}` breaks consistency with the Tailwind utility-first approach. Use `[animation-duration:3s]` class instead — keeps all styling in `className` for easier scanning and maintenance.
- **Build-time-only Tailwind plugins belong in devDependencies.** `tailwindcss-animate` is consumed at build time by the Tailwind PostCSS pipeline and has no runtime role. Keeping it in `dependencies` inflates production `node_modules` unnecessarily.
- **Always review Copilot draft PRs before merging.** Copilot's auto-generated fixes were correct in both cases but should still be verified against the codebase, tested, and consolidated into a single versioned release rather than merged as-is.
