# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working in this repo — ground rules (read before making any change)

This is a **live marketing website** maintained by a non-technical owner who relies on you to
keep the site and its build healthy. The rules below are not optional polish — they are how you
avoid taking the published site down or destroying its history. Follow them on every task.

### `main` is protected — always work on a branch

- **Never commit or push directly to `main`.** The `main` branch auto-deploys to production via
  Netlify (see the deploy badge in `README.md`). **Merging to `main` = publishing the change live.**
- For **every** change the owner asks for, start fresh from up-to-date `main` and create a new branch:
  ```sh
  git checkout main && git pull
  git checkout -b descriptive-branch-name   # e.g. update-team-bios, fix-contact-typo
  ```
- Make all edits and commits on that branch. Use clear, plain-language commit messages.
- When the work is ready: run the build (see below), then **push the branch and open a pull request**
  (`gh pr create`). Netlify builds a **Deploy Preview** for the PR — share that preview link so the
  owner can see the change on a real URL before it goes live.
- **Do not merge to `main` yourself.** Only merge after the owner has reviewed the preview and
  explicitly confirms they want it published.
- **Never** run destructive or history-rewriting git commands (`git reset --hard`, `git push --force`,
  `git rebase` on shared branches, `git clean -fdx`, deleting branches) unless the owner explicitly
  asks and understands the consequence. When in doubt, stop and explain instead of acting.

### Never wipe or re-scaffold the project

- **Do not** run `npm create astro`, delete `src/`, or replace the existing structure with a fresh
  template "to start clean." Always make changes *inside* the existing project.
- **Do not delete or rewrite the load-bearing config files** unless that is specifically the task:
  `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`,
  `src/content.config.ts`, `src/styles/global.css`, `.gitignore`, `.env.example`. These keep the
  build reproducible and the deploy working.
- Reuse what already exists — layouts (`PageLayout`, `BaseLayout`), components in `src/components/`,
  and the `geo-*` theme tokens — instead of introducing parallel systems that do the same thing.

### One canonical file per thing — no version names in filenames

- **Git already tracks versions** via branches and commit history, so files must never carry a
  version, date, or variant in their name. **Wrong:** `V5Layout.astro`, `Layout-new.astro`,
  `Header2.astro`, `index-final.astro`, `about-copy.astro`.
- To change something, **edit the existing file in place** (or create the single, correctly-named
  file). If the old version needs to be recoverable, that is what the branch and commit history are
  for — not a duplicate file left in the tree.

### Porting in external code — make it Astro-native

When bringing in markup, a template, a Figma/HTML export, or a snippet from another site, **translate
it into this project's stack** rather than dropping it in as-is:

- **Components & pages:** convert markup into `.astro` files. Reusable pieces go in
  `src/components/`; full pages go in `src/pages/` (the filename becomes the route). Wrap pages in
  `PageLayout` so they inherit the shared header, footer, and `<head>`/meta — never ship a standalone
  `<html>` document.
- **Styling:** restyle with **Tailwind utility classes** and the existing theme tokens
  (`geo-primary`, `geo-gold`, `font-display`, etc.). Do **not** add another CSS framework (Bootstrap,
  etc.) or paste large bespoke stylesheets. If a genuinely new design token is needed, add it to
  `@theme` in `src/styles/global.css`.
- **Assets:** put images, PDFs, and downloads in `public/assets/` and reference them by path
  (`/assets/filename`), or use Astro's `astro:assets` pipeline for optimized images. Do not hot-link
  external URLs or paste base64 blobs into the markup.
- **Dependencies:** prefer libraries already in `package.json`. Avoid adding heavy dependencies or
  raw `<script>` tags when a Tailwind/Astro-native approach works. If a new dependency is truly
  needed, install it with `npm install` (which updates `package-lock.json`) — never hand-edit
  `package.json` versions.
- **Match the conventions** of the files already in the same folder (naming, structure, formatting).

### Always verify the build before finishing

- Run `npm run build` before considering any change done. **A broken build breaks the Netlify deploy**,
  so the build must pass on the branch. Optionally run `npm run dev` to eyeball the change locally.
- Do **not** change Netlify deploy settings, the contact form's `data-netlify="true"` attribute
  (see `src/pages/contact.astro`), or the deploy badge in `README.md` — these wire the site to its
  hosting and form handling.
- Never commit secrets or a real `.env` file (only `.env.example` is tracked).

### Working with a non-technical owner

- Explain what you did in plain language: which branch you created, how to preview it, and that it
  only goes live once it's merged to `main`.
- Keep changes small and focused, with one logical change per branch/PR where practical.
- If a request is ambiguous or a step could risk the live site, **ask first** rather than guessing.

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

Blog posts live in `src/content/blog/` as `.mdx` files. The collection and its frontmatter schema
are defined in `src/content.config.ts` using a Zod schema — update that file if you need to add or
change a frontmatter field. Schema in use:

```yaml
title: string          # required
description: string    # required
pubDate: date          # required
updatedDate: date      # optional
tags: string[]         # optional
image: string          # optional, path to hero image
draft: boolean         # optional, defaults to false
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
