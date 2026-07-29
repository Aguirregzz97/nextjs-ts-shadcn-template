# nextjs-ts-shadcn-template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a blank, reusable Next.js + TypeScript + Tailwind + shadcn/ui starter template in `/home/aguirre/Documents/github/nextjs-ts-shadcn-template` and push it to the existing empty GitHub repo `Aguirregzz97/nextjs-ts-shadcn-template`.

**Architecture:** Use the official generators (`create-next-app`, `shadcn` CLI) to produce current "latest and greatest" scaffolding rather than hand-writing config, then layer on dark mode, formatting, pre-commit hooks, and CI by hand. Every command and file below was executed and verified in a throwaway sandbox before being written into this plan — flag any deviation you observe when executing, since it means the tool's behavior has changed since this plan was written.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui (CLI v4, Base UI component library), next-themes, Prettier + prettier-plugin-tailwindcss, Husky + lint-staged, pnpm, GitHub Actions.

## Global Constraints

- Package manager: pnpm (confirmed available on this machine).
- Directory layout: `src/` directory, App Router, `@/*` import alias.
- No auth, database, email, file upload, or any other quiniela-turbo app-specific logic — this is a blank template.
- No testing framework — left out per the approved spec.
- No extra shadcn components beyond the base init + `dropdown-menu` (needed for the mode toggle).
- The target directory `/home/aguirre/Documents/github/nextjs-ts-shadcn-template` already exists, is already a git repo, and already has one commit (the design spec under `docs/superpowers/specs/`). Do not re-run `git init` and do not pass a `--disable-git`-less command that assumes an empty directory.
- Repo to push to: `git@github.com:Aguirregzz97/nextjs-ts-shadcn-template.git` (empty, public, already created on GitHub).
- Spec reference: `docs/superpowers/specs/2026-07-29-nextjs-shadcn-template-design.md`.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: entire `create-next-app` output (`package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `.gitignore`, `pnpm-workspace.yaml`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `public/*`, `README.md`)

**Interfaces:**
- Produces: a working Next.js app at the repo root with `pnpm dev`, `pnpm build`, `pnpm lint` scripts; `src/app/layout.tsx` exporting `RootLayout`; `src/app/page.tsx` exporting `Home`.

- [ ] **Step 1: Run create-next-app in the existing directory**

Run from `/home/aguirre/Documents/github`:

```bash
cd /home/aguirre/Documents/github/nextjs-ts-shadcn-template
pnpm dlx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --disable-git --yes
```

`--disable-git` is required — the directory already has a `.git` with one commit, and create-next-app must not try to re-init or touch git.

- [ ] **Step 2: Handle the pnpm build-script approval prompt**

The install step this triggers will likely abort with an error like:

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: sharp, unrs-resolver
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
Aborting installation.
```

This is expected — pnpm now blocks postinstall scripts from unlisted packages by default. Resolve it non-interactively and finish the install:

```bash
pnpm approve-builds --all
pnpm install
```

Confirm `pnpm-workspace.yaml` now contains an `allowBuilds`/`ignoredBuiltDependencies` block — that's what makes future `pnpm install` runs (including in CI) non-interactive.

- [ ] **Step 3: Verify the scaffold builds and lints cleanly**

```bash
pnpm lint
pnpm build
```

Expected: `pnpm lint` prints only `$ eslint` with no errors/warnings. `pnpm build` ends with a `Route (app)` table listing `/` and `/_not-found` as static.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js app with create-next-app"
```

---

### Task 2: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/dropdown-menu.tsx`
- Modify: `src/app/globals.css` (shadcn appends its CSS variables/theme layer)
- Modify: `package.json` (adds `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@base-ui/react`, `tw-animate-css`, `shadcn`)

**Interfaces:**
- Consumes: the Next.js/Tailwind project from Task 1.
- Produces: `cn()` util at `@/lib/utils`; `Button` component at `@/components/ui/button` with `variant`/`size` props; `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` at `@/components/ui/dropdown-menu` — Task 3 consumes all of these.

- [ ] **Step 1: Run shadcn init non-interactively**

```bash
pnpm dlx shadcn@latest init -d -y
```

Note: shadcn's CLI v4 (March 2026) replaced the old `--style`/`--base-color` flags with an opaque preset system. `-d`/`--defaults` uses the CLI's own current default (`template=next`, `preset=base-nova` at time of writing — the exact preset name may have changed by the time you run this; that's fine, this is intentional per the spec). Do not try to force a specific style/color — just take the default.

- [ ] **Step 2: Verify the init output**

```bash
cat components.json
ls src/components/ui/ src/lib/
```

Expected: `components.json` exists with a `style`, `tailwind`, and `aliases` block. `src/components/ui/button.tsx` and `src/lib/utils.ts` exist.

- [ ] **Step 3: Add the dropdown-menu component (needed for the mode toggle in Task 3)**

```bash
pnpm dlx shadcn@latest add dropdown-menu -y
```

Expected output: `Created 1 file: - src/components/ui/dropdown-menu.tsx`.

- [ ] **Step 4: Verify build still passes**

```bash
pnpm build
```

Expected: same clean static-route build output as Task 1.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Initialize shadcn/ui with Button and DropdownMenu"
```

---

### Task 3: Dark mode (next-themes + ThemeProvider + ModeToggle)

**Files:**
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/mode-toggle.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Button`, `DropdownMenu*` from Task 2 (`@/components/ui/button`, `@/components/ui/dropdown-menu`); `next-themes`' `ThemeProvider`/`useTheme`.
- Produces: `ThemeProvider` component at `@/components/theme-provider` wrapping `{children}` in `layout.tsx`; `ModeToggle` component at `@/components/mode-toggle` rendered in `page.tsx`.

- [ ] **Step 1: Install next-themes**

```bash
pnpm add next-themes
```

- [ ] **Step 2: Create the theme provider wrapper**

Create `src/components/theme-provider.tsx`:

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 3: Wire the ThemeProvider into the root layout**

Replace the contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nextjs-ts-shadcn-template",
  description: "Blank Next.js + TypeScript + Tailwind + shadcn/ui starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` is required by next-themes — it sets the `class` attribute before hydration and would otherwise cause a mismatch warning.

- [ ] **Step 4: Create the mode toggle component**

Create `src/components/mode-toggle.tsx`:

```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

Note the `render` prop on `DropdownMenuTrigger` — shadcn's Base UI-backed components use a `render` prop for polymorphic composition instead of Radix's `asChild`. This was confirmed to type-check and build in the sandbox verification for this plan.

- [ ] **Step 5: Replace the home page with a minimal demo**

Replace the contents of `src/app/page.tsx` with:

```tsx
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">
        nextjs-ts-shadcn-template
      </h1>
      <p className="text-muted-foreground max-w-md">
        Next.js, TypeScript, Tailwind CSS, and shadcn/ui, wired up and ready
        to build on.
      </p>
      <Button>Get started</Button>
    </div>
  );
}
```

- [ ] **Step 6: Verify with a build and a manual dev-server check**

```bash
pnpm build
```

Expected: clean static build, same as before.

Then start the dev server and confirm the page renders with the toggle and button:

```bash
pnpm dev &
sleep 3
curl -s http://localhost:3000 | grep -o 'Toggle theme'
curl -s http://localhost:3000 | grep -o 'Get started'
kill %1
```

Expected: both `grep` commands print a match.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add dark mode support with next-themes and a mode toggle"
```

---

### Task 4: Prettier + prettier-plugin-tailwindcss

**Files:**
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Modify: `package.json` (add `format`/`format:check` scripts and devDependencies)

**Interfaces:**
- Produces: `pnpm format` (writes), `pnpm format:check` (CI-safe check) — Task 6 (CI) consumes `format:check`; Task 5 (lint-staged) consumes the `prettier` binary directly.

- [ ] **Step 1: Install Prettier and the Tailwind class-sorting plugin**

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

- [ ] **Step 2: Add Prettier config**

Create `.prettierrc.json`:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Create `.prettierignore`:

```
.next
node_modules
pnpm-lock.yaml
```

- [ ] **Step 3: Add format scripts to package.json**

In `package.json`, add two entries to `"scripts"` (alongside the existing `dev`/`build`/`start`/`lint`):

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] **Step 4: Format the whole project and verify**

```bash
pnpm format
pnpm format:check
```

Expected: `format:check` prints `All matched files use Prettier code style!` and exits 0.

- [ ] **Step 5: Re-verify lint and build after formatting**

```bash
pnpm lint
pnpm build
```

Expected: both still pass cleanly — formatting must not change behavior.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Prettier with prettier-plugin-tailwindcss"
```

---

### Task 5: Husky + lint-staged pre-commit hook

**Files:**
- Create: `.husky/pre-commit`
- Modify: `package.json` (add `prepare` script, `lint-staged` config, devDependencies)

**Interfaces:**
- Consumes: `eslint` (Task 1) and `prettier` (Task 4) binaries.
- Produces: a git pre-commit hook that runs `lint-staged` on every commit in this repo (and any repo cloned from it, once `pnpm install` runs the `prepare` script).

- [ ] **Step 1: Install husky and lint-staged**

```bash
pnpm add -D husky lint-staged
```

- [ ] **Step 2: Initialize husky**

```bash
pnpm exec husky init
```

This creates `.husky/pre-commit` (default content `pnpm test`) and adds `"prepare": "husky"` to `package.json` scripts.

- [ ] **Step 3: Point the pre-commit hook at lint-staged**

Replace the contents of `.husky/pre-commit` with:

```
pnpm exec lint-staged
```

- [ ] **Step 4: Add the lint-staged config to package.json**

Add this top-level key to `package.json` (sibling to `"scripts"` and `"dependencies"`):

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

- [ ] **Step 5: Verify the hook actually fires**

Make a trivial change, stage it, and commit for real:

```bash
echo "" >> README.md
git add -A
git commit -m "Add Husky + lint-staged pre-commit hook"
```

Expected: the commit output shows lint-staged's task runner (`Running tasks for staged files…`, `eslint --fix`, `prettier --write`, `Done running tasks for staged files!`) before the commit completes successfully. If the hook doesn't fire at all, check that `.husky/pre-commit` is executable (`chmod +x .husky/pre-commit`) and re-commit.

---

### Task 6: GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `pnpm lint`, `pnpm format:check`, `pnpm build` scripts (Tasks 1, 4).

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - name: Install pnpm
        uses: pnpm/action-setup@v6
        with:
          version: 11

      - name: Use Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Check formatting
        run: pnpm format:check

      - name: Build
        run: pnpm build
```

- [ ] **Step 2: Validate the YAML locally**

```bash
python3 -c "import yaml, sys; yaml.safe_load(open('.github/workflows/ci.yml'))" && echo "YAML OK"
```

Expected: prints `YAML OK` with no exception. (This only validates YAML syntax, not GitHub Actions semantics — full validation happens once it runs in GitHub after Task 8's push.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add GitHub Actions CI workflow"
```

---

### Task 7: README

**Files:**
- Modify: `README.md` (currently the default create-next-app boilerplate)

**Interfaces:**
- None — documentation only.

- [ ] **Step 1: Replace README.md**

Replace the full contents of `README.md` with:

```markdown
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

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Adding shadcn/ui components

\`\`\`bash
pnpm dlx shadcn@latest add <component>
\`\`\`

See the [shadcn/ui component list](https://ui.shadcn.com/docs/components) for available components.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm lint` — run ESLint
- `pnpm format` / `pnpm format:check` — run/check Prettier formatting
```

- [ ] **Step 2: Verify formatting is still clean**

```bash
pnpm format:check
```

Expected: `All matched files use Prettier code style!`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Write project README"
```

---

### Task 8: Push to GitHub

**Files:** none (git operations only)

**Interfaces:** none

- [ ] **Step 1: Add the remote**

```bash
git remote add origin git@github.com:Aguirregzz97/nextjs-ts-shadcn-template.git
```

- [ ] **Step 2: Confirm the remote repo is still empty before pushing**

```bash
git ls-remote origin
```

Expected: no output (empty repo, no refs). If this shows existing refs, STOP and check with the user before proceeding — someone else may have pushed to it.

- [ ] **Step 3: Push**

Check with the user before running this — pushing is a visible, hard-to-reverse action on a shared remote:

```bash
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Verify**

```bash
git ls-remote origin
```

Expected: shows a `refs/heads/main` ref matching the local `HEAD` commit. Confirm the GitHub Actions CI run (Task 6) passes on the pushed commit before considering this done.
