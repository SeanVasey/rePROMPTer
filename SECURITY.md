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

- **Zero-trust frontend**: API keys are never sent to or stored in the browser. All AI API calls are routed through Vercel serverless functions on the server side.
- **Input validation**: The API route validates prompt length, mode, and model selection before processing.
- **No secrets in source**: Environment variables are used for all credentials. The `.env` file is gitignored; `.env.example` documents required variables without values.
- **Content Security**: User-uploaded images are processed in-memory and not persisted to disk or external storage.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x.x   | Yes       |
