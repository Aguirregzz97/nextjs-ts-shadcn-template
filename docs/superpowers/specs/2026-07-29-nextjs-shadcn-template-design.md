# Design: nextjs-ts-shadcn-template

## Purpose

A blank, reusable starter template for new projects, extracted from the stack
used in `quiniela-turbo` (Next.js + TypeScript + Tailwind + shadcn/ui) but
with none of that project's app-specific logic (no auth, no database, no
custom domain components). Pushed to the existing empty GitHub repo
`Aguirregzz97/nextjs-ts-shadcn-template`.

## Scaffolding approach

Use official generators to get current "latest and greatest" versions rather
than hand-writing config:

- `pnpm create next-app@latest` for the base Next.js project
- `pnpm dlx shadcn@latest init` for shadcn/ui setup

## Stack decisions

| Area | Decision |
|---|---|
| Package manager | pnpm |
| React version | 19 (whatever ships with latest Next.js) |
| Directory layout | `src/` directory, App Router, `@/*` import alias |
| shadcn style | CLI default preset (`shadcn init -d -y` → template `next`, preset `base-nova`). The old `--style`/`--base-color` flags were removed in shadcn CLI v4 (March 2026) in favor of an opaque preset system with no simple non-interactive "zinc" equivalent, so we take shadcn's own current default rather than hand-picking one. |
| Dark mode | `next-themes` + `ThemeProvider` in root layout + a `ModeToggle` component (Button + DropdownMenu + lucide `Sun`/`Moon`) |
| shadcn components | Base init only (Button + `cn()` util) — no extra components pre-installed |
| ESLint | Flat config (`eslint.config.mjs`) via current `eslint-config-next` (create-next-app default) |
| Prettier | `prettier` + `prettier-plugin-tailwindcss`, `.prettierrc.json` + `.prettierignore`, `format`/`format:check` scripts |
| Pre-commit hooks | Husky + lint-staged running `eslint --fix` and `prettier --write` on staged files |
| CI | `.github/workflows/ci.yml` — install, lint, build on push/PR to `main` |
| Testing | None — left out of a blank template, add per-project as needed |

## Page content

Minimal `page.tsx`: a small hero/welcome section demonstrating one shadcn
`Button` and the `ModeToggle`, just enough to prove the stack is wired up
correctly. No project-specific content.

## README

Stack overview, setup steps (`pnpm install`, `pnpm dev`), and a note on how
to add more shadcn components (`pnpm dlx shadcn@latest add <component>`).

## Out of scope

- Auth, database/ORM, email, file uploads, or any other quiniela-turbo
  app-specific logic
- Testing framework
- Extra shadcn components beyond the init default
- Deployment configuration beyond CI lint/build checks
