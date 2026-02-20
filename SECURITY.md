# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in rePROMPTer, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@vasey.ai** (or open a private security advisory on GitHub).

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You should receive an acknowledgment within 48 hours. We will work with you to understand and address the issue before any public disclosure.

## Security Design

### Architecture

- **Zero-trust frontend**: API keys are never sent to or stored in the browser. All AI API calls are routed through Vercel serverless functions on the server side.
- **No secrets in source**: Environment variables are used for all credentials. The `.env` file is gitignored; `.env.example` documents required variables without values.

### HTTP Security Headers

All responses include the following headers (configured in `vercel.json`):

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` | Prevents XSS, clickjacking, and data injection |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Blocks embedding in frames |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |

### API Endpoint Validation

The `/api/enhance` route enforces:

- **HTTP method**: Only `POST` is accepted (405 for others)
- **Prompt length**: Maximum 10,000 characters
- **Image payload**: Maximum 5 MB base64; media type auto-detected from magic bytes
- **Mode whitelist**: Must be one of `Enhance`, `Expand`, `Clarify`, `Rewrite`
- **Model whitelist**: Must match a known model identifier
- **Error sanitization**: Internal SDK errors are not forwarded to clients; only known-safe messages are surfaced

### Content Security

- User-uploaded images are processed in-memory and not persisted to disk or external storage.
- Image media types are detected from actual content (magic bytes), not client-supplied headers.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x.x   | Yes       |
