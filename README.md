# nextjs-ts-shadcn-template

A blank starter template: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, with dark mode, Prettier, ESLint, and pre-commit hooks already wired up.

## Stack

- [Next.js](https://nextjs.org) (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- [Prettier](https://prettier.io) with `prettier-plugin-tailwindcss`
- [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) for pre-commit checks

## Requirements

- [Node.js](https://nodejs.org) 20.9+ (CI runs on 24)
- [pnpm](https://pnpm.io) (version pinned via `packageManager` in `package.json`; run `corepack enable` to pick it up automatically)

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding shadcn/ui components

shadcn/ui isn't a runtime component library — the CLI copies each
component's source directly into `src/components/ui/` so it lives in your
repo. When the app needs a UI piece that isn't in `src/components/ui/` yet,
install it there first, then import it:

```bash
pnpm dlx shadcn@latest add <component>   # vendors src/components/ui/<component>.tsx
```

```tsx
import { Button } from "@/components/ui/button";
```

See the [shadcn/ui component list](https://ui.shadcn.com/docs/components) for available components. See [`CLAUDE.md`](./CLAUDE.md) for the full workflow, including how to update an already-installed component.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm lint` — run ESLint
- `pnpm format` / `pnpm format:check` — run/check Prettier formatting

`pnpm install` also runs the `prepare` script, which sets up the Husky pre-commit hook automatically — no extra steps needed.

## Using this template

After cloning, rename the project by replacing `nextjs-ts-shadcn-template` in these three places: the `name` field in `package.json`, the metadata `title` in `src/app/layout.tsx`, and the heading in `src/app/page.tsx`.

## Working with Claude Code / AI agents

See [`CLAUDE.md`](./CLAUDE.md) for stack details, commands, conventions, and version constraints worth knowing before upgrading dependencies in this repo, and [`.claude/skills/shipping-changes`](./.claude/skills/shipping-changes/SKILL.md) for the required development workflow.
