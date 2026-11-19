# CLAUDE.md

Guidance for Claude Code (and other coding agents) working in this repository.

## What this is

A blank starter template: Next.js (App Router) + TypeScript + Tailwind CSS +
shadcn/ui, with dark mode, Prettier, ESLint, and pre-commit hooks already
wired up. There is no backend, database, or business logic — most real work
in this repo is either template maintenance (deps, tooling, docs) or someone
building a new project on top of it.

## Stack & versions

- **Next.js 16** (App Router, Turbopack, React Server Components by default)
- **React 19**
- **TypeScript 6**, pinned below 7 on purpose — see [Version constraints](#version-constraints)
- **Tailwind CSS 4** (CSS-first config, no `tailwind.config.ts`; theme tokens live in `src/app/globals.css`)
- **shadcn/ui**, style `base-nova`, built on **`@base-ui/react`** primitives (not Radix)
- **next-themes** for dark mode
- **pnpm** as the package manager (version pinned via `packageManager` in `package.json`)

## Commands

```bash
pnpm install       # also runs `prepare` → sets up the husky pre-commit hook
pnpm dev           # start the dev server (Turbopack)
pnpm build         # production build
pnpm start         # run the production build
pnpm lint          # eslint
pnpm format        # prettier --write .
pnpm format:check  # prettier --check .
npx tsc --noEmit   # type-check only (no dedicated package script)
```

Before considering a change done, run `pnpm lint`, `pnpm format:check`, `npx tsc --noEmit`, and `pnpm build` — this mirrors what CI (`.github/workflows/ci.yml`) checks on every push/PR to `main`.

## How shadcn/ui works here (read this before using any UI component)

shadcn/ui is **not** a component library you `import` from `node_modules`.
There is no package that ships a `<Dialog>` or `<Select>` at runtime. Instead,
the `shadcn` CLI reads the registry and **copies that component's source code
directly into this repo**, under `src/components/ui/`, wired to this
project's style (`base-nova`), base color, and `@base-ui/react` primitives as
configured in `components.json`. Once copied, that file is yours — it's
ordinary project source, not a dependency.

**The workflow, every time the app/website needs a UI piece shadcn offers:**

1. **Check first** whether it's already vendored: look in `src/components/ui/`
   (e.g. `button.tsx`, `dropdown-menu.tsx` already exist). If it's there, skip
   straight to step 3.
2. **If it isn't vendored yet, install it into the repo before using it:**
   ```bash
   pnpm dlx shadcn@latest add <component>   # e.g. dialog, select, input, card
   ```
   This writes `src/components/ui/<component>.tsx` (plus any dependent
   components/utilities it needs) and adds any new npm packages it requires.
   Always use `@latest` here so what lands in the repo matches the current
   registry/`@base-ui/react` API — don't hand-write a `src/components/ui/*`
   file from memory or by pasting an example off the docs site; versions
   drift and the props/`data-*` attributes won't match what's installed.
3. **Only then** import it from the local path and use it in app code:
   ```tsx
   import {
     Dialog,
     DialogContent,
     DialogTrigger,
   } from "@/components/ui/dialog";
   ```
   Never reach for a component that hasn't been installed — install, then use.
4. **Updating** an already-vendored component to a newer registry version:
   ```bash
   pnpm dlx shadcn@latest diff <component>              # see if it's out of date
   pnpm dlx shadcn@latest add <component> --overwrite   # pull in the update
   ```
   Re-run the app's lint/typecheck/build after an `--overwrite`, since a
   registry update can change props or `data-*` attributes (as happened
   going from Radix-based to `@base-ui/react`-based primitives historically).

## Conventions

- Path alias `@/*` → `src/*` (see `tsconfig.json`).
- `src/components/ui/` is generated shadcn code — treat it as vendored; prefer
  composing/wrapping over editing it directly so `diff`/`--overwrite` stay useful.
- `src/components/` (non-`ui`) holds hand-written app components (e.g. `mode-toggle.tsx`, `theme-provider.tsx`).
- `@base-ui/react` has a different API shape than Radix (e.g. `render` prop instead of `asChild`, `data-open`/`data-closed` instead of `data-state`). Don't port Radix-era shadcn examples verbatim — check the installed component's actual prop types.
- Styling is Tailwind utility classes + `cn()` (`src/lib/utils.ts`, `clsx` + `tailwind-merge`); no CSS modules.
- Formatting/linting are enforced by `lint-staged` on commit (`*.{js,jsx,ts,tsx}` → eslint --fix + prettier; `*.{json,md,css}` → prettier). Don't bypass with `--no-verify` unless the user asks.

## Version constraints

- **TypeScript is capped at `^6.0.3`, not `^7`.** TypeScript 7 is the native
  (Go-based) compiler rewrite; `typescript-eslint` (pulled in by
  `eslint-config-next`) currently declares a peer dependency of
  `typescript: '>=4.8.4 <6.1.0'`. Installing TS 7 breaks linting. Re-check
  `npm view typescript-eslint peerDependencies` before bumping past 6.x.
- **ESLint is capped at `^9`, not `^10`.** `eslint-config-next`'s own plugin
  dependencies (`eslint-plugin-import`, `eslint-plugin-jsx-a11y`,
  `eslint-plugin-react`) still peer-depend on ESLint `^9` as of this writing.
  `pnpm peers check` will show unmet peers if you force ESLint 10.
- `@types/node` tracks the Node major actually used in CI/dev (`^24`, matching
  `node-version: 24` in `.github/workflows/ci.yml`), not npm's absolute latest.
- When bumping any dependency, verify with `pnpm peers check` and the actual
  peer-dependency ranges on npm rather than just taking the newest version —
  this stack has repeatedly shipped a new major ahead of its own ecosystem's
  support for it.

## Repo layout

```
src/app/            # App Router routes, layout, globals.css (Tailwind + theme tokens)
src/components/ui/  # shadcn-generated primitives (vendored)
src/components/     # hand-written components (theme provider, mode toggle)
src/lib/utils.ts    # cn() helper
docs/superpowers/   # historical plan/spec docs from building this template — reference only, not living docs
.github/workflows/  # CI: install → lint → format:check → build
```

## Using this as a template (not maintaining it)

If you're asked to scaffold a new project from this template rather than
maintain the template itself, rename the project by replacing
`nextjs-ts-shadcn-template` in: `package.json` (`name`), the `metadata.title`
in `src/app/layout.tsx`, and the heading in `src/app/page.tsx` — then update
`README.md`'s title/description too.
