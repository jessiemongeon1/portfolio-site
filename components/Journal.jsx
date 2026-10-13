const { useState, useEffect, useRef } = React;

const JOURNAL_POSTS = [
  {
    id: "p7",
    title: "A documentation-quality system for people and agents: design, pipelines, and what it measures",
    dek: "Twelve measurements, one ranked list of work, and the failures that decided how the numbers are weighed.",
    tag: "Evaluation",
    date: "Oct 13, 2026",
    read: "22 min",
    accent: "blue",
    body: [
      "This is a report on a documentation-quality system I built and run for a blockchain platform and its sister products: seven documentation sites, two public skill repositories, and a dashboard that reads every measurement the system makes. It covers what the system is for, how it is put together, what each job measures and how, how the pieces are weighted and joined, and the design decisions and failures that shaped them. Product names, vendors and model names are left out on purpose; the mechanics are the point.",
      "## The goal",
      "Documentation has two readers now: a developer, and the AI agent the developer is increasingly working through. The documentation team's job is to make both succeed, and the only honest way to know whether that is happening is to measure it the way those readers experience it: ask the questions they ask, run the tasks they run, and check whether the pages carry the answers.",
      "The system exists to answer four questions, continuously and with evidence attached:",
      "1. **Is the documentation correct?** Against the source code it describes, the sibling pages it should agree with, and the declared goal of each page.",
      "2. **Can a model use it?** With the documentation in context, does a model answer developer questions and complete developer tasks it could not do without it, and by how much?",
      "3. **Where is the work?** Which pages, which gaps, ranked by how many readers they affect and how badly, with the measurement that says so sitting next to each item.",
      "4. **Did the fixes land?** Which proposed changes became merged pull requests, which were rejected, and whether the numbers moved afterwards.",
      "Everything else is in service of those four. A measurement that cannot be traced to a page a writer can open, or a change a reviewer can merge, is not kept.",
      "## The shape of the system",
      "Three layers, in one repository plus two public ones.",
      "**Measurement jobs.** About two dozen scheduled CI workflows. Deterministic checks run nightly; model-driven evaluations run on crons from every 48 hours to weekly, each as a matrix of one job per model (and per context layer, where a comparison needs one). Every job writes JSON reports into the repository and commits them; nothing is computed on request.",
      "**A data layer in git.** Several hundred megabytes of reports: per-model evaluation results, agent transcripts, a findings ledger per site, analytics snapshots, a model registry. Committing the data is deliberate: a build on a machine with no access to the pipelines still has the last good numbers, every number has a commit and a date, and a report nobody reads is still a report someone can open later.",
      "**A prerendered dashboard.** A React application that reads the reports at build time and renders about forty pages, roughly 1,900 prerendered routes in all, plus a handful of API routes that dispatch workflows or write to the ledger. The public parts are two leaderboards (one per skill repository) that live in the skill repositories themselves and are rebuilt from published score cards. The dashboard is behind single sign-on; the boards are public.",
      "The flow is one direction: documentation and code and reader behaviour go in; reports come out; the dashboard joins and ranks them; a person, or a bounded automated proposer, turns the top of the ranking into pull requests; the next run measures whether that helped.",
      "### Inputs",
      "| Input | What it is | Where it enters |\n| --- | --- | --- |\n| Documentation content | Two documentation repositories, several sites, MDX pages with frontmatter | The checks, the audit, the dossier, the fix proposer |\n| Source code | The platform's repositories: smart-contract framework, protocol definitions, SDKs, CLI | The correspondence checks (does the page match the code?) |\n| Skills | Two public repositories of agent skill files, each skill carrying an evals file of questions and expectations | Every model evaluation, the routing eval, the public boards |\n| Web analytics | Visitors, pageviews, time on page, scroll depth per page; entry pages and bounce from journeys | Page weights, reader-behaviour items, the weekly report |\n| Chatbot export | Every question asked through the docs assistant, with the page the reader was on | Chatbot items, coverage gaps |\n| Models | Three frontier providers and a gateway serving fourteen open-weight models, all through one agent harness | The models under test, the judge, the oracle, the fix proposer |",
      "## The pipelines",
      "Each pipeline below is described the same way: what it measures, what it reads, how it grades, what it writes, how often, and what it taught us. The order is from the most deterministic to the most model-dependent, which is also the order of trust.",
      "### 1. Correspondence checks and the findings ledger",
      "**Measures:** whether each page agrees with the code it documents and the pages around it. Documented function signatures against the source; documented RPC services against the protocol definitions; import selectors against the published packages; walkthrough line references against the files they quote; CLI flags, HTTP endpoints, SDK types; links and anchors; frontmatter schema; typos; redirects; and whether the page's own stated goal is met by what is on it.",
      "**Reads:** the documentation repositories and the code repositories at their current commits, plus the published SDK packages installed fresh.",
      "**Grades:** deterministically. A check inspects items and reports findings; a check that inspects zero items on a site that should have them is **vacuous**, which is treated as an error rather than a pass, because a check that never ran looks exactly like a check that found nothing.",
      "**Writes:** a findings ledger per site. Each finding has a rule, a file and line, the current text, a proposed replacement where the check can write one, a tier (how misleading it is), a confidence, and a status: open, in a pull request, fixed, rejected, or dismissed. The ledger remembers state between runs, so a finding a human closed is never re-proposed.",
      "**Proposes:** a proposer groups open findings by theme, verifies each proposed replacement against a fresh checkout, builds the code examples a change touches, fact-checks any prose claim against the local documentation index, and opens one pull request per theme per site, updating it in place on later runs rather than opening a second.",
      "**Cadence:** nightly for the full set; every six hours for drift (did the upstream code change under a page?) on sites whose source changed.",
      "**What it taught us.** The merge rate is the only number that matters and nothing was showing it. Over thirty days on the largest site, 87 proposer pull requests were opened and 26 merged. By theme, the content-quality edits merged 44% of the time; the contradiction, absolute-link and frontmatter themes merged 0 to 11% and were closed, often as duplicates of each other. A check can be correct and still produce pull requests nobody wants. The next change is to stop opening pull requests from themes with a zero merge rate until the check itself is revisited, and to put merge rate per theme on the dashboard as the pipeline's one KPI.",
      "### 2. The content audit",
      "**Measures:** what a careful reviewer would say about each page. A strong model reads every page against the page's declared goal and scores four dimensions, accuracy, comprehension, coverage and agent readiness, from 0 to 100, writes the issues it sees under each, checks the declared goal's acceptance criteria one by one, and scores an extractability measure: structured frontmatter, question-shaped headings, a direct opening answer, code-to-explanation balance, link density.",
      "**Reads:** every page of each site at a named commit. References and include fragments are excluded.",
      "**Writes:** a baseline per site, kept with its previous version so the dashboard can show movement.",
      "**Cadence:** weekly.",
      "**What it taught us.** A reviewer's notes are not all issues. The model lists confirmations (\"the key sizes are accurate\") in the same list as problems, so a filter drops any note that only praises and keeps one that praises and then qualifies. Volume is also not severity: the audit produces 88% of all action items on the largest site, almost all low or medium, and any ranking that counted items would rank by how much the reviewer wrote. The dossier's scoring (below) was designed around that.",
      "### 3. The knowledge suite",
      "**Measures:** how well a model answers real developer questions, and how much the skill files add. This is the public leaderboard.",
      "**Reads:** the suite, assembled from an evals file beside every skill in the public repository: about 160 questions for the platform's skills and 42 for the sister product's, each with a prompt and a handful of written expectations, each citing the documentation page the answer comes from. Expectations must be sourced; an expectation the cited page does not support is a bug in the suite, and several have been rewritten that way.",
      "**Runs:** every model in the registry, in two context layers: **baseline** (the prompt alone, with read/grep/list tools over an empty directory) and **with skills** (the skill's files on disk and its text in the system prompt). Three attempts per question, a default set this month after a long period at one; one answer is a sample, not a census. A core trio of models runs every 48 hours; the full registry runs weekly.",
      "**Grades:** a small, fast model acts as judge at temperature 0, reading each answer against the numbered expectations and returning a verdict and a reason per expectation. A deterministic term matcher runs alongside as a cross-check and the two graders' disagreement rate is reported. Expectations are counted, not questions: a model that gets five of six expectations is not the same as one that gets none.",
      "**Writes:** one result file per model per layer, and a **card**: the publishable part of a run, which model, which layer, how many expectations met per question, with provenance (judge, sample count, suite fingerprint, source: pipeline or community). Cards go to the public repository by pull request; the board is rebuilt from cards plus the skills they were scored against. A run scored against an older suite fingerprint is marked, not ranked. A run that answered under a coverage gate is marked partial, not ranked.",
      "**The number.** A model's score is the mean of four pillar scores (the suite's skills are mapped onto four areas), not the pooled pass rate, so the largest pillar cannot decide the figure. The headline the team reads is the **lift**: with-skills minus baseline. Frontier models sit at 92 to 100% with the skills and 55 to 76% without; open-weight models span 7 to 97% with the skills, which is where the suite still discriminates.",
      "**What it taught us.** The frontier is saturated: four models score 97% or better with the skills, and re-measuring them weekly costs money to confirm it. The information is in the lift and in the tail. The suite's identity is a fingerprint over eval ids and expectation counts; renaming every eval once invalidated every card on the board until a matcher recovered 106 of 113 ids by their expectation text. A scheduled run went red several times on the public board's own validators while every leg had measured correctly, which taught people to stop reading the status; publishing now can never fail a measurement.",
      "### 4. The onboarding suite",
      "**Measures:** how a model answers the open-ended questions a developer actually arrives with, 89 prompts across thirteen categories, from complete beginner to node operation and transaction ordering, with a quarter of real traffic in mind: some prompts are in other languages.",
      "**Runs, originally:** the prompt alone versus every skill file concatenated into the system prompt. **That design was wrong.** On the first full run the all-skills layer scored *below* the prompt alone on 58 of 89 questions. Forty-odd skills in one system prompt is what that does to an answer, and it is not what any agent experiences.",
      "**Runs, now:** three layers. **Baseline**, the prompt alone. **Routed**: a small model reads the catalogue of skill names and descriptions, exactly what a production agent sees, picks up to three, and those skill files are loaded. **Oracle**: the skill that owns the question, by label, loaded alone; for the 23 prompts no skill owns, the oracle layer is the baseline answer and the record says so. Routed minus baseline is what the skills are worth in production; oracle minus routed is what routing costs. Three attempts per layer. Scoring is the mean of per-category pass rates, with a coverage gate below which a run is held out of ranking.",
      "**What it taught us, so far.** The first run under the new design, on one model: baseline 74%, routed 73%, oracle 74%, all inside each other's confidence intervals, and the router loaded the owning skill on 58 of 89. For that model on this suite, even the right skill does not move the answer. That is a finding about the suite or the skills, not about routing, and the full frontier run will say whether it holds.",
      "### 5. The routing eval",
      "**Measures:** the thing every other evaluation skips. Every other runner hands the model the correct skill by name. In production the agent sees forty-odd one-paragraph descriptions and has to choose, so the frontmatter is the product and nothing tested it.",
      "**Runs:** every eval prompt in the suite, routed by a small model at temperature 0 against the catalogue's names and descriptions; the label is the skill that owns the eval. Three catalogues: each repository alone, and both together, because a developer with both installed sees one list and a cross-repository collision only shows there. Weekly, one cheap call per prompt.",
      "**Writes:** top-1 accuracy and recall at k, the skills never picked for their own prompts, the skills over-picked for prompts they do not own, the confusable pairs, and a row per skill. Then a second pass: for each skill the router gets wrong, a strong model drafts a replacement description from the prompts it lost and the description that beat it, the router is re-run on the affected prompts, and the result is recorded with before and after for both skills. Nothing is applied; a person opens the pull request. First measurement: 75% top-1, 92% recall at 3.",
      "### 6. The agentic suites",
      "**Measures:** whether an agent can complete a real development task in a sandbox, and where it goes wrong.",
      "**Reads:** task definitions, each with a prompt, the documentation pages it is built from, a rubric, and a list of mechanical validations: a file exists, a file contains these patterns and not those, a dependency is pinned to something current, a command (the compiler, the test suite) succeeds, a linter passes, a placeholder-rejection check that fails any file containing the words a model writes when it does not know the answer. A domain-specific corpus of 22 harder tasks (building financial protocols from scratch, integrating existing ones) uses the same machinery.",
      "**Runs:** three modes. **Baseline**, four turns, prompt only. **With skills**, four turns. **Oracle**: eight turns, with a second model watching every turn; when the agent stalls it drafts a hint, fact-checks the hint against the documentation before the agent sees it, and injects it only if the documentation supports it. After the task, the oracle reviews the produced code against the documentation and classifies each finding: a skill gap, a pattern the skill covers but the agent ignored, a deprecated pattern, or matches the docs. Every finding is then fact-checked, claim by claim, against a lexical index of the documentation checkout at the commit under test, with a verbatim quote required.",
      "**Writes:** one transcript per task per model per mode, with the validation fingerprint it was scored against (so two runs scored against different check lists cannot be compared silently), tool-call counts, and the review. Resolve rates feed the dashboard and the per-page dossiers; verified findings feed the oracle insights page.",
      "**What it taught us.** A run in which the agent never called a tool is not a failed attempt; it is no attempt, and it is now marked `didNotRun` and excluded, out loud, from every rate. Across 1,740 transcripts on file, a quarter are dead runs, from a dead provider, a gateway that mangles one model's tool calls, and stalls. Frontier models resolve 6 of 6 tasks in every mode: the suite no longer separates them, and the lift shows on the middle tier. The fact check is the sobering part: on the most recent pass, of 300 distinct review claims, 15 were verified, 113 contradicted by the documentation and 172 not found in it. Most of what the oracle reports as a documentation gap, the documentation either contradicts or never mentions. The board shows verified findings and marks the rest.",
      "### 7. The visibility suites",
      "Two smaller pipelines measure what a model says when nothing is loaded. An **unbranded** suite sends 79 comparison prompts with no platform context and records which platforms are mentioned, for visibility only, no pass or fail. A **competitor** benchmark sends the same task prompt with different ecosystem contexts and compares answer quality, then fetches competing documentation pages and scores them on the same extractability measure the audit uses. Both weekly, both cheap.",
      "### 8. Analytics and the weekly report",
      "A weekly job pulls the analytics service (visitors, pageviews, scroll depth, time on page per route; entry pages and bounce from journeys) and the chatbot export (every question with the page it was asked from), snapshots them, and has a model write recommendations per route, each fact-checked, into a worklist that the dossier reads. Coverage gaps are computed as questions per pageview per page. A separate weekly job tracks skill installs and assistant usage as adoption signals.",
      "### 9. The model registry and the harness",
      "All model evaluations go through one harness over one agent SDK, so a comparison across providers is a comparison of models and not of client code. The harness owns: per-model thinking-level selection from the catalogue; a retry when a reasoning model returns a thinking-only turn; a request rewriter for a gateway that rejects the SDK's content-array format; and a silence watchdog that aborts a turn after five minutes with no event, because a hung model otherwise ran until the job ceiling, which was once six hours.",
      "The model matrix is a registry file refreshed nightly from the provider catalogue: new members of families already measured are adopted and run that night; retirements are manual. A model can declare `tools: false` with a reason (one open-weight model's tool calls arrive from the gateway as reasoning text, never as tool calls, so it is measured without tools where the skill text is in the prompt anyway, and left out of the agentic suites entirely).",
      "## Joining it: the per-page dossier",
      "Twelve of the jobs above say something about a specific page, and for a long time each said it on its own dashboard page. A writer looking for work had to visit all of them. The dossier joins everything per route.",
      "**Identification.** Every source names a page differently, a content file, a URL, an analytics path, a chatbot origin, and all are reduced to one route per site by one set of rules that mirror the worklist's. A page exists in the join the moment any source names it; a page nothing names does not appear; traffic alone does not make a page work.",
      "**Action items.** Each item is a sentence a writer can act on, with its source, a severity, and the evidence that produced it: a score, a quote, a count, a check name, a file and line. Severity is set per source by rule. An audit accuracy note on a page scoring under 70 is high; a tier-B ledger finding is high because tier B is the ledger's \"actively misleading\" tier; a broken anchor is low; an agent task resolved under half the time is high. Praise is filtered; closed findings are excluded; dead runs do not count; oracle findings the fact check contradicted are dropped.",
      "**Scoring.** A page's score is how much the page matters times how much is wrong with it, with the second part damped:",
      "`score = weight × (1 + ln(1 + Σ severity))` with high = 1.0, medium = 0.5, low = 0.2",
      "The log is the point: forty low notes cannot outrank one wrong signature on a busy path. The weight starts at 1 and is multiplied by every condition that holds, read from the same constants the worklist uses so the two rankings agree by construction: on a primary reader path ×1.2; failing its declared goal ×1.5; untouched over 180 days ×1.5; low extractability ×1.4; top-decile traffic ×1.8 or medium ×1.3 (the cuts are the site's own distribution, and a page must clear both a percentile and a share of total traffic, because on a site with a median of two visitors the 90th percentile is 14); read repeatedly ×1.2; readers stopping before 40% ×1.3; a 90% bounce ×1.3; a chatbot question per pageview ×1.6. Every multiplier that fires is written into the page's \"why\" list and shown under the title.",
      "**The button.** Each dossier page can send its whole dossier and the page source to a strong model with the instruction to change only what an item justifies, never to invent a fact, and to keep frontmatter, imports and components intact. The revision is refused if it drops a frontmatter field or an import line, changes length by more than half or double, or unbalances a code fence. What passes becomes a draft pull request whose body is the model's own account read against the dossier: what changed and which items it addresses, and which items were skipped and why.",
      "## Designing the dashboard",
      "A few rules held across every page, and each came from a page that broke them.",
      "**Remove, don't explain.** A confusing number gets deleted, not justified with a longer caption. The onboarding page once showed four layers where two were a null result; they are gone, with one sentence saying why.",
      "**Mark, don't delete.** A run that answered most of a suite is excluded from ranking and fully usable for everything else. A card scored against an older suite is shown as against an older set. Partial is a label.",
      "**Provenance with every number.** Who graded it, which suite fingerprint, when, how many attempts, which ids were recovered, whether the source was the pipeline or a community submission. When a rename invalidated the board, provenance is what let the cards be recovered instead of discarded.",
      "**Show the evidence, not the verdict.** A reader cannot act on \"failed.\" They can act on the judge's reason sitting next to what the model said, or the chatbot's actual questions sitting next to the page.",
      "**Plain labels, full URLs, no tiny text.** The audience includes people who do not run the pipelines. Section headers say what a thing is in a sentence, not a codename.",
      "**Prerender everything.** The dashboard computes nothing on request. Every page is built from committed data, which makes it fast, auditable, and deployable without credentials. The cost is freshness: a finding closed this morning shows until the next push rebuilds, and the page says when it was generated.",
      "**Publishing never fails a measurement.** The step that rebuilds a public board, pushes cards, or opens a pull request is allowed to fail with a warning. The step that commits the results always runs. A red run that means \"the numbers are fine but publishing was refused\" is worse than no signal.",
      "## What the jobs cost, and what broke",
      "Over thirty days: about a thousand workflow runs. The oracle suite was the most expensive at roughly 6,000 wall-minutes; the knowledge suite about 4,400; the onboarding suite about 1,100 with single legs running five hours. Half of all runs in the window were one deleted hourly job failing on a missing integration that nobody had alerting for. The failures that cost the most time were not in the models.",
      "**A dead provider on every matrix.** One provider's key turned out to be free-tier, twenty requests a day per model. Its three models returned empty answers on every leg for weeks, discarded by the guards each time, and spent six legs per run doing it. Removed from the registry; the registry only adopts model families already present, so they stay out.",
      "**A gateway that leaks tool calls.** One open-weight model's tool calls came back as trailing JSON inside the reasoning text with a normal stop reason and no tool-call array. The harness saw a thinking-only turn and an empty answer, 290 turns in a row. Diagnosed from a wire capture, fixed by measuring the model without tools.",
      "**Context overflow retried as a throttle.** A model with a small window spent eight tool rounds listing an empty directory until the request no longer fit, and the retry loop re-asked a deterministic 400 three times per question. The gateway's error body was being truncated before the sentence that named the limit. Now the full body is recorded, a context-length 4xx is never retried, and the empty tool root carries a README saying it is intentionally empty.",
      "**A rate-limit storm overwrote a measurement.** One model's run met 429s on 155 of 156 questions, exited 0 as designed, and the commit job wrote it over nothing better; the board carried a one-question card for a day. The commit job now refuses to replace a committed result with a run that errored on more than a third of its evals.",
      "**The judge choked on a glob.** Asked about `**/*` patterns, the judge quoted them back with a Markdown escape that is not a JSON escape, the parser rejected the whole array, and the same eval was ungraded on twelve models. One repair of backslashes before retrying the parse.",
      "**One sample is not a census.** Every comparison was published at one attempt per question. Three is now the floor everywhere, and the agentic suites were re-batched into single-task jobs so three attempts fit under the six-hour job ceiling.",
      "**The build output was tracked.** A trace file from the build was committed and modified on every status check, for months.",
      "## What it is worth",
      "Against the cost: a knowledge suite with a stated noise floor, every model measured on identical questions through one pipeline, two public boards anyone can reproduce from the published cards, an onboarding suite that now measures the thing an agent actually does, a routing eval that measures the one artifact nothing else tested, agentic suites with dead runs marked and findings fact-checked, a ledger with 820 fixed findings across the two largest sites, and a per-page dossier that turns twelve measurements into one ranked list of work with the evidence attached.",
      "The system tells the team which parts of the documentation models cannot use, which pages readers abandon, and which proposed fixes reviewers actually accept, and the figures move when the documentation changes. That is the whole claim. The next work is a page about the jobs themselves (last run, success rate, minutes, last data commit, pages fed), because every failure above was invisible until someone assembled that view by hand; concurrency groups so three matrices stop queuing each other for hours; and extracting the three authoring tools (test a skill against its evals, generate a skill from a page and iterate, A/B a skill edit) into their own repository, which is underway.",
    ]
  },
  {
    id: "p1",
    title: "Why I rewrote the Web3 Pocket Guide from scratch for the second edition",
    dek: "The ecosystem changed. The explanations had to change with it.",
    tag: "Books",
    date: "Apr 20, 2026",
    read: "7 min",
    accent: "blue",
    body: [
      "When I published the first edition of The Ultimate Web3 Pocket Guide in 2022, the ecosystem looked different. NFTs were dominating the conversation, Layer 2s were still emerging, and most developers I talked to were trying to figure out where to even start. The book was written for that moment – a comprehensive field guide to the full Web3 stack.",
      "By 2025, almost every section needed significant revision. New consensus mechanisms had matured. Entire categories of decentralized applications had emerged that didn't exist when I wrote the first edition. The tooling landscape for developers had shifted substantially, with new SDKs, new chains, and new approaches to building on-chain.",
      "I could have updated a few chapters and called it a revision. Instead, I chose to rewrite from scratch. The reason is simple: a reference guide is only useful if the reader can trust it. If half the content reflects the current state of the ecosystem and the other half reflects 2022, the reader doesn't know which half they're reading. That uncertainty defeats the purpose of a pocket guide.",
      "The second edition keeps the same structure – blockchains, consensus, wallets, smart contracts, storage, tokens, and developer tooling – but every section has been rewritten to reflect what the ecosystem actually looks like now. New projects have been added, outdated ones have been removed, and the explanations have been refined based on three more years of writing developer education.",
      "The hardest part wasn't the research. It was deciding, again, what to leave out. The ecosystem has only gotten bigger since 2022, and a pocket guide isn't a catalog. It's a curated set of explanations designed to help you understand the landscape without drowning in it."
    ]
  },
  {
    id: "p2",
    title: "What I learned redesigning developer docs from the ground up at DFINITY",
    dek: "Five thousand commits, six rounds of user studies, and one big lesson about information architecture.",
    tag: "Docs strategy",
    date: "Apr 05, 2026",
    read: "8 min",
    accent: "green",
    body: [
      "When I joined DFINITY to own the Internet Computer developer documentation, there wasn't a centralized docs strategy. There were docs – scattered across repositories, wikis, and blog posts – but there wasn't a coherent system for organizing them. Developers would arrive with a specific question, spend time navigating between multiple sources, and often leave without finding what they needed.",
      "The first thing I did was run user studies. Not surveys – actual sit-down sessions where I watched developers try to complete tasks using the docs. The finding that shaped everything that followed wasn't about content quality. It was about navigation. Developers could find *a* page about their topic, but they couldn't find *the* answer on that page. The information architecture was the problem.",
      "We redesigned the entire structure before rewriting a single page. This meant defining a clear taxonomy: conceptual guides, tutorials, reference material, and how-to guides. Each type of document has a different purpose and a different reader. Mixing them together – which is what most docs do by default – creates pages that partially serve everyone and fully serve no one.",
      "Over the next two years, I made roughly 5,000 commits to the docs repository. We built a tutorial series with 36 parts across 6 difficulty levels. We created quickstart guides designed to get developers to their first deploy in minutes. Support ticket volume dropped. Onboarding completion rates improved.",
      "The lesson I keep coming back to is that documentation quality isn't primarily about the writing. It's about the structure. You can have clearly written content that fails developers because it's organized in a way that hides the answer. Information architecture isn't a nice-to-have; it's the foundation that everything else depends on."
    ]
  },
  {
    id: "p3",
    title: "Moving from ICP to Sui: what changes and what doesn't when you switch ecosystems",
    dek: "The technology is different. The documentation problems are the same.",
    tag: "Transition",
    date: "Mar 22, 2026",
    read: "6 min",
    accent: "blue",
    body: [
      "Earlier this year I moved from DFINITY, where I led developer documentation for the Internet Computer, to Mysten Labs, where I now lead the Builder Education team for Sui. The two ecosystems are technically very different – ICP uses canisters and Motoko; Sui uses objects and Move. The programming models, the consensus mechanisms, and the developer tooling have almost nothing in common.",
      "What's the same is the documentation challenge. Developers arrive with varying levels of blockchain experience. They need to understand a new programming model that doesn't map neatly onto what they already know. The conceptual docs have to explain enough context without burying the reader in theory, and the tutorials have to get to a working result fast enough that the developer stays engaged.",
      "Sui's object model is a good example. Move treats everything as an object with defined ownership – this is fundamentally different from the account-based model that Ethereum developers are used to. Explaining this well means meeting developers where they are, not where you wish they were. You have to acknowledge the model they're coming from before you can explain the model they're moving to.",
      "The structural lessons from DFINITY have transferred directly. Start with a quickstart that prioritizes the first successful deploy. Build tutorials that progress through difficulty levels. Separate conceptual content from procedural content. Use the same information architecture principles, even though the underlying technology is completely different."
    ]
  },
  {
    id: "p4",
    title: "How I think about onboarding documentation for a new blockchain",
    dek: "The quickstart isn't the first thing developers read. It's the first thing they do.",
    tag: "Process",
    date: "Mar 08, 2026",
    read: "9 min",
    accent: "green",
    body: [
      "Every blockchain has a conceptual overhead problem. Before a developer can write their first line of code, they need to understand at least some of the underlying model – what a transaction is on this chain, how state is managed, what the deployment process looks like. This is unavoidable. The question is how much of that overhead belongs in the quickstart and how much belongs elsewhere.",
      "My approach has been consistent across both ICP and Sui: the quickstart should contain the absolute minimum context needed to reach a working deploy. Not the minimum to understand the system – the minimum to *use* it. Understanding comes later, through tutorials and conceptual guides. The quickstart's job is to create a successful experience as fast as possible.",
      "This means making hard editorial decisions. At ICP, the quickstart originally included a section on the consensus mechanism. This is interesting and important, but it's not required to deploy a canister. I moved it to a conceptual guide. The quickstart got shorter, and completion rates went up.",
      "At Sui, the same principle applies. A developer doesn't need to fully understand the object model to create their first Move module and deploy it. They need to understand *enough* – what an object is, that objects have owners, that transactions modify objects. The deeper explanation of ownership types, dynamic fields, and capability patterns can come in the tutorial series.",
      "The hardest thing about writing onboarding documentation is resisting the urge to explain everything upfront. Developers don't need a complete mental model before they start building. They need a working mental model that they can refine as they go."
    ]
  },
  {
    id: "p5",
    title: "Writing a second book: what Mastering Web3 Documentation is actually about",
    dek: "There wasn't a resource for technical writers working in Web3. So I wrote one.",
    tag: "Books",
    date: "Feb 15, 2026",
    read: "5 min",
    accent: "blue",
    body: [
      "Mastering Web3 Documentation started as a set of notes I kept for myself while working on the ICP developer docs. I was making decisions about information architecture, content strategy, and documentation workflows that I couldn't find discussed in any existing resource. There are good books about technical writing in general, but nothing that addressed the specific challenges of documenting decentralized protocols.",
      "Web3 documentation has unique constraints. The technology moves fast – protocols ship breaking changes regularly, and documentation has to keep pace. The audience is unusually diverse, ranging from experienced backend developers to people who are entirely new to blockchain. The terminology is often loaded with marketing language that a technical writer has to cut through without alienating the community that uses it.",
      "The book covers the full lifecycle of Web3 documentation: strategy, information architecture, writing, tooling, user research, and maintenance. It draws on case studies from my work at DFINITY and includes the frameworks I developed for structuring developer docs, running user studies, and coordinating documentation with engineering releases.",
      "I self-published both books while working full-time. The process of writing a book forces a kind of synthesis that day-to-day documentation work doesn't require. You can't link to the next page or say 'learn more about X.' Every concept has to be self-contained, and the structure has to hold across hundreds of pages without the reader losing the thread."
    ]
  },
  {
    id: "p6",
    title: "What I mean when I say 'developer education' instead of 'developer docs'",
    dek: "Documentation is part of it. But only part.",
    tag: "Strategy",
    date: "Jan 28, 2026",
    read: "6 min",
    accent: "green",
    body: [
      "At Mysten Labs, my team is called Builder Education, not Developer Documentation. This isn't a rebrand for the sake of it. The distinction reflects a genuine difference in scope. Documentation – reference pages, API guides, configuration details – is one piece of what developers need to be successful on a new platform. But it isn't sufficient on its own.",
      "Developer education includes documentation, but it also includes tutorials, quickstart guides, sample applications, workshop materials, hackathon support, and the overall onboarding experience. Each of these serves a different purpose and reaches developers at a different stage of their journey. A developer browsing the Sui docs for the first time has different needs than a developer midway through building their first application.",
      "The reason this distinction matters is that it changes what you prioritize. A documentation team optimizes for coverage and accuracy. An education team optimizes for developer success – which sometimes means writing less, not more. It means investing in the quickstart before the reference docs. It means running user studies to find out where developers get stuck, not just what content is missing.",
      "The infrastructure behind developer education isn't glamorous. It's style guides, content taxonomies, feedback loops, and release coordination processes. But this operational work is what makes it possible to produce consistent, high-quality content across a growing platform without the whole system depending on any single person's knowledge."
    ]
  }
];

function Journal({ onOpen }) {
  return (
    <section id="journal" className="journal container">
      <div className="journal-head">
        <div>
          <span className="eyebrow">Journal · Recent entries</span>
          <h2>Notes from the <span className="swoosh">field
            <svg viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M2,14 Q50,2 100,10 T198,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
          </span>.</h2>
        </div>
        <p className="journal-sub">
          Writing about docs, Web3, developer education, and the craft of making complex things legible. Posted when there's something worth saying.
        </p>
      </div>

      <ol className="journal-list">
        {JOURNAL_POSTS.map((p, i) => (
          <li key={p.id} className="journal-row" style={{ "--i": i }}>
            <button className="journal-card lift" onClick={() => onOpen(p)}>
              <span className={`j-accent j-accent-${p.accent}`} aria-hidden="true" />
              <div className="j-meta">
                <span className="j-num">№ {String(JOURNAL_POSTS.length - i).padStart(2, "0")}</span>
                <span className="j-tag">{p.tag}</span>
                <span className="j-date">{p.date}</span>
                <span className="j-read">{p.read}</span>
              </div>
              <h3 className="j-title">{p.title}</h3>
              <p className="j-dek">{p.dek}</p>
              <span className="j-cta">Read entry <span className="arrow">→</span></span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── Block rendering ──────────────────────────────────────────────────
//
// A body entry is a paragraph unless it opens with a marker, in which case it
// is a heading, a list item, a table row, a quote or a code block. Entries
// with no marker render exactly as they always did, dropcap and all, so every
// post written before this still looks the way it did.
//
// This exists because the longer pieces have structure -- sections, tables of
// results, a few lines of output -- and flattening 300 blocks into undivided
// paragraphs is not a reading experience.

function inlineMarkup(text, keyBase) {
  // `code`, **bold** and *italic*, in one pass so nesting cannot half-apply.
  const parts = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
  let last = 0, m, n = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${keyBase}-i${n++}`;
    if (tok.startsWith("`")) parts.push(<code key={k}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("**")) parts.push(<strong key={k}>{tok.slice(2, -2)}</strong>);
    else parts.push(<em key={k}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

function splitRow(line) {
  return line.replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
}

function renderBody(body) {
  const out = [];
  let i = 0;
  let firstPara = true;

  while (i < body.length) {
    const b = body[i];

    if (b.startsWith("```")) {
      const code = b.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
      out.push(<pre key={i} className="reader-code"><code>{code}</code></pre>);
      i++;
      continue;
    }

    if (b.startsWith("## ")) {
      out.push(<h2 key={i}>{inlineMarkup(b.slice(3), i)}</h2>);
      i++;
      continue;
    }

    if (b.startsWith("### ")) {
      out.push(<h3 key={i}>{inlineMarkup(b.slice(4), i)}</h3>);
      i++;
      continue;
    }

    if (b.startsWith("> ")) {
      out.push(<blockquote key={i}>{inlineMarkup(b.slice(2), i)}</blockquote>);
      i++;
      continue;
    }

    // Runs of list items and table rows collapse into one element each.
    if (/^(- |\d+\. )/.test(b)) {
      const items = [];
      const ordered = /^\d+\. /.test(b);
      while (i < body.length && /^(- |\d+\. )/.test(body[i])) {
        items.push(body[i].replace(/^(- |\d+\. )/, ""));
        i++;
      }
      const lis = items.map((t, j) => <li key={j}>{inlineMarkup(t, `${i}-${j}`)}</li>);
      out.push(ordered ? <ol key={i}>{lis}</ol> : <ul key={i}>{lis}</ul>);
      continue;
    }

    if (b.startsWith("| ")) {
      const rows = [];
      while (i < body.length && body[i].startsWith("| ")) {
        rows.push(body[i]);
        i++;
      }
      // A separator row of dashes marks the row above it as the header.
      const sep = rows.findIndex(r => /^\|[\s|:-]+\|?$/.test(r));
      const head = sep > 0 ? rows.slice(0, sep).map(splitRow) : [];
      const rest = (sep >= 0 ? rows.slice(sep + 1) : rows).map(splitRow);
      out.push(
        <div key={i} className="reader-table-wrap">
          <table className="reader-table">
            {head.length > 0 && (
              <thead>
                {head.map((r, ri) => (
                  <tr key={ri}>{r.map((c, ci) => <th key={ci}>{inlineMarkup(c, `${i}-h${ri}-${ci}`)}</th>)}</tr>
                ))}
              </thead>
            )}
            <tbody>
              {rest.map((r, ri) => (
                <tr key={ri}>{r.map((c, ci) => <td key={ci}>{inlineMarkup(c, `${i}-b${ri}-${ci}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Plain paragraph. The first one in the piece keeps its dropcap.
    if (firstPara) {
      firstPara = false;
      out.push(
        <p key={i} className="lede">
          <span className="dropcap">{b.charAt(0)}</span>
          {inlineMarkup(b.slice(1), i)}
        </p>
      );
    } else {
      out.push(<p key={i}>{inlineMarkup(b, i)}</p>);
    }
    i++;
  }
  return out;
}

function JournalReader({ post, onClose }) {
  const bodyRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = Math.min(1, Math.max(0, el.scrollTop / (el.scrollHeight - el.clientHeight)));
      setProgress(pct);
    };
    el.addEventListener("scroll", onScroll);
    return () => { el.removeEventListener("scroll", onScroll); };
  }, [post]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="reader-overlay" role="dialog" aria-modal="true">
      <div className="reader-progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="reader-bar">
        <button className="reader-close" onClick={onClose} aria-label="Close">
          <span>✕</span> Close
        </button>
        <div className="reader-bar-title">{post.tag} · {post.date}</div>
        <div className="reader-bar-right">{Math.round(progress * 100)}%</div>
      </div>

      <article className="reader-body" ref={bodyRef}>
        <div className="reader-inner">
          <div className="reader-meta">
            <span className="eyebrow">{post.tag}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.read}</span>
          </div>
          <h1 className="reader-title">{post.title}</h1>
          <p className="reader-dek">{post.dek}</p>
          <div className="asterism"><span>✦</span><span>✦</span><span>✦</span></div>
          <div className="reader-prose">
            {renderBody(post.body)}
          </div>
          <div className="asterism"><span>✦</span><span>✦</span><span>✦</span></div>
          <p className="reader-sig">— J.M.</p>
        </div>
      </article>
    </div>
  );
}

window.Journal = Journal;
window.JournalReader = JournalReader;
window.JOURNAL_POSTS = JOURNAL_POSTS;
