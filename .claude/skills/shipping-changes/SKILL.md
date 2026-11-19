---
name: shipping-changes
description: Use when implementing any change to this app that the user asked for — a feature, fix, or edit — from the moment code is first changed through committing and pushing it, including when the user says "looks good", "ship it", "go ahead", or states time pressure or a deadline.
---

# Shipping Changes

## Overview

Between "user asked for a change" and "it's on `origin/main`" there are four
gates: diff → local review → `/code-review` → approved fixes → commit/push.
Each gate needs its **own** green light. Approval of an earlier gate is not
approval of a later one, no matter how it's phrased.

## The required sequence

1. **Implement the change.** Leave it as an uncommitted working-tree diff —
   do not `git add`/`git commit`. Tell the user it's ready to review and run
   locally (`pnpm dev`, or `pnpm lint` / `pnpm build` if relevant).
2. **Wait for the user to review/test locally and say it's good.** This
   unlocks step 3 only. "Looks good", "thanks", "ship it" approve the
   _implementation_ — nothing about git.
3. **Run `/code-review` yourself**, unprompted — don't wait to be asked.
   Show the findings to the user and let them decide which ones to act on.
4. **Apply only the findings the user approved.**
5. **Ask whether to commit and push, and with what message.** Do not run
   `git commit` / `git push` until the user answers _that specific question_
   in this exchange.

## Red flags — stop if you catch yourself doing this

- About to run `git commit`/`git push` without the user having answered the
  step-5 question in this exchange.
- About to skip step 3 ("`/code-review`") because the change "doesn't need
  it," is "trivial," or is "just a UI tweak."
- Treating "go ahead" / "ship it" / "ready to deploy" as authorization for
  anything beyond moving to the _next_ step.
- Treating urgency or a deadline ("need this live in N minutes") as a reason
  to skip a gate instead of a reason to move through the gates quickly.
- About to push straight to `main` without `/code-review` having run at all.

| Rationalization (seen in testing)         | Reality                                                                                                                                  |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| "User said 'go ahead'"                    | Approves the visible result, not git actions or skipping review.                                                                         |
| "User has a deadline / needs it live now" | Changes how fast you move through the gates, not whether you go through them. Say you're running review now; don't skip it to save time. |
| "It's trivial / low-risk"                 | Triviality is a judgment call — exactly what `/code-review` is for, not an exemption from it.                                            |
| "It's just a UI tweak"                    | Still goes through all 5 steps.                                                                                                          |
| "They'll tell me if they don't want this" | Silence ≠ consent. Steps 2 and 5 require the user to actually say something back.                                                        |

## Explicit override

Skip a step only when the user's message **explicitly names that step** in
this exchange (e.g. "skip the code review on this one," "just push it,
don't ask me again this session"). General urgency, approval of the diff, or
"go ahead" do not count — those move you to the next gate, not past it.
An override is scoped to what was asked; it doesn't carry forward to the
next unrelated change.
