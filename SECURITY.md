# Security and privacy

- Never commit API keys, cookies, tokens, private prompts, chat logs, runtime JSON or databases.
- Keep model credentials on a server-side adapter.
- Treat safeword/stop as a local immediate action; do not wait for a model response.
- Do not log raw intimate content by default.
- Before publishing a release, scan the full Git history as well as the working tree.

Please report security issues privately to the repository owner rather than opening a public issue.
