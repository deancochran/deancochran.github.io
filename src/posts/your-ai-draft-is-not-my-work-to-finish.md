---
title: 'Your AI Draft Is Not My Work to Finish'
description: 'Fluent output is not finished work. The person who generates it still owns review, verification, and integration.'
date: '2026-08-26'
image: /images/ai-draft-not-my-work-to-finish.webp
published: true
---

## Contents

**_“You didn’t review it. You liked how it made you feel, mistook that feeling for finished work, and shared it. You should have asked for help.”_**

_Header photo by [Grace Galligan on Unsplash](https://unsplash.com/photos/a-red-stop-sign-sitting-on-top-of-a-lush-green-field-dMZeRFGVC-M)._

AI can make a document look finished before anyone has done the work to finish it. Clean headings, a confident tone, and a neat plan feel like progress.

Then somebody who knows the subject finds the wrong terms, generic advice, weak sources, and missing tradeoffs. They have to recover the context, check the claims, and decide what can be saved.

> When you skip the review, you do not save work. You move it to somebody else.

## Looks done is not done

AI is useful for outlines, options, summaries, code sketches, and cleaner language. The trap is that fluency hides uncertainty. A rough human draft shows its gaps; AI can smooth them over without filling them.

Before you share AI-assisted work, ask yourself:

- Did I read the whole thing?
- Which claims did I check?
- What did the model assume?
- What is still unclear or unfinished?
- What do I actually want from the person receiving it?

If you cannot answer them, call it exploration or a rough draft, not finished work.

## Sometimes the draft is the ask

An unreviewed AI draft can be a hidden request for help. Picture a general, composite enterprise security example. This is not about my current employer, a specific company, or a real identifiable system.

Someone skims an AI assessment and sends it to a specialist. It sounds credible but does not know the environment. The specialist must verify it, add context, fix the advice, and make a real plan. The supposed head start is a wide-open review job.

If you need help, ask for it plainly. A DM, note, or email works:

> I used AI to organize my first thoughts, but I have not checked the technical assumptions. Could you help me frame the problem? I am not treating this as a recommendation yet.

That tells the other person what you know and what you need. They can accept, decline, or narrow the question.

> Asking for help is not the problem. Hiding the ask inside a polished draft is.

## The cheap part is not the whole job

AI made words, code, diagrams, and plans cheap to produce, not cheap to trust. Someone still has to verify the facts, fit the work to the goal, integrate it, maintain it, and own the result.

More output can mean more review. Ten plausible options are not better than two understood ones, and a patch written in minutes may take hours to check.

> Generation got cheap. Judgment did not.

Research offers no simple productivity slogan. In a 2025 randomized study, [METR studied 16 experienced open-source developers in repositories they knew well](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/). On those tasks, they took 19% longer with AI tools even though they thought AI sped them up. METR limits the result to that setting and now calls it historical.

METR's [2026 follow-up](https://metr.org/blog/2026-02-24-uplift-update/) found signs that newer tools might help more, but selection bias and time-measurement problems made the estimate unreliable. Results depend on the people, tools, tasks, and definition of done.

A [Microsoft Research survey of 319 knowledge workers](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/) linked higher confidence in AI with less self-reported critical thinking. Respondents described more checking, integration, and oversight. It was a survey, not a productivity experiment, so it does not prove AI makes everyone think less. Review changes; it does not disappear.

## I use AI a lot

This is not an anti-AI argument. I use AI deeply in my engineering work.

[Gradient Peak](https://github.com/deancochran/gradientpeak) is my public product repository. Around my local checkouts, I run a separate control plane. That local setup is mine; the public repo link is not proof or documentation of it.

I keep the control-plane root outside Git and make product changes in linked worktrees. [Git documents](https://git-scm.com/docs/git-worktree) that model. In my setup, `main` is for inspection and integration, `dev` is for normal implementation, and task worktrees isolate bounded changes.

A coordinator assigns specialized, bounded workers and read-only reviewers. [OpenCode agents](https://opencode.ai/docs/agents/), [permissions](https://opencode.ai/docs/permissions/), and [skills](https://opencode.ai/docs/skills/) help limit each role and give it focused guidance.

For outside context, I connect Context7 docs, Supabase, Sentry, and PostHog through the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro). They inform the work; they do not decide. OpenCode's [MCP guide](https://opencode.ai/docs/mcp-servers/) also recommends enabling tools with care.

The worktree guard keeps agents out of the control root, `main`, other agents' worktrees, and unowned generated files. Worktrunk installs dependencies and runs `pnpm quality:agent` before merge. Prompt and compaction evaluations test corrections, read-only review, dirty-overlap stops, and verification evidence. Persistent automation is off by default; most work is supervised.

## Done according to whom?

> The agent finishing is not me finishing.

I inspect the status, diff, code, assigned paths, checks, and acceptance criteria. A change can work alone yet conflict with another lane, cross a boundary, or create upkeep I do not want.

Agents speed up research, coding, and review. I still provide context, decide what gets in, and own integration and maintenance. That can be a great trade. It is still a trade.

## Make the handoff honest

You do not need a control plane to share AI-assisted work well. Before you hit Share:

1. **Read all of it.**
2. **Check important claims and sources.**
3. **Add real context and constraints.**
4. **Label its maturity and name the ask.**
5. **Own the next step.**

Early work is useful when labeled honestly. AI can help a careful person move faster or help someone create a bigger mess with more confidence.

The difference is whether the person pressing Share owns what happens next.

## Further reading

- Workflow: [Gradient Peak](https://github.com/deancochran/gradientpeak), [Git worktrees](https://git-scm.com/docs/git-worktree), OpenCode [agents](https://opencode.ai/docs/agents/), [permissions](https://opencode.ai/docs/permissions/), [skills](https://opencode.ai/docs/skills/), [MCP](https://modelcontextprotocol.io/docs/getting-started/intro), and [MCP servers](https://opencode.ai/docs/mcp-servers/).
- Research: METR's [2025 study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) and [2026 update](https://metr.org/blog/2026-02-24-uplift-update/), plus the [Microsoft Research survey](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/).
