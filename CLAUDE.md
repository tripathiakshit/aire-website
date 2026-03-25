# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npm run astro ... # Run Astro CLI commands (e.g. astro add, astro check)
```

## Architecture

This is an [Astro](https://astro.build) v6 site (minimal template, TypeScript enabled).

- `src/pages/` — file-based routing; each `.astro` or `.md` file becomes a route
- `src/components/` — shared Astro/framework components (directory doesn't exist yet but this is the convention)
- `public/` — static assets served at the root path
- `astro.config.mjs` — Astro configuration (currently empty/default)

Astro pages use a frontmatter fence (`---`) for server-side logic and imports, followed by HTML-like template markup. Component scripts run at build time by default (no client-side JS unless explicitly opted in with `client:*` directives).
