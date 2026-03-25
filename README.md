# AI Resource Exploration — Website
[![Netlify Status](https://api.netlify.com/api/v1/badges/84c02aee-55c9-4e2c-931d-61380228d160/deploy-status)](https://app.netlify.com/projects/ai-resource-exploration/deploys)

Marketing and informational website for AI Resource Exploration (AIRE), a mineral exploration consultancy. Built with Astro v6, Tailwind CSS v4, and MDX.

## Tech Stack

- **[Astro v6](https://astro.build)** — static site generator with file-based routing
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling via the Vite plugin
- **[@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/)** — MDX support for blog posts
- **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)** — interactive map on the contact page
- **[PhotoSwipe](https://photoswipe.com)** — lightbox for the gallery page
- **[Netlify Forms](https://docs.netlify.com/forms/setup/)** — contact form handling (no backend required)

Node.js >= 22.12.0 required.

## Commands

```sh
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview the production build locally
```

## Project Structure

```
src/
  pages/          # File-based routes (one file = one page)
    index.astro
    about.astro
    services.astro
    projects.astro
    technologies.astro
    publications.astro
    case-studies.astro
    cage-in.astro
    gallery.astro
    contact.astro
    blog/
      index.astro
      [...slug].astro
  content/
    blog/           # Blog posts as .mdx files
  components/       # Shared Astro components
  layouts/          # Page layouts (BaseLayout, PageLayout)
public/
  assets/           # Images, PDFs, downloadable documents
  robots.txt
```

## Adding Content

**Blog posts** — create a new `.mdx` file in `src/content/blog/`. The filename becomes the URL slug.

**Static assets** — drop files in `public/assets/`. They're served at `/assets/filename`.

## Deployment (Netlify)

The site deploys to Netlify. Build settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |

**Contact form** — Netlify Forms is already configured (`data-netlify="true"` on the form in `src/pages/contact.astro`). Netlify detects and registers the form automatically at deploy time. Submissions appear under **Site → Forms** in the Netlify dashboard.
