# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Non-standard Next.js version

This project uses **Next.js 16.2.6** — a version with breaking changes where APIs, conventions, and file structure may differ significantly from training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/` (if present) and heed any deprecation notices. Do not assume behavior from older Next.js versions.

## Commands

All commands run from the `webbapp/` directory:

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

TypeScript type-checking (no dedicated script):
```bash
npx tsc --noEmit
```

## Stack

- **Next.js 16.2.6** with App Router (`app/` directory)
- **React 19.2.4**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** — `@import "tailwindcss"` in globals.css (not `@tailwind` directives)
- **shadcn/ui** (canary — Tailwind v4 compatible)
- **Magic UI** — animation components (TypingAnimation, Particles, etc.)
- **Framer Motion** — animation primitives
- **Font Awesome Free** — icons
- **Geist** font family (sans + mono) via `next/font/google`

## Path alias

`@/*` resolves to the project root.

## Design system

- **Background**: `#000000`
- **Accent Color**: Cyber Yellow `#FFE600` (active states, borders, glows, emphasis)
- **Cards**: Glassmorphism — `backdrop-blur` + `bg-white/5` + `border border-yellow-400/10`
- **Tech effects**: Dot/grid background pattern, yellow `box-shadow`/`text-shadow` glow, monospace font for tech labels, typing animation in hero
- **Never** use warm whites or light backgrounds — dark only

## Architecture

Single-page portfolio. All content fetched from the Content API (separate Express backend) at runtime.

### Route structure

- `app/page.tsx` — public portfolio; single page, all Sections rendered, scroll-to-section navigation
- `app/admin/` — protected Admin UI; requires valid Session Token
- `app/layout.tsx` — root layout; Geist fonts, full-height flex column

### Layout

- **Desktop**: Fixed left Sidebar (`w-48`, icon + label per Section) + main content area
- **Mobile**: Top-left hamburger → slide-in menu; Sidebar hidden

Active Section is tracked via Intersection Observer; its Sidebar Link highlights in Accent Color.

### Content API

Base URL from `NEXT_PUBLIC_API_URL` env var. All fetch calls include `Authorization: Bearer <token>` when authenticated. On fetch failure: display error message — do **not** cache or silently swallow errors.

### Sections (display order)

About · Projects · Experience · Skills · Education · Certificate · Contact · Server

Each list-based Section renders Portfolio Items sorted by `position` ascending.
Skills are grouped by `category` dynamically (no hardcoded categories).
Contact renders Contact Links as a flexible list of platform → URL pairs.

**Server** is a singleton Section (no Portfolio Items, not editable via Admin UI). It displays live backend metrics — `active`, `uptime_seconds`, `os_name`, `cpu_usage`, `ram_used_gb`, `ram_total_gb`, `disk_used_gb`, `disk_total_gb` — fetched from `GET /api/server-status`. Mock data lives in `lib/mock-data.ts` as `mockServerStatus`. Progress bar color: yellow → amber → red as load crosses 65% → 85%.

### Data files

- `lib/types.ts` — TypeScript interfaces for all sections including `ServerStatus`
- `lib/mock-data.ts` — exports `mockData: PortfolioData` and `mockServerStatus: ServerStatus`
