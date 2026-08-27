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

AI can produce a document that looks finished before anyone has done the work required to finish it.

The headings are clean. The tone is confident. The recommendations sound specific. There may even be a table, an implementation plan, and a reassuring conclusion. It creates the emotional experience of progress.

Then somebody who understands the problem opens it.

The assumptions are unstated. The terminology does not match the organization. The proposed controls do not fit the system. Sources are missing, stale, or weaker than the prose suggests. The hard tradeoffs have been rounded into bullet points. Now that person must reconstruct the prompt, recover the context, verify every claim, identify what is usable, and explain what has to change.

That was not a handoff. It was work reassignment with nicer typography.

## Fluent is not finished

Generative AI is exceptionally good at early-stage output: outlines, options, first passes, summaries, scaffolding, and plausible language. That is useful. It is also easy to confuse with completion because fluency hides uncertainty.

A rough human draft usually advertises its roughness. It has gaps, notes to self, awkward transitions, and visible questions. A generated draft can smooth over those signals. The uncertainty remains, but the presentation makes it less obvious.

That difference matters. A polished surface changes how people evaluate the artifact. Instead of asking, “What remains unknown?” they ask, “Does this look impressive?” Instead of checking whether the recommendation fits reality, they react to how decisively it is written.

The draft becomes dangerous when the generator stops being its first reviewer.

Before sharing AI-assisted work, the person sharing it should be able to answer:

- What did I ask the model to do, and what context did I withhold?
- Which claims did I verify against primary or authoritative sources?
- Which assumptions are mine, and which did the model invent?
- What decisions does this artifact make, and who has authority to make them?
- What is incomplete, uncertain, or intentionally out of scope?
- What do I want from the recipient: review, a decision, subject-matter help, or implementation?

If you cannot answer those questions, label the artifact as exploration. Do not present it as finished work.

## The hidden request for help

Sometimes an unreviewed AI artifact is really a request for help from somebody who does not want to ask directly.

Imagine a generalized, composite enterprise security scenario. This is not an account of my current employer, any particular company, or one identifiable system. Someone generates an assessment-style document about a complicated environment and forwards it to a specialist. It contains broad concerns, generic remediation language, and confident priorities. The specialist is expected to determine which statements are true, supply the missing environment context, correct the recommendations, and turn the document into something actionable.

The sender may believe they contributed a useful head start. The recipient received an unbounded research and review task.

If what you need is expertise, say so:

> I used AI to organize my initial thoughts, but I do not know whether the technical assumptions are sound. Could you help me frame this? I have not treated the draft as a recommendation.

That message is honest. A DM, note, or email can establish the question, the uncertainty, the desired outcome, and the amount of help being requested. It gives the other person a chance to accept, decline, narrow, or redirect the work.

Asking directly is not a weakness. Disguising the request as a completed artifact is.

## Generation is cheap; acceptance is not

The cost of producing words, code, diagrams, and plans has fallen. The cost of being responsible for them has not.

Acceptance means deciding that an artifact is fit for its intended purpose. Verification means checking it against evidence and actual constraints. Integration means making it coexist with people, systems, code, policies, and timelines. Maintenance means owning what happens after the artifact meets reality. Judgment connects all four.

Those costs often increase with generated output because AI lets us create more candidates than we can responsibly evaluate. Ten plausible approaches are not automatically better than two understood ones. A large patch produced in minutes can still take hours to review because the reviewer must build a mental model the generator never had. A confident plan can impose days of discovery on the people asked to implement it.

This is the accounting error behind “AI did most of the work.” It may have done most of the generation. That is not the same unit.

Research does not support one universal productivity slogan either. In a 2025 randomized study, [METR observed 16 experienced open-source developers working in their own repositories](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) take 19% longer on the studied tasks when AI tools were allowed, even though they believed the tools had sped them up. METR explicitly limited that result to its setting and now labels it historical. Its [2026 follow-up](https://metr.org/blog/2026-02-24-uplift-update/) found signs that newer tools may help more, but the researchers said selection effects and time-measurement problems made the newer estimate unreliable.

That is the useful lesson: the feeling of acceleration is not sufficient evidence, and the effect depends on the people, tools, tasks, and definition of done.

Microsoft Research reached a related but distinct conclusion in a [survey of 319 knowledge workers](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/). Higher confidence in generative AI was associated with less reported critical thinking, while respondents described critical thinking shifting toward verification, integration, and task stewardship. It was a survey, not a productivity experiment, so I would not use it to claim that AI makes everyone think less. I would use it as a reminder that oversight changes shape rather than disappearing.

## I use AI deeply

This argument is not anti-AI. I use AI deeply in my engineering work. [Gradient Peak](https://github.com/deancochran/gradientpeak), the product repository, is public. The orchestration around my local checkouts is a separate arrangement I maintain; the public repository link is not documentation for that control plane.

Locally, I keep the coordination root outside Git and make product changes in linked worktrees. [Git's official documentation](https://git-scm.com/docs/git-worktree) describes how one repository can support multiple working trees with separate per-worktree state. I reserve `main` for inspection and integration, use `dev` for normal implementation, and create task worktrees for bounded changes:

```text
GradientPeak/
├── control plane (not a Git checkout)
└── .worktrees/
    ├── main/       # inspection and integration
    ├── dev/        # normal implementation
    └── task-*/     # isolated bounded changes
```

I assign specialized roles instead of giving every agent the same job: a coordinator; bounded, quick, deep, and max workers; read-only reviewers; a strategist; and a database generator. Domain skills cover authentication and security, backend and database work, web and mobile frontends, testing, observability, integrations, and the UI and core packages. This uses documented [OpenCode agents](https://opencode.ai/docs/agents/), [permissions](https://opencode.ai/docs/permissions/), and [on-demand skills](https://opencode.ai/docs/skills/) to keep authority explicit.

For outside context, I connect Context7 documentation, Supabase, Sentry, and PostHog through the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro). Those sources inform the work; they do not make the decision. OpenCode's [MCP documentation](https://opencode.ai/docs/mcp-servers/) also warns that connected tools add context and should be enabled deliberately.

A worktree-guard plugin protects the coordination root, `main`, other agents' worktrees, and tool-owned generated outputs. Worktrunk installs dependencies for a new lane and runs `pnpm quality:agent` before merge. Prompt-behavior and compaction evaluations cover correction precedence, read-only audits, dirty-overlap stops, generator safeguards, verification evidence, and preservation of authority and checkout state. Persistent orchestration exists but stays dormant by default; ordinary work is supervised and interactive.

That is a lot of machinery for a silver bullet.

## The agent finishing is not me finishing

When an agent says it is done, I am usually not done.

I inspect the status and diff. I read the changed code. I check whether it stayed within its assigned paths. I run the relevant validation. I compare the result with the acceptance criteria. I look for assumptions that were convenient for the agent and wrong for the product. I may send corrections, narrow the change, or discard it.

Then there is integration. A locally correct change can conflict with another lane, violate a package boundary, degrade the user experience, or create maintenance I do not want. Automated checks can reject known bad states. They cannot decide whether the change is worth owning.

I continue working on projects for a long time after agents finish. The agents shorten parts of implementation, research, and review. They also create new supervision work: specifying boundaries, assembling context, evaluating evidence, and deciding what enters the product.

That trade can be excellent. It is still a trade.

## A better handoff

You do not need my control plane to share AI-assisted work responsibly. You need ownership and labels.

Before sending the artifact:

1. **Read all of it.** Not the summary. Not the first screen. All of it.
2. **Verify consequential claims.** Follow links, inspect source material, and separate evidence from inference.
3. **Add the missing context.** Replace generic assumptions with the constraints that actually govern the work.
4. **State the maturity.** Call it notes, exploration, a draft, a proposal, or a reviewed recommendation accurately.
5. **Name the ask.** Say whether you need feedback, expertise, approval, editing, or execution.
6. **Own the next step.** Do not make the recipient discover that accepting your document means rebuilding it.

If the artifact is not ready, that is fine. Early-stage work is valuable when it is honestly presented. “I generated this to explore the space, reviewed these sections, and need help with these two questions” is a useful handoff.

“Here is the finished plan” is not, when what you mean is, “Please figure out whether any of this is true.”

AI is an accelerator. It can help a careful person explore faster, implement faster, and test more possibilities. It can also help an incurious person create a larger burden with greater confidence.

The difference is not the model. It is whether the person pressing Share accepts responsibility for what happens next.

## Further reading

- [OpenCode: Agents](https://opencode.ai/docs/agents/) explains specialized primary agents and subagents, including read-only roles.
- [OpenCode: Permissions](https://opencode.ai/docs/permissions/) documents allow, ask, and deny controls for agent actions.
- [OpenCode: Agent Skills](https://opencode.ai/docs/skills/) describes reusable instructions loaded on demand.
- [Model Context Protocol: Introduction](https://modelcontextprotocol.io/docs/getting-started/intro) defines MCP as an open standard connecting AI applications with external systems.
- [Git: `git-worktree`](https://git-scm.com/docs/git-worktree) documents linked working trees and their separate per-worktree state.
- [METR's 2025 study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) and [2026 methodology update](https://metr.org/blog/2026-02-24-uplift-update/) show why AI productivity results need narrow interpretation and current context.
- [Microsoft Research on critical thinking in AI-assisted knowledge work](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/) reports associations among confidence, critical-thinking effort, verification, integration, and stewardship.
