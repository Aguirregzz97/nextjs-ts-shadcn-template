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

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding shadcn/ui components

```bash
pnpm dlx shadcn@latest add <component>
```

See the [shadcn/ui component list](https://ui.shadcn.com/docs/components) for available components.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm lint` — run ESLint
- `pnpm format` / `pnpm format:check` — run/check Prettier formatting

`pnpm install` also runs the `prepare` script, which sets up the Husky pre-commit hook automatically — no extra steps needed.

## Using this template

After cloning, rename the project by replacing `nextjs-ts-shadcn-template` in these three places: the `name` field in `package.json`, the metadata `title` in `src/app/layout.tsx`, and the heading in `src/app/page.tsx`.
