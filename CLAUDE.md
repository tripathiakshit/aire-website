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

This is an [Astro](https://astro.build) v6 static site with TypeScript, Tailwind CSS v4, and MDX.

### Directory layout

```
src/
  pages/          # File-based routing — each file is a route
  layouts/        # BaseLayout.astro and PageLayout.astro
  components/     # Shared Astro components
  content/blog/   # Blog posts as .mdx files (Astro Content Collections)
  data/           # Static JSON data (e.g. locations.json for the map)
  styles/
    global.css    # Tailwind imports + custom theme tokens + base styles
public/
  assets/         # Images, PDFs, downloadable documents
```

### Layouts

Two layouts form a hierarchy:

- **`BaseLayout.astro`** — bare `<html>` shell; handles `<head>`, meta tags, Open Graph, favicons, and Google Fonts (Inter + Playfair Display). Accepts `title` and `description` props.
- **`PageLayout.astro`** — wraps `BaseLayout` and adds `<Header>`, `<main>`, and `<Footer>`. Used by virtually every page.

### Tailwind theme tokens

Defined in `src/styles/global.css` via `@theme`. Use these custom color/font classes throughout the codebase:

| Token | Value | Usage |
|---|---|---|
| `geo-primary` | `#0c498e` | Primary brand blue |
| `geo-primary-dark` | `#071f3d` | Darker blue for hover/emphasis |
| `geo-secondary` | `#a5c1da` | Light blue accents |
| `geo-gold` | `#c9a84c` | CTA buttons, accents |
| `geo-slate` | `#1a2b3c` | Dark hero backgrounds |
| `font-display` | Playfair Display | Headings (`font-display` class) |
| `font-sans` | Inter | Body text (default) |

### Blog (Content Collections)

Blog posts live in `src/content/blog/` as `.mdx` files. There is no `content/config.ts` — the collection is inferred. Frontmatter schema in use:

```yaml
title: string
description: string
pubDate: date
tags: string[]
draft: boolean
image: string  # optional, path to hero image
```

The dynamic route `src/pages/blog/[...slug].astro` generates one page per post using `getCollection('blog')`. Blog prose is rendered with `@tailwindcss/typography` (`prose` classes).

### Components with client-side JS

Most components are static. Two have `<script>` blocks that run in the browser:

- **`Header.astro`** — mobile hamburger toggle + scroll shadow on the sticky header.
- **`MapView.astro`** — initialises a Mapbox GL JS map. Reads project locations from `src/data/locations.json` and the token from `PUBLIC_MAPBOX_TOKEN`. If the token is missing the map shows a fallback message.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `PUBLIC_MAPBOX_TOKEN` | No | Mapbox GL JS token for the interactive map on the contact page |

Create a `.env` file at the repo root to set these locally.

### Contact form (Netlify Forms)

The form in `src/pages/contact.astro` uses `data-netlify="true"`. Netlify detects and registers it at deploy time — no backend code needed. Submissions appear in the Netlify dashboard under **Site → Forms**.

### Navigation

Nav links are defined as a plain array in `src/components/Header.astro`. To add or remove pages from the nav, edit that array. The active link is highlighted by comparing `Astro.url.pathname` against each `href`.
