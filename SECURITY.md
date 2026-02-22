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

## Security Principles

The following principles should guide the rebuild of this application:

- **Zero-trust frontend**: API keys must never be sent to or stored in the browser. All AI API calls must route through server-side functions.
- **No secrets in source**: Environment variables for all credentials. `.env` gitignored; `.env.example` documents required variables without values.
- **Content Security Policy**: Block XSS, clickjacking, and data injection via strict CSP headers.
- **Input validation**: Enforce limits on prompt length, image size, and whitelist modes/models server-side.
- **Error sanitization**: Never leak internal SDK errors to clients.
- **Image validation**: Detect MIME type from actual content (magic bytes), not client-supplied headers.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x.x   | Yes (pending rebuild) |
| 1.x.x   | No (removed) |
