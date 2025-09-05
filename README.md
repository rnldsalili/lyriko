# Initial set-up for web and api

```bash
bun create hono@latest
```

```bash
bun create cloudflare@latest -- my-react-router-app --framework=react-router
```

## AI Agents Configuration

To set up symbolic links for AI agent configuration files:

```bash
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md GEMINI.md
```

This creates symbolic links so that both Claude and Gemini agents reference the same configuration file. When making updates to coding standards and project rules, only edit the `AGENTS.md` file - changes will automatically apply to both agents.

---
