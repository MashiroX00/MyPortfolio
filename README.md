# Portfolio Frontend

Next.js 16 single-page portfolio site with a dark tech theme. Fetches all content from the [backend API](../backend) at runtime.

## Stack

- **Next.js 16.2.6** — App Router, TypeScript strict
- **Tailwind CSS v4** — `@import "tailwindcss"` syntax (not `@tailwind` directives)
- **Framer Motion** — scroll-triggered animations
- **Font Awesome Free** — icons
- **@dnd-kit** — drag-and-drop in Admin UI

## Setup

```bash
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                         # http://localhost:3000
```

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the backend API — `http://localhost:4000` in dev, Cloudflare Tunnel URL in production |

## Commands

```bash
npm run dev      # dev server with hot-reload
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
npx tsc --noEmit # type-check only
```

## Routes

| Route | Description |
|---|---|
| `/` | Public portfolio — single page, scroll-to-section |
| `/admin/login` | Owner login |
| `/admin` | Admin UI — edit all portfolio content |

## Admin UI

Visit `/admin` to manage content. Requires the backend to be running.

- Login with `OWNER_USERNAME` / `OWNER_PASSWORD` from the backend `.env`
- Supports add, edit, delete, and drag-to-reorder for all sections
- Changes reflect on the public portfolio immediately

## Offline behavior

When the backend is unreachable, the public portfolio shows a terminal-style error card: **"Backend API Closed — Please contact Owner directly for information."**

The Server Status section shows **OFFLINE** independently if only that endpoint fails.

## Deployment

Deploy to [Vercel](https://vercel.com). Set `NEXT_PUBLIC_API_URL` in the Vercel environment variables to your Cloudflare Tunnel URL.

> **Note:** This project uses Next.js 16.2.6 which contains breaking changes from earlier versions. See `AGENTS.md` for details before modifying Next.js-specific code.
