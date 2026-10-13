const { useState, useEffect, useRef } = React;

const JOURNAL_POSTS = [
  {
    id: "p7",
    title: "A documentation-quality system for people and agents: every page, every pipeline, and what each one measures",
    dek: "Forty-one pages, twenty-four jobs, two public boards, and the failures that decided how the numbers are weighed.",
    tag: "Evaluation",
    date: "Oct 13, 2026",
    read: "37 min",
    accent: "blue",
    body: [
      "This is a report on a documentation-quality system I built and run: five documentation sites, two public repositories of agent skill files, twenty-four CI workflows, and a dashboard of forty-one pages that joins everything they produce. It describes the goal, the layout, every page of the dashboard and the pipeline behind it: what each one measures, how it measures it, what tools it uses, what it writes, and what it taught us. Product, vendor and model names are left out on purpose; every figure was read from the code or the committed data on the day of writing.",
      "## The goal",
      "Documentation has two readers: a developer, and the AI agent the developer increasingly works through. The team's job is to make both succeed, and the only direct way to know whether that is happening is to measure it the way those readers experience it: ask the questions they ask, run the tasks they run, read the pages they read, and check whether the pages carry the answers.",
      "The system answers four questions continuously, with the evidence attached to each answer:",
      "1. **Is the documentation correct?** Against the source code it describes, the sibling pages it should agree with, and each page's own declared goal.",
      "2. **Can a model use it?** With the documentation in context, does a model answer developer questions and finish developer tasks it could not without it, and by how much?",
      "3. **Where is the work?** Which pages and gaps, ranked by how many readers they affect and how badly, with the measurement that produced each item sitting next to it.",
      "4. **Did the fixes land?** Which proposed changes became merged pull requests, which were closed, and whether the numbers moved afterwards.",
      "A measurement that cannot be traced to a page a writer can open, or to a change a reviewer can merge, is not kept on the dashboard.",
      "## The shape of the system",
      "**Measurement jobs.** Twenty-four CI workflows, fifteen scheduled and nine dispatch-only. Deterministic checks run nightly and every six hours; model-driven evaluations run on crons from every 48 hours to weekly, each as a matrix of one job per model, and per context layer where a comparison needs one. Every job writes JSON reports into the repository and commits them.",
      "**A data layer in git.** About 350 MB of reports: per-model evaluation results, roughly 1,700 agent transcripts, a findings ledger per site, dated analytics snapshots, a model registry, and dated archives of every run. Committing the data is deliberate: a build on a machine with no access to the pipelines still has the last good numbers, every number has a commit and a date, and a report nobody reads today can still be opened later. The cost is repository growth, covered at the end.",
      "**A prerendered dashboard.** A React application that reads the reports at build time and renders 41 routes, 1,874 prerendered pages in all (one per documentation page, per audit snapshot, per analytics snapshot and site), plus 16 API routes that dispatch workflows, open issues or write to the ledger. Nothing is computed on request. The dashboard sits behind single sign-on; two public leaderboards, one per skill repository, live in the skill repositories and are rebuilt from published score cards.",
      "### The tools underneath",
      "| Tool | Used for |",
      "| --- | --- |",
      "| A CI service with reusable workflows and job matrices | Every pipeline; one reusable workflow carries the shared logic for all model evaluations |",
      "| An agent SDK with a session, a tool loop and a provider catalogue | The harness every model evaluation runs through: one client for two frontier providers and a gateway serving fourteen open-weight models |",
      "| A sandbox with four tools (write file, read file, list files, run command) | The agentic suites: the agent builds real projects and the harness runs the compiler and tests on them |",
      "| A small, fast model as judge at temperature 0 | Grading answers against written expectations in the knowledge, onboarding and A/B suites |",
      "| A deterministic term matcher | The judge's cross-check, and the fallback grader when the judge cannot answer |",
      "| A lexical index over the documentation checkout (headings as the unit, tf-idf with an exact-phrase bonus) | Fact-checking review findings and proposed edits against the documentation at the commit under test, with a verbatim quote required |",
      "| The platform's compilers, test runners and package managers, pinned by version | The code-example validator and the agentic suites' validations |",
      "| A web-analytics API and the documentation assistant's API | The weekly analytics report, page weights, coverage gaps, adoption |",
      "| A third-party documentation-health scorecard CLI | A weekly external score per site, up to 750 links each, with history |",
      "| A static React framework, prerendering from committed JSON | The dashboard |",
      "## The home page",
      "The home page is a control room. Four cards at the top carry the numbers that mean work: open findings awaiting a fix, draft pull requests the pipelines opened and are waiting on a person, pages failing their declared goal, and expectations in the skill evals that contradict the documentation. Below them, every pipeline is listed in four groups (model evaluations, competitive and adoption, analytics and reporting, tools) with its last run and a link to its page. Six legacy routes redirect into the pages that replaced them, so old links keep working.",
      "## Documentation health",
      "### Sites",
      "One card per site and one page per site. The card is a point-in-time health check made at build time: the site is pinged and its status code and response time recorded; its `llms.txt` is fetched and its presence and size recorded; the latest external scorecard score is shown beside the previous one; the style-guide audit's counts are shown; the assistant's question summary for the site is shown; and the content audit's summary (pages, pages with issues, pages with a goal, pages passing it) is shown with its trend across runs. The per-site page adds the analytics trend across every weekly snapshot and the open-fix count from the ledger.",
      "The external scorecard runs with the weekly audit against six site URLs through a third-party CLI that checks up to 750 links per site and reports a scorecard of named checks; checks a site genuinely cannot pass (a documentation site with no release notes, say) are skipped per site, a known-flaky cache-header check is retried up to three times, and the current result is rotated into \"previous\" before the new one is written, so the card can always show the delta.",
      "### Content quality (the audit)",
      "**Measures** what a careful reviewer would say about every page, in three layers plus a model's review.",
      "**Layer one, deterministic base checks** on every page: frontmatter present and well-formed; staleness, from the file's last change in git; broken links and images; code-fence languages; TODOs left in the text; word count; duplicate content. **Layer two, the goal checklist**: each page's frontmatter declares a goal and a list of things the page must do; the audit evaluates each requirement and records pass or fail. **Layer three, the concept map**: where a site carries a concept map, pages are cross-referenced against it. On top of those, an **extractability score** (the \"GEO/AEO\" figure on the dashboard) is computed deterministically from five components: structured frontmatter (the questions the page answers, a one-paragraph answer, description, keywords), question-shaped headings, a direct opening answer, code-to-explanation balance, and link density.",
      "**The model's review.** For every page with a declared goal, a model (a small, fast one in the scheduled run) is given the page and the goal and returns four scores from 0 to 100 with the issues under each: **comprehension** (can a developer understand this without prior context: unexplained jargon, missing prerequisites, flow), **accuracy** (are the API names real, are the code patterns valid for the current language edition, are version-specific claims current), **coverage** (are subtopics, edge cases and the common questions addressed), and **agent readiness** (are commands copy-pasteable, are there input and output examples, is the structure extractable). It also judges whether the page achieves its declared goal.",
      "**Writes** a baseline per site with its previous version kept beside it, an audit history, and a path-health history; it then runs the goal-alignment analysis (below) and a cross-signal correlation that classifies the assistant's question themes from two to four weeks earlier against recent pull-request activity, to ask whether what people were asking about is what got changed.",
      "**Cadence.** Weekly, Monday, for all five sites; on demand for one. **What it taught us.** A reviewer's notes are not all issues, so the dossier drops a note that only praises and keeps one that praises and then qualifies. And volume is not severity: the audit produces 6,755 of the 7,661 action items on the largest site, almost all low or medium; any ranking that counted items would rank by how much the reviewer wrote.",
      "### The correspondence checks, the ledger and the proposer",
      "**Measures** whether each page agrees with the code it documents and with the pages around it. Sixteen check modules, each comparing one kind of claim with its source:",
      "- documented smart-contract function signatures against the framework source, and documented Rust signatures against theirs;",
      "- documented RPC services and methods against the pinned protocol definitions;",
      "- import selectors against the packages as published, installed fresh for the run;",
      "- walkthrough line references against the files they quote;",
      "- CLI flags, HTTP endpoints and SDK types against the current source;",
      "- redirect destinations, frontmatter schema, code-fence languages, MDX components and their links, typos;",
      "- facts a page asserts about the source; whether the skills catalogue a page cites exists; whether a page's migration advice conflicts with another page's; and an \"eval reality\" check comparing what the evaluation suites expect against what the pages say.",
      "**Grades** deterministically and refuses to grade nothing. A check reports how many items it inspected; a check that inspected zero items on a site that should have them is marked **vacuous** and treated as an error, because a check that never ran is indistinguishable from one that found nothing. A site may declare a check optional where it genuinely has no matching content.",
      "**Writes** a findings ledger per site. Each finding carries a rule, a file and line, the current text, a proposed replacement where the check can write one, a tier (A, B or C by how actively misleading the page is, B the most), a confidence, the evidence it was checked against, and a status: `open`, `pr-open`, `fixed`, `rejected` or `dismissed` (the dashboard's dismiss button writes that last one). The ledger persists between runs, so a finding a person closed is never proposed again. As of writing the two ledgers hold 278 and 711 findings, 174 and 645 of them fixed.",
      "**Proposes.** The proposer reads the open findings, verifies each replacement against a fresh checkout, builds the code examples a change touches through the snippet validator (a patch that edits a code block is refused rather than shipped unbuilt), fact-checks any prose claim against the lexical index, and opens one pull request per theme per site, updating it in place on later runs. Two companion jobs feed it: an **upstream monitor** that watches the platform repository's release notes, has a model identify documentation impact in each merged change, and drafts the edits; and a **style-guide audit**, run separately, that polls the documentation repositories for open pull requests touching pages, sends each changed page to a model for review against the team's style-guide skill, and records which pull requests it has audited; the sites page shows its counts.",
      "**Cadence.** Nightly at 06:00 for the full set with proposals; every six hours in drift mode for sites whose upstream source changed since the last successful run. **What it taught us.** The merge rate is the number this pipeline should be judged by, and nothing was showing it. Over the thirty days before this report, on the largest site, the proposer opened 87 pull requests; 26 merged and 61 were closed. By theme: content-quality edits 48 opened, 21 merged; contradictions 9 opened, 1 merged; absolute self-links 9 opened, 0 merged; frontmatter 6 opened, 0 merged. A check can be right about a page and still produce a pull request a reviewer closes. Merge rate per theme is going onto the dashboard; which themes keep proposing is the team's decision.",
      "### Code examples",
      "**Measures** whether the code examples the documentation embeds still build and pass. The validator clones the documentation repositories, discovers 68 examples (31 smart-contract packages, 35 TypeScript projects, two of unknown type) and the inline snippets, and runs each example's steps with pinned toolchain versions recorded in the report: for a contract package, build then test; for a TypeScript project, install with its package manager then build or typecheck. Strict mode: a step that fails fails the example. 110 of 117 steps passed on the last nightly run. Each example records which documentation pages reference it, so a failing example becomes an action item on every page that embeds it.",
      "A companion **snippet pattern scan** reads every inline snippet in the pages and checks it against the deprecated patterns the skills themselves name (an old syntax form, a retired import path), so a page can be flagged for teaching a pattern the skills tell agents to avoid.",
      "### Visitor analytics",
      "**Measures** who reads what, where they leave, and what they asked. A weekly job (ceiling raised to four hours this month after three cancelled runs) pulls, per site, a bundle from the analytics API (top pages with visitors, pageviews, time on page and scroll depth; goals and custom properties; sources, filtered by a referrer allow-list and deny-list) and a bundle from the assistant's API (every thread, reduced to question-and-answer pairs, with the page the reader was on; evaluation traffic recognised and excluded). A model pipeline then classifies the questions in batches into categories and topics, normalises topic names, synthesises a per-site analysis with recommendations, each with a scope, a why-now and an expected impact in one sentence, and fact-checks each recommendation, keeping the note. Journeys yield entry pages and bounce rates; questions per pageview yield coverage gaps.",
      "**Writes** a dated snapshot per run (raw analytics, raw questions, journeys, coverage gaps, the final analysis per site) plus a `latest` copy; the dashboard renders one page per snapshot per site, and the per-site trend. The nightly checks job then builds a **worklist** per site that joins the ledger's findings with the audit's signals and the analytics, resolving each recommendation to a route.",
      "### Content quality signals",
      "A ranked list of documentation improvements backed by converging signals: the assistant's questions by topic (total, distinct topics, how many need attention, the assistant's own confidence), agent failures from the evaluation suites, the analytics report's recommendations, and the content audit's scores. The topics are concrete (\"configuration and dependency setup\", \"object transfer patterns\", \"testing lifecycle\", \"SDK import paths and client migration\"), and each row shows which of the four signals point at it.",
      "### Docs fixes: the per-page dossier",
      "Twelve of the jobs above say something about a specific page, and for a long time each said it on its own page. The dossier joins everything per route and is the dashboard's work queue; the old worklist and writer-queue routes redirect into it.",
      "**Identification.** Every source names a page differently (a content file, a URL, an analytics path, an assistant origin) and all are reduced to one route per site by rules that mirror the worklist's. Files that are not pages get a pseudo-route under a configuration section; include fragments are kept without a URL. A page exists in the join the moment any source names it. Traffic alone does not make a page work.",
      "**Action items.** Each item is a sentence a writer can act on, with its source, a kind, a severity and the evidence that produced it. Severity is set per source by rule, not per item by judgement: an audit accuracy note on a page scoring under 70 is high and above it medium; a clarity or coverage note under 70 is medium, otherwise low; a declared-goal check the page fails is high; a ledger finding is high, medium or low by tier B, A, C; a broken link is medium and a broken anchor low; an orphan is low; an entry page with a 90% bounce and 50 or more entries is high; a page whose readers stop before 40% is medium; an assistant page with at least three questions is high when questions exceed pageviews; a builder-path step rated missing is high and partial medium; a failing embedded example is high; an agent task resolved under half the time is high and under 80% medium. Filtered before an item exists: praise, closed and dismissed findings, dead runs, reviewer findings the fact check contradicted, questions asked from the homepage widget, pages with fewer than three questions, and behaviour on pages with too little traffic to mean anything. Three hundred hardcoded-address hits on one site collapse to one item per page naming the lines.",
      "**Scoring.** A page's score is how much the page matters times how much is wrong with it, with the second part damped:",
      "`score = weight × (1 + ln(1 + Σ severity))`, with high = 1.0, medium = 0.5, low = 0.2",
      "The log is the design decision: forty low notes cannot outrank one wrong signature on a busy path. The weight starts at 1 and is multiplied by every condition that holds, with the constants read at build time from the same file the worklist uses:",
      "| Condition | Multiplier | Threshold |",
      "| --- | --- | --- |",
      "| On a primary reader path | ×1.2 | the site's getting-started, develop and finance sections |",
      "| Failing its declared goal | ×1.5 | the audit's goal check |",
      "| Untouched for a long time | ×1.5 | over 180 days |",
      "| Low extractability | ×1.4 | score under 40 |",
      "| High traffic | ×1.8 | visitors at or above both the site's 90th percentile and 1% of its total |",
      "| Medium traffic | ×1.3 | at or above both the 60th percentile and 0.25% of total |",
      "| Read repeatedly | ×1.2 | pageviews per visitor at or above 1.8 |",
      "| Readers stop early | ×1.3 | average scroll depth under 40% |",
      "| Readers leave the site | ×1.3 | bounce rate at or above 90% |",
      "| Readers ask the assistant | ×1.6 | one or more questions per pageview |",
      "The traffic cuts come from the site's own distribution and a page must clear both a percentile and a share of total traffic: on a site with 500 routes, a median of two visitors and a top page of 800, the 90th percentile alone is 14 visitors. Every multiplier that fires is written into the page's \"why\" list under its title. The top page on the largest site at the last build carried five multipliers (weight 5.05) and two high, five medium and 22 low items (evidence 8.9) for a score of 16.64; the median page scores 3.7.",
      "**The button.** Each dossier page can send its full dossier and the page source to a strong model with the instruction to change only what an item justifies, tracing every edit to an item number; never to invent a fact; to keep frontmatter, imports, components and code fences intact; to apply the ledger's proposed replacements verbatim; to treat reader-behaviour and assistant items as \"readers needed this and did not find it\" and act only when the answer is already on the page; and to prefer the smallest edit. The revision is refused if it is empty, shorter than half or longer than twice the original, missing the frontmatter or any of its fields, missing any import line, or introduces an unbalanced code fence. What passes becomes a draft pull request, updated in place if one is open, whose body is the model's own account read against the dossier: what changed and which items each change addresses, which items were skipped and why, the page's signals, and a link back to the dossier.",
      "### Builder paths",
      "Ten end-to-end developer journeys, each written for an archetype (a finance developer integrating an order book, a payments developer building a consumer app, an agent developer storing and retrieving data, a developer building compliant token systems) and audited by hand into 12 to 26 steps. Each step names the documentation pages and skills a developer would need at that point and rates the documentation's coverage of it as covered, partial or missing; each path carries a score and a list of gaps with a priority, a problem, a solution and the evidence URLs. Three jobs keep the paths honest: a **goal-alignment analysis** that has a model compare every linked page's declared goal against every step across every path and flag pages linked to the wrong step; a link check over every URL the paths cite (last run in September); and a **re-evaluate** API that re-analyses a path with a model and writes newly found gaps back into the path file. The dossier turns partial and missing steps and open gaps into items on the pages they cite.",
      "## Knowledge and skills",
      "### Skills eval results, and the public boards",
      "**Measures** how well a model answers real developer questions, and how much the skill files add. This is the public leaderboard.",
      "**Reads** the suite, assembled at run time from an evals file beside every skill in the public repository: 156 questions for the platform's skills and 42 for the sister product's, each with a prompt and a numbered list of written expectations. Expectations must be sourced to a documentation page; on the platform's suite 155 of 156 are, and the one that is not is recorded as a defect in the suite. Skills are mapped onto four pillars (31, 29, 80 and 16 questions on the platform's suite), uneven because the evals were written per skill and grouped afterwards.",
      "**Runs** every model in the registry in two context layers. **Baseline**: the prompt alone, with read, grep and list tools over a directory containing nothing but a README saying it is intentionally empty (an open-weight model once spent eight tool rounds listing the empty directory until the request outgrew its window). **With skills**: the skill's text in the system prompt and its files on disk for the tools to read. Three attempts per question, a default set this month after a long period at one. A core trio of models runs every 48 hours with the skills; both layers run on Wednesdays; the full registry runs on Sundays.",
      "**Grades** with the judge: each answer against the numbered expectations, a pass or fail and a reason per expectation, by position in the list the judge was sent (it rewords expectations when it echoes them). The term matcher grades alongside; it extracts the identifiers from an expectation (an import path, a class name) and falls back to the expectation's significant words, treats negative expectations (\"does NOT recommend…\") specially, and does not penalise an answer that names a forbidden thing only to warn against it. The two graders' disagreement is printed per run, between about ten and fifty percent on recent runs, mostly the matcher failing what the judge passes. Expectations are counted, not questions.",
      "**Writes** one result file per model per layer, and a **card**: the model, the layer, expectations met per question, the judge, the attempts, the empty answers, the suite fingerprint it was scored against, and its source (pipeline or community). Cards go to the public repository by pull request; the board is a function of the cards plus the skills they were scored against, rebuilt at deploy time. A card scored against an older fingerprint is marked, not ranked; a card covering under 90% of the suite is marked partial, not ranked. Anyone can run the suite on their own model from the runbook in the public repository and submit a self-graded card (shown beside the ranking) or their raw answers, which a maintainer grades with the same judge so the card ranks.",
      "**The number.** A run's score is the mean of its four pillar scores, not the pooled pass rate. The headline the team reads is the **lift**, with skills minus without. On the platform's board as of writing, frontier models score 82 to 97% with the skills and 31 to 70% without; open-weight models 8 to 89% with and 7 to 47% without. On the sister product's board, twenty models score 89% or better with the skills, with lifts from +23 to +82 points.",
      "**What it taught us.** The suite's identity is a fingerprint over eval ids and expectation counts. When every eval was renamed, every published card stopped joining the suite; a matcher that identifies an eval by its expectation text recovered 106 of the 113 ids that no longer resolved, taking the frontier cards from 29% coverage to 97%. Three models score 97% with the skills; the useful signal is the lift and the open-weight tail. Twice in one week a scheduled run went red on a validator inside the public repository after every leg had measured correctly, so the publishing step can no longer fail a run.",
      "### Eval coverage",
      "Where the skill library is weak, and the exact questions that prove it. The page reads the public board's cards and drills from pillar to skill to the individual evals that the most models fail, each with the documentation page it grades against. It replaced two pages that answered the same question at two zoom levels and ended by linking to each other. It is internal on purpose: the public board shows what models get right; this shows what they get wrong, which is a work queue.",
      "### Run history",
      "Every evaluation run writes a dated archive under a per-pipeline history directory, and this page lists them. None survived at first: the artifact upload matched top-level reports only, a one-level glob that never saw the subdirectory, and the collect step flattened what it found. Both are fixed; the archives from before were reconstructed from the newest result file per model, which carries the run's own timestamp.",
      "### Skill gaps",
      "**Measures** which expectations models keep failing, and what edit would fix them. The analyser reads every model's result file for the suite and lists expectations that three or more models fail, grouped by skill, plus clusters of related failures across skills as candidates for new skills. Each failing expectation carries its own verification against the documentation; expectations the documentation contradicts are listed as such and never proposed. For the rest, a proposer has a model draft a small number of anchored edits (insert a section after a line, or replace a line) from the verbatim passages that verified the expectation, extracts every factual claim in the draft, checks each against the documentation, drops any edit with an unsupported claim, and writes the surviving proposals; with a token it opens one draft pull request per skill. The page shows the suggestions, the proposals and whether a pull request exists. A separate **A/B tool** can then run the same eval, model and prompt against the main branch's skill file and the pull request's, several attempts a side, and report the change on the expectations the edit targets.",
      "### Skills format analysis",
      "One experiment, kept as data so the page cannot drift from it: does how a skill is written change what a model does with it? One skill, four rewrites, eight evals, ten attempts each, 56 expectations. No skill at all met 19; the skill as written met 18 at 14,200 tokens of context; a rewrite for salience met 18; a rewrite to a published skill-format guideline met 15 at 1,054 tokens; a worked-example variant is pending. On that skill and that model, format did not help, and the shortest version cost the most. The page says so and leaves the question open.",
      "### Skill routing",
      "**Measures** the thing every other evaluation skips. Every other runner hands the model the correct skill by name; in production the agent sees one description per skill and has to choose, so the description is the product and nothing tested it.",
      "**Runs** every eval prompt (158 cases against 32 descriptions on the last recorded run) through a small router model at temperature 0, given only the catalogue's names and descriptions; the label is the skill that owns the eval. Three catalogues: each repository alone, and both together, because a developer with both installed sees one list and a cross-product collision only shows there. Weekly, one cheap call per prompt.",
      "**Writes** top-1 accuracy and recall at three, the skills never picked for their own prompts, the skills over-picked for prompts they do not own, the confusable pairs, and a row per skill. Then, for each skill the router gets wrong, a strong model drafts a replacement description from the prompts it lost, the description that won them and the skill's own body; the router is re-run on the affected prompts; and the result is recorded with before and after for both skills, kept only when the skill routes better and its rival no worse. Nothing is applied; a person opens the pull request. Last recorded run: 75% top-1, 92% recall at three, two skills losing their own prompts to a broader neighbour three times each.",
      "### The authoring tools",
      "Two interactive pages, moving to their own repository with the A/B tool. **Test a skill**: paste a skill file and its evals, pick models, and see every expectation with and without the skill, three attempts a side, graded by the same judge. **Generate a skill from a page**: the baseline is measured before anything is written, because a skill teaching what the model already knows costs context on every request and returns nothing (a strong model answers 64.5% of the published suite with no skills at all); the generator may answer \"no skill needed\" and stop, and that is a successful run; a third of the questions are held back and scored once at the end, because editing a skill until its own evals pass always converges and nothing inside the loop can tell that from a skill that learned the subject.",
      "## Agents",
      "### End-to-end integration testing",
      "**Measures** whether an agent can complete a real development task in a sandbox, and what it got wrong.",
      "**Reads** 17 task definitions in the general corpus (scenario testing, capability patterns, derived objects, integrating a privacy service, an enclave, an indexer, a marketplace, a coin treasury, a flash loan, display metadata, modern syntax, transfer policies, event listeners, mixed-fund balances, an RPC migration, a package upgrade, failing tests) and 22 in a finance corpus (building protocols from scratch, integrating existing ones, quantitative strategies, cross-venue, risk management, structured products). Each task has a prompt, the documentation pages it is built from, a rubric with common and task-specific criteria, and mechanical validations: a file exists; a file contains these patterns and not those; a dependency is pinned to something current rather than whatever the model remembers; a command succeeds (the compiler, the test suite); a linter passes; and, in the finance corpus, a placeholder rejection that fails any file containing the words a model writes when it does not know the answer.",
      "**Runs** the agent in a sandbox with four tools: write a file, read a file, list files, run a command. Three modes. **Baseline**: four turns, prompt only. **With skills**: four turns, skills loaded. **Oracle**: eight turns, skills loaded, with a second model watching every turn: when the validation score has not improved since the previous turn it drafts a hint from the errors, the skills and the baseline run's transcript, and injects it as the next turn's message. After the task, the same model reviews the produced code against the documentation and classifies each finding as a **skill gap** (the correct pattern is in no skill), **skill unclear** (it is in a skill and the agent still got it wrong), a **deprecated pattern**, or **matches the documentation**; for actionable findings it drafts a tooling recommendation. For every finding, two further sessions replay the stalled turn with the toolchain's output rewritten, to say which surface should have carried the answer, the compiler or CLI message or a skill. The three phases run in one process per task so they share a day, a turn budget and a version of the checks.",
      "**Grades** the task by the validations, mechanically; the code by the reviewer; and then **fact-checks the reviewer** in the commit job, every finding's claim about the documentation against the lexical index at the commit under test, with a verbatim quote required. The hints are not checked before injection: that check depended on the hosted retrieval that is switched off and failed open, so it was removed rather than left to report \"verified\" for every hint, and each hint is recorded as unverified. Across 586 oracle transcripts the oracle intervened with a hint 449 times and recorded 2,648 review findings; 835 counterfactual replays exist across 282 of them.",
      "**Writes** one transcript per task, model and mode, with a validation fingerprint (a hash of every check's type, path, sorted patterns and gate flag, so two runs scored against different check lists cannot be compared silently), tool-call counts per tool, the review with its verdicts, and the replays. The **testing page** shows baseline versus with-skills versus oracle per model; the **task page** shows the baseline and oracle runs side by side, the best run with and without the oracle, the oracle's impact by model, the checks that fail across the most runs, and the tooling recommendations; a **compare page** sets models against each other; a **per-model page** lists resolve rates per mode, the review findings, and the anti-patterns that model uses.",
      "**What it taught us.** A run in which the agent never called a tool is not a failed attempt; it is no attempt, marked `didNotRun`, excluded from every rate and counted out loud. Across the roughly 1,740 transcripts on file, a quarter are dead runs: a provider on a free-tier key, a gateway that mangles one model's tool calls, and stalls. Four frontier models resolve every task in every mode; the skills' effect shows on the middle tier (one model from 1 of 6 tasks to 3, another from 3 to 5). The finance corpus had not completed a run since September, its batches cancelled at the job ceiling every time; it was re-batched this month into eight jobs of three tasks.",
      "### Oracle insights",
      "The reviewer's findings as a work queue for the documentation team, in seven sections: what the oracle did (hints given, reviews written, by task and model); where the gaps are; gaps found in review; findings where the skills already say the thing the agent missed (a reading problem, not a writing problem); a priority list; which tasks need the most help; and agent behaviour, mistakes that do not indicate missing documentation and are filtered out of the actionable counts. Dead and stalled runs are excluded and counted on the page. Findings carry their fact-check verdict; verified findings lead, contradicted ones are dropped from the actionable lists, and unchecked ones are shown as unchecked. The most recent fact-check pass over 300 distinct claims found 15 verified, 113 contradicted by the documentation and 172 not found in it: most of what the reviewer reports as a documentation gap, the documentation either contradicts or never mentions.",
      "## Readers and the market",
      "### Onboarding",
      "**Measures** how a model answers the open-ended questions a developer actually arrives with: 89 prompts across thirteen categories, from complete beginner and migrating from another ecosystem to error triage, node operation, protocol architecture and transaction ordering. Eight prompts are in Chinese, Japanese or Vietnamese, because a quarter of the documentation's traffic is not in English and a model answering a node-operator question in the wrong language is a failure the English prompts cannot see.",
      "**Ran, originally,** two layers: the prompt alone, and every skill file concatenated into the system prompt. **That design measured the wrong thing.** On the first full judged run the prompt alone was the better layer on 58 of 89 questions and the all-skills layer on 31. Thirty-one skill files in one system prompt is what that does to an answer, and no agent in production loads a catalogue that way. Two earlier layers that put a hosted documentation search in front of the model were retired when retrieval was switched off; on every model tried they had moved the score by less than the noise floor.",
      "**Runs, now,** three layers. **Baseline**: the prompt alone. **Routed**: the routing eval's small model reads the catalogue of skill names and descriptions, picks up to three, and those skill files are loaded. **Oracle**: the skill that owns the question, by label, loaded alone. Sixty-six prompts own a skill and 23 own none; for those the oracle layer is the baseline answer and the record says so rather than paying for an identical second call. Routed minus baseline is what the skills are worth in production; oracle minus routed is what routing costs. Labels were written by rules (a rule per category, a rule per trigger term) with a model check available, resolving each skill's catalogue name from its directory because two skills name themselves differently from their folders. Three attempts per layer; the judge grades every answer; the score is the mean of per-category pass rates, with a coverage gate below which a run is listed but not ranked. The page shows the three layers per model, the two gaps, and per-category movement, with a note that a lift under about two points is inside the rerun noise.",
      "**What it taught us, so far.** The first run under the new design, one model: baseline 74.3%, routed 73.3%, oracle 73.8%, with 95% intervals of about ±4 points, so all three overlap. The router loaded the owning skill (or correctly loaded nothing) on 58 of 89 prompts. For that model on this suite, even the right skill does not move the answer; the full frontier run will say whether that holds.",
      "### Unbranded prompts",
      "**Measures** what a model says about the platform when nothing about the platform is in front of it. Seventy-nine prompts in fifteen categories (choosing a chain or stack, highest throughput, gaming, consumer onboarding, finance and payments, storage and data, agentic and AI, technical primitives, and three builder personas: new to the space, experienced, and finance-driven \"vibecoders\"), sent with no skills, no platform context and no system-prompt bias.",
      "**Grades** by detection, not judgement: a table of ecosystem names with regular-expression aliases (and exclusions, so the word for a layer-two network does not match \"base class\" or \"base64\") records every ecosystem each answer mentions; a second pass finds the answer's **primary recommendation** by, in order, an explicit recommendation phrase (\"I'd go with…\", \"the best … is …\"), a top-recommendation heading, a medal emoji heading, and falls back to null when none applies. The result per prompt is the ecosystems mentioned, whether the platform was among them, the primary recommendation, the answer's length and time, and the sources it cited. No pass or fail; the page shows, per model, the share of answers that mention the platform and the share that recommend it first, and the full distribution of primary recommendations. On one frontier model's last run: mentioned in 56% of answers, recommended first in 33%, tied for first with one other ecosystem.",
      "**Cadence.** Weekly, three attempts per prompt since this month. **Reading it.** This is the only pipeline whose number the documentation cannot move directly; it is a measure of what the models absorbed from everywhere, and it is here so the team can see whether that moves over months.",
      "### Competitive analysis",
      "**Measures** two things. **Phase one, the prompt benchmark**: the same ten task prompts are sent three times, each framed for a different ecosystem (ours and two others), and each answer is scored deterministically on length, number of code blocks, number of source citations, hedging phrases, and whether it contains a complete example (at least one code block with both an import and a main-logic construct). The page compares the three ecosystems per task and in aggregate. **Phase two, the extractability comparison**: a fixed list of topics is mapped to a documentation page on each ecosystem's site; each page is fetched and scored, with no model involved, on depth (word count bands), structure (question-shaped headings), code presence, direct answer and citability, combined with fixed weights into the same kind of extractability figure the audit computes for our pages. Weekly.",
      "### Agent adoption",
      "Two weekly trackers. **Skill installs**: a public skills registry exposes install counts per skill; the tracker snapshots every one of ours and appends to a history file, so the page shows installs per skill and the trend. **Assistant usage by channel**: the assistant's API reports how many queries arrive through its agent-protocol integration versus other channels; the tracker records the share, so the team can see whether agents, as opposed to people in a browser, are the growing reader.",
      "## The harness and the model registry",
      "Every model evaluation goes through one harness over one agent SDK, so a comparison across providers is a comparison of models and not of client code. The harness owns: thinking-level selection per model from the provider catalogue; a retry when a reasoning model returns a turn with thinking and no text; a request rewriter for a gateway that rejects the SDK's content-array format and its null content on tool-call turns (nine of fourteen open-weight models looked silent until that was found); a record of the last gateway rejection so an empty answer can be attributed to the request that caused it; and a silence watchdog that aborts a turn after five minutes with no event, because a hung model otherwise ran to the job ceiling.",
      "The model matrix is a registry file refreshed nightly from the provider catalogue. New members of model families already measured are adopted and run that night; retirements are manual and listed. A model can declare `tools: false` with a reason; one open-weight model's tool calls arrive from the gateway as JSON inside the reasoning text with a normal stop reason, so it is measured without tools where the skill text is in the prompt regardless, and left out of the agentic suites, which cannot run without them.",
      "## Retrieval, and why it is off",
      "The system once used a hosted documentation search as a retrieval layer: two context layers in the onboarding and knowledge suites, the oracle's hint check, the reviewer's source of documentation, and the fact check that gated proposed skill edits. The plan allowed 3,000 searches a month. On one day the pipelines made over 30,000, from an uncapped loop, and the first anyone knew of it was a $15,000 overage.",
      "Retrieval is now off at every call site. The two layers are retired and refused if requested rather than silently emptied; the month's count is checked daily and gates every run; and each consumer has a replacement that needs no search service. The reviewer and the ledger's fact check read the lexical index built from the documentation checkout at the commit under test; the skill-edit proposer accepts only expectations the documentation already verified; the hint check is out until it can be rebuilt on the same index. The comparison the retrieval layers existed to make had come back null on every model tried, so what was lost was a cost.",
      "## Designing the dashboard",
      "A few rules held across every page, and each came from a page that broke it.",
      "**Remove, don't explain.** A confusing number is deleted, not justified with a longer caption. The onboarding page's two retired layers are gone, with one sentence saying why.",
      "**Mark, don't delete.** A run that answered most of a suite is excluded from ranking and fully usable for everything else. A card scored against an older suite is shown as against an older set. A dead run is counted, out loud, as dead. Partial is a label.",
      "**Provenance with every number.** Who graded it, which suite fingerprint, when, how many attempts, how many empty answers, which ids were recovered, pipeline or community. When a rename invalidated the board, provenance is what let the cards be recovered instead of discarded.",
      "**Show the evidence, not the verdict.** A reader cannot act on \"failed.\" They can act on the judge's reason next to what the model said, the assistant's actual questions next to the page, the compiler's output next to the example that failed.",
      "**Plain labels, full URLs, no tiny text.** The audience includes people who do not run the pipelines. Each source on the dossier has a one-sentence description of what it is; a model is named by its label, not its gateway path.",
      "**Prerender everything.** Every page is built from committed data, which makes it fast, auditable and deployable without credentials. The cost is freshness: a finding closed this morning shows until the next push rebuilds, and every page says when it was generated. Several pages were once rendered per request against a filesystem the deployed function did not have, and rendered an empty shell in production while rendering fine locally.",
      "**Publishing never fails a measurement.** The step that rebuilds a public board, pushes cards or opens a pull request may fail with a warning. The step that commits results always runs.",
      "**A degraded run does not replace a measurement.** Before the commit job stages a result file, it compares it with the committed one; where the new run errored on more than a third of its questions and the old one did not, the old file stays, and the degraded report remains in the run's artifacts and dated archive.",
      "## What it costs, and what broke",
      "Over the thirty days before this report: about a thousand workflow runs. The oracle suite was the most expensive at roughly 6,100 wall-minutes, with a median run of 204 minutes and a longest of 1,379; the knowledge suite about 4,400 across 76 runs, most of them manual dispatches during a week of fixes; the onboarding suite about 1,100, with single legs over five hours on the slowest open-weight models. Half of all runs in the window were one job, since deleted, that fired hourly and failed every time on a missing integration that nothing alerted on. The failures that cost the most time were in the plumbing, not in the models.",
      "**A dead provider on every matrix.** One provider's key was free-tier, twenty requests a day per model. Its three models returned empty answers on every leg for weeks, discarded by the guards each time, and spent six legs per run doing it. They are out of the registry, which only adopts families already present, so they stay out unless someone adds one back deliberately.",
      "**A gateway that leaks tool calls.** One open-weight model's tool calls came back as trailing JSON inside the reasoning text with a normal stop reason and no tool-call array; the harness saw a thinking-only turn and an empty answer, 290 turns in a row across two legs, while the larger model of the same family on the same gateway used tools on 75 of 84 turns and scored 96%. Diagnosed from a wire capture of one request and response; fixed in the registry.",
      "**Context overflow retried as a throttle.** A model with a small window spent eight tool rounds listing the empty baseline directory until the request no longer fit, and the retry loop re-asked a deterministic 400 three times per question, 34 retries on one leg. The gateway's error body was cut at 600 characters, before the sentence that named the limit. The full body is now recorded, a context-length 4xx is never retried and is counted separately, and the empty directory carries a README.",
      "**A rate-limit storm overwrote a measurement.** One model's run met 429s on 155 of 156 questions (465 empty answers, 935 retries), exited 0 as designed, and the commit job wrote it as the model's result; the board carried a card covering one question. Hence the guard above.",
      "**The judge choked on a glob.** Asked whether an answer mentioned `*` and `**/*` patterns, the judge quoted them back with a Markdown escape that is not a JSON escape, the parser rejected the whole array, and the same eval was ungraded on twelve models. One repair of the escapes before retrying the parse.",
      "**One sample is not a census.** Every comparison was published at one attempt per question for months. Three is now the floor everywhere, and the agentic suites were re-batched into single-task jobs so three attempts fit under the six-hour job ceiling.",
      "**A publishing step turned measurements red,** twice in one week, on a check inside the public repository's own validators after every leg had measured correctly. The board step may now fail.",
      "**A debugging run was committed as data.** A one-skill run dispatched to capture a wire log went through the normal results path and replaced a 156-question result with a two-question one. Reverted the same hour; a wire-logged run can no longer commit.",
      "**A prompt said `undefined` for months.** The finance corpus's tasks carried no field the prompt builder expected, and the builder interpolated it unconditionally, so every one of 22 tasks told the model its task was the literal word `undefined`. The prompt is now recorded in the report; a field nothing reads is a field that is wrong.",
      "**Build output was tracked.** A trace file from the build was committed and showed as modified on every status check, for months.",
      "## What it is worth",
      "Against the cost: a knowledge suite with a stated noise floor and every model measured on identical questions through one pipeline; two public boards anyone can reproduce from the published cards; an onboarding suite that measures the thing an agent actually does; a routing eval that measures the one artifact nothing else tested, with measured rewrites waiting for a reviewer; agentic suites with dead runs marked and the reviewer's findings fact-checked against the documentation; a content audit, a code-example validator and sixteen correspondence checks running nightly across the sites; two ledgers with 819 findings fixed; weekly analytics and assistant questions joined to the pages they are about; and a per-page dossier that turns twelve measurements into one ranked list of work with the evidence attached.",
      "The system tells the team which parts of the documentation models cannot use, which pages readers abandon, what readers ask that the pages do not answer, which proposed fixes reviewers accept, and whether the figures move when the documentation changes. What is next, in order: a page about the jobs themselves (last run, success rate, minutes, last data commit, pages fed), because every failure in the previous section was invisible until that view was assembled by hand; concurrency groups so three matrices stop queuing each other for hours; moving the raw analytics snapshots, about 10 MB a day, out of git with a retention policy; and finishing the move of the three authoring tools to their own repository, which has its own continuous integration as of this week.",
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
