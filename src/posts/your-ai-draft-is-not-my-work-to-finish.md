---
title: 'Your AI Draft Is Not My Work to Finish'
description: 'Fluent output is not finished work. The person who generates it still owns review, verification, and integration.'
date: '2026-08-26'
image: /images/ai-draft-not-my-work-to-finish.webp
published: false
---

## Contents

**_“You didn’t review it. You liked how it made you feel, mistook that feeling for finished work, and shared it. You should have asked for help.”_**

_Header photo by [Grace Galligan on Unsplash](https://unsplash.com/photos/a-red-stop-sign-sitting-on-top-of-a-lush-green-field-dMZeRFGVC-M)._

AI can make a document look done before anyone has done the work to finish it.

The headings are clean. The tone sounds sure. There may be a table, a plan, and a neat conclusion. It feels like progress.

Then somebody who knows the subject opens it.

The terms are wrong. The plan does not fit the real system. Sources are missing or weak. The hard choices have been turned into friendly bullet points. Now that person has to rebuild the context, check every claim, and figure out what can be saved.

> When you skip the review, you do not save work. You move it to somebody else.

## Looks done is not done

AI is great at first passes. It can make outlines, list options, summarize notes, sketch code, and clean up rough language. I use it for all of that.

Here’s the trap: fluent writing hides uncertainty.

A rough human draft usually looks rough. It has gaps, awkward lines, and notes like “check this.” An AI draft can smooth those signs away. The gaps are still there. They are just harder to see.

Before you share AI-assisted work, ask yourself:

- Did I read the whole thing?
- Which claims did I check?
- What did the model assume?
- What is still unclear or unfinished?
- What do I actually want from the person receiving it?

If you cannot answer those questions, call it exploration or a rough draft. That is fine. Just do not call it finished.

## Sometimes the draft is the ask

An unreviewed AI draft can be a hidden request for help.

Picture a general, composite enterprise security example. This is not about my current employer, a specific company, or a real identifiable system.

Someone generates an assessment, gives it a quick skim, and sends it to a specialist. The concerns sound serious. The fixes sound reasonable. But the draft does not know the environment.

The specialist now has to find out what is true, add the missing context, fix the advice, and turn it into a real plan. The sender thinks they gave them a head start. What they really sent was a wide-open review job.

If you need help, ask for it plainly. A DM, note, or email works:

> I used AI to organize my first thoughts, but I have not checked the technical assumptions. Could you help me frame the problem? I am not treating this as a recommendation yet.

That is honest. It tells the other person what you know, what you do not know, and what kind of help you want. They can say yes, say no, or narrow the question.

> Asking for help is not the problem. Hiding the ask inside a polished draft is.

## The cheap part is not the whole job

AI made it cheap to produce words, code, diagrams, and plans. It did not make it cheap to trust them.

Someone still has to:

- check the facts;
- decide whether the work fits the real goal;
- merge it with existing systems and plans;
- maintain it after the first handoff; and
- own the result.

More output can create more review, not less. Ten plausible options are not better than two understood ones. A large patch written in minutes may still take hours to review. A confident plan may create days of discovery for the people asked to carry it out.

> Generation got cheap. Judgment did not.

Research does not give us one simple productivity slogan. In a 2025 randomized study, [METR studied 16 experienced open-source developers working in repositories they knew well](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/). On the tasks studied, they took 19% longer when AI tools were allowed, even though they thought AI had sped them up. METR limits that finding to that setting and now calls it historical.

METR's [2026 follow-up](https://metr.org/blog/2026-02-24-uplift-update/) saw signs that newer tools might help more. But the researchers said selection bias and problems measuring time made the newer estimate unreliable. The honest answer is that results depend on the people, tools, tasks, and what counts as done.

A [Microsoft Research survey of 319 knowledge workers](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/) found that higher confidence in AI was linked with less reported critical thinking. People also described spending more of their thinking on checking responses, fitting them into the work, and overseeing the task. It was a survey, not a productivity experiment. It does not prove AI makes everyone think less. It does show that review does not disappear. It changes.

## I use AI a lot

This is not an anti-AI argument. I use AI deeply in my engineering work.

[Gradient Peak](https://github.com/deancochran/gradientpeak) is my public product repository. Around my local checkouts, I run a separate control plane. That local setup is mine; the public repo link is not proof or documentation of it.

I keep the control-plane root outside Git. Product changes happen in linked worktrees. [Git documents](https://git-scm.com/docs/git-worktree) how one repository can have multiple working trees with their own working state. In my setup, `main` is for inspection and integration, `dev` is for normal implementation, and task worktrees isolate bounded changes:

```text
GradientPeak/
├── control plane (not a Git checkout)
└── .worktrees/
    ├── main/       # inspection and integration
    ├── dev/        # normal implementation
    └── task-*/     # isolated bounded changes
```

The agents have different jobs. There is a coordinator; bounded, quick, deep, and max workers; read-only reviewers; a strategist; and a database generator. Skills give them focused guidance for auth and security, backend and databases, web and mobile, tests, observability, integrations, UI, and core code. [OpenCode agents](https://opencode.ai/docs/agents/), [permissions](https://opencode.ai/docs/permissions/), and [skills](https://opencode.ai/docs/skills/) help me limit who can do what.

For outside context, I connect Context7 docs, Supabase, Sentry, and PostHog through the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro). Those tools bring in information. They do not make the call. OpenCode's [MCP guide](https://opencode.ai/docs/mcp-servers/) makes a similar point: every connected tool adds context, so enable them with care.

There are guardrails too. A worktree-guard plugin keeps agents out of the control root, `main`, other agents' worktrees, and generated files they do not own. Worktrunk installs dependencies and runs `pnpm quality:agent` before a merge. Prompt and compaction tests check things like corrections taking priority, reviewers staying read-only, agents stopping on dirty overlaps, and verification evidence surviving long sessions.

Persistent automation exists, but it is off by default. Most work is interactive and supervised.

That is a lot of setup for something people call a silver bullet.

## Done according to whom?

> The agent finishing is not me finishing.

I still inspect the status and diff. I read the code. I check the assigned paths. I run the checks. I compare the result with what I asked for. Sometimes I send it back. Sometimes I narrow the change. Sometimes I throw it away.

A change can work alone and still be wrong for the product. It may clash with another change, cross a package boundary, hurt the user experience, or create upkeep I do not want.

I often work on a project long after the agents stop. They speed up research, coding, and review. In return, I spend time setting boundaries, giving context, checking results, and deciding what gets in.

That can be a great trade. It is still a trade.

## Make the handoff honest

You do not need a control plane to share AI-assisted work well. You need to own what you send.

Before you hit Share:

1. **Read all of it.** Not just the summary.
2. **Check the important claims.** Follow the links and look at the source.
3. **Add the real context.** Replace generic guesses with actual limits.
4. **Label it honestly.** Notes, rough draft, proposal, or reviewed plan all mean different things.
5. **Name the ask.** Feedback? Expertise? Approval? Editing? Say it.
6. **Own the next step.** Do not make the recipient discover that your handoff needs a rebuild.

Early work is useful when it is presented as early work. A simple note such as “I used AI to explore this, checked these parts, and need help with these two questions” is enough.

AI is an accelerator, not a silver bullet. It can help a careful person move faster. It can also help someone create a bigger mess with more confidence.

The difference is whether the person pressing Share owns what happens next.

## Further reading

- OpenCode [agents](https://opencode.ai/docs/agents/), [permissions](https://opencode.ai/docs/permissions/), and [skills](https://opencode.ai/docs/skills/) are the building blocks for specialized, limited roles.
- [MCP's introduction](https://modelcontextprotocol.io/docs/getting-started/intro) explains how AI tools connect to outside systems.
- [Git's worktree guide](https://git-scm.com/docs/git-worktree) explains linked working trees.
- [METR's 2025 study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) and [2026 update](https://metr.org/blog/2026-02-24-uplift-update/) show why productivity claims need context.
- [Microsoft Research's knowledge-worker survey](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/) covers confidence, review, and critical thinking with AI.
