const { useState, useEffect, useRef } = React;

const JOURNAL_POSTS = [
  {
    id: "p7",
    title: "A documentation-quality system for people and agents: design, pipelines, and what it measures",
    dek: "Twelve measurements, one ranked list of work, and the failures that decided how the numbers are weighed.",
    tag: "Evaluation",
    date: "Oct 13, 2026",
    read: "30 min",
    accent: "blue",
    body: [
      "This is a report on a documentation-quality system I built and run: five documentation sites, two public repositories of agent skill files, about two dozen scheduled measurement jobs, and a dashboard that joins everything they produce into one ranked list of work. It covers what the system is for, how it is laid out, what each job measures and how it grades, how results are weighted and joined, and the design decisions and failures that shaped them. Product, vendor and model names are left out on purpose; every figure below was read from the code or the committed data on the day of writing.",
      "## The goal",
      "Documentation has two readers: a developer, and the AI agent the developer increasingly works through. The team's job is to make both succeed, and the only direct way to know whether that is happening is to measure it the way those readers experience it: ask the questions they ask, run the tasks they run, and check whether the pages carry the answers.",
      "The system is built to answer four questions continuously, with the evidence attached to each answer:",
      "1. **Is the documentation correct?** Checked against the source code it describes, the sibling pages it should agree with, and each page's own declared goal.",
      "2. **Can a model use it?** With the documentation in context, does a model answer developer questions and finish developer tasks it could not without it, and by how much?",
      "3. **Where is the work?** Which pages, which gaps, ranked by how many readers they affect and how badly, with the measurement that produced each item sitting next to it.",
      "4. **Did the fixes land?** Which proposed changes became merged pull requests, which were closed, and whether the numbers moved afterwards.",
      "A measurement that cannot be traced to a page a writer can open, or to a change a reviewer can merge, is not kept on the dashboard.",
      "## The shape of the system",
      "Three layers, in one private repository plus two public ones.",
      "**Measurement jobs.** Twenty-four CI workflows, fifteen on a schedule and nine dispatch-only. Deterministic checks run nightly and every six hours; model-driven evaluations run on crons from every 48 hours to weekly, each as a matrix of one job per model (and per context layer where a comparison needs one). Every job writes JSON reports into the repository and commits them.",
      "**A data layer in git.** About 350 MB of reports: per-model evaluation results, roughly 1,700 agent transcripts, a findings ledger per site, weekly analytics snapshots, a model registry. Committing the data is deliberate. A build on a machine with no access to the pipelines still has the last good numbers; every number has a commit and a date; and a report nobody reads today is still a report someone can open later. The cost is repository growth, discussed at the end.",
      "**A prerendered dashboard.** A React application that reads the reports at build time and renders 41 routes, 1,874 prerendered pages in all (one per documentation page, per audit snapshot, per analytics snapshot and site), plus 16 API routes that dispatch workflows, open issues or write to the ledger. The dashboard sits behind single sign-on. Two public leaderboards, one per skill repository, live in the skill repositories themselves and are rebuilt from published score cards.",
      "The flow runs one way: documentation, code and reader behaviour go in; reports come out; the dashboard joins and ranks them; a person, or a bounded automated proposer, turns the top of the ranking into pull requests; the next run measures whether that helped.",
      "### Inputs",
      "| Input | What it is | Where it enters |",
      "| --- | --- | --- |",
      "| Documentation content | Five sites across two documentation repositories, MDX pages with frontmatter | The checks (two sites), the content audit (five), the dossier (two), the fix proposers |",
      "| Source code | The platform's repositories: smart-contract framework, protocol definitions, SDKs, CLI, published packages | The correspondence checks |",
      "| Skills | Two public repositories of agent skill files (31 and 12 skills), each skill carrying an evals file of prompts and written expectations | Every model evaluation, the routing eval, the public boards |",
      "| Web analytics | Visitors, pageviews, time on page and scroll depth per route; entry pages and bounce from journeys | Page weights, reader-behaviour items, the weekly report |",
      "| Assistant export | Every question asked through the documentation assistant, with the page the reader was on | Chatbot items, coverage gaps |",
      "| Models | Two frontier providers and an AI gateway serving fourteen open-weight models, 25 models in the registry, all through one agent harness | The models under test, the judge, the oracle, the reviewer, the proposers |",
      "## The pipelines",
      "Each pipeline is described the same way: what it measures, what it reads, how it grades, what it writes, how often, and what it taught us. The order is from the most deterministic to the most model-dependent, which is also the order in which I trust the numbers.",
      "### 1. Correspondence checks and the findings ledger",
      "**Measures** whether each page agrees with the code it documents and the pages around it. Sixteen check modules, each comparing one kind of claim with its source: documented smart-contract function signatures against the framework source; documented RPC services against the pinned protocol definitions; documented Rust signatures against the source; import selectors against the published packages; walkthrough line references against the files they quote; CLI flags; HTTP endpoints; SDK types; redirect destinations; frontmatter schema; code-fence languages; MDX components and their links; typos; facts asserted about the source; whether the skills catalogue the page cites exists; whether a page's migration advice conflicts with another page's; and an \"eval reality\" check that compares what the evaluation suites expect against what the pages say.",
      "**Reads** the documentation repositories and the code repositories at their current commits, with the SDK packages installed fresh so a claim about a package is checked against what is actually published.",
      "**Grades** deterministically, and refuses to grade nothing. A check reports how many items it inspected. A check that inspected zero items on a site that should have them is marked **vacuous** and treated as an error, because a check that never ran is indistinguishable from a check that found nothing. A site can declare a check optional where it genuinely has no matching content (the sister product's site has no protocol-definition pages, so that check is optional there).",
      "**Writes** a findings ledger per site. Each finding carries a rule, a file and line, the current text, a proposed replacement where the check can write one, a tier (A, B or C: how actively misleading the page is, with B the most), a confidence, the evidence it was checked against, and a status: `open`, `pr-open`, `fixed`, `rejected` or `dismissed`. The ledger persists between runs, so a finding a person closed is never proposed again. As of writing the two ledgers hold 278 and 711 findings; 174 and 645 are fixed.",
      "**Proposes.** A proposer reads the open findings, verifies each proposed replacement against a fresh checkout, builds the code examples a change touches through the snippet validator (a patch that edits a code block is refused rather than shipped unbuilt), fact-checks any prose claim against a local index of the documentation, and opens one pull request per theme per site, updating it in place on later runs rather than opening a second. A separate upstream path turns merged pull requests in the code repositories into the documentation edits they imply.",
      "**Cadence.** Nightly at 06:00 for the full set with proposals; every six hours in drift mode (did the upstream code change under a page since the last successful run?) for sites whose source changed.",
      "**What it taught us.** The merge rate is the number the pipeline should be judged by, and nothing was showing it. Over the thirty days before this report, on the largest site, the proposer opened 87 pull requests; 26 merged and 61 were closed. By theme: content-quality edits 48 opened, 21 merged; contradictions 9 opened, 1 merged; absolute self-links 9 opened, 0 merged; frontmatter 6 opened, 0 merged. On the sister product's site, 18 opened, 6 merged. One closed pull request was titled \"consolidate nine overlapping docs-fix pull requests.\" A check can be correct about a page and still produce a pull request a reviewer closes. Merge rate per theme is going onto the dashboard; which themes keep proposing is a decision for the team.",
      "### 2. The content audit",
      "**Measures** what a careful reviewer would say about each page. A small, fast model reads every page against the page's declared goal and scores four dimensions from 0 to 100: accuracy, comprehension, coverage and agent readiness. It writes the issues it sees under each, checks the page's declared acceptance criteria one by one, and scores an extractability measure built from five components: structured frontmatter (the questions the page answers, a one-paragraph answer, description, keywords), question-shaped headings, a direct opening answer, code-to-explanation balance, and link density.",
      "**Reads** every page of each of the five sites at a named commit. The references section and include fragments are excluded.",
      "**Writes** a baseline per site, kept beside its previous version so the dashboard can show movement, and feeds the correspondence checks' goal check.",
      "**Cadence.** Weekly, Monday, plus on demand for a single site.",
      "**What it taught us.** A reviewer's notes are not all issues. The model lists confirmations (\"the key sizes are accurate for the specified algorithms\") in the same list as problems, so the dossier drops any note that only praises and keeps one that praises and then qualifies. Volume is also not severity: the audit produces 6,755 of the 7,661 action items on the largest site, almost all of them low or medium, and any ranking that counted items would be ranking by how much the reviewer wrote. The dossier's scoring was designed around that.",
      "### 3. The knowledge suite and the public boards",
      "**Measures** how well a model answers real developer questions, and how much the skill files add. This is the public leaderboard.",
      "**Reads** the suite, assembled at run time from an evals file beside every skill in the public repository: 156 questions for the platform's skills, 42 for the sister product's, each with a prompt and a numbered list of written expectations. Expectations must be sourced to a documentation page; on the platform's suite 155 of 156 are, and the one that is not is recorded as a defect in the suite. The skills are mapped onto four pillars (31, 29, 80 and 16 questions on the platform's suite), uneven because the evals were written per skill and grouped afterwards.",
      "**Runs** every model in the registry in two context layers. **Baseline**: the prompt alone, with read, grep and list tools over a directory containing nothing but a README saying it is intentionally empty. **With skills**: the skill's text in the system prompt and its files on disk for the tools to read. Three attempts per question, a default set this month after a long period at one. A core trio of models runs every 48 hours with the skills; both layers run on Wednesdays; the full registry runs on Sundays.",
      "**Grades** with a small, fast model as judge at temperature 0, reading each answer against the numbered expectations and returning a pass or fail and a reason for each; grading is by position in the list the judge was sent, because the judge rewords expectations when it echoes them. A deterministic term matcher grades alongside, and the two graders' disagreement rate is printed per run (between about ten and fifty percent on recent runs, mostly the matcher failing what the judge passes). Expectations are counted, not questions: a model that meets five of six expectations is not the same as one that meets none.",
      "**Writes** one result file per model per layer, and a **card**: the publishable part of a run. A card holds the model, the layer, how many expectations were met on each question, the judge, the number of attempts, the number of empty answers, the suite fingerprint it was scored against, and its source (the pipeline, or a community submission). Cards go to the public repository by pull request; the board is a function of the cards plus the skills they were scored against, rebuilt at deploy time, never served from a committed copy. A card scored against an older fingerprint is marked as against an older set, not ranked. A card covering under 90% of the suite is marked partial, not ranked. Anyone can run the suite on their own model from the runbook in the public repository and submit either a graded card (labelled self-graded, shown beside the ranking) or their raw answers, which a maintainer grades with the same judge so the card ranks.",
      "**The number.** A run's score is the mean of its four pillar scores, not the pooled pass rate, so the largest pillar cannot decide the figure. The headline the team reads is the **lift**: with skills minus without. On the platform's board as of writing, frontier models score 82 to 97% with the skills and 31 to 70% without; open-weight models score 8 to 89% with the skills and 7 to 47% without. On the sister product's board, twenty models score 89% or better with the skills, with lifts from +23 to +82 points.",
      "**What it taught us.** The suite's identity is a fingerprint over eval ids and expectation counts. When every eval was renamed, every published card stopped joining the suite, and a matcher that identifies an eval by its expectation text rather than its id recovered 106 of the 113 ids that no longer resolved, taking the frontier cards from 29% coverage to 97%. The top of the board is close to a ceiling: three models score 97% with the skills. The useful signal there is the lift and the open-weight tail, where the suite still spreads models from 8% to 89%. A scheduled run went red twice in one week on a validator inside the public repository while every leg had measured correctly, so the step that publishes can no longer fail a run.",
      "### 4. The onboarding suite",
      "**Measures** how a model answers the open-ended questions a developer actually arrives with: 89 prompts across thirteen categories, from complete beginner and migrating from another ecosystem to error triage, node operation, protocol architecture and transaction ordering. Eight prompts are in Chinese, Japanese or Vietnamese, because a quarter of the documentation's traffic is not in English and a model answering a node-operator question in the wrong language is a failure the English prompts cannot see.",
      "**Ran, originally,** two layers: the prompt alone, and every skill file concatenated into the system prompt. **That design measured the wrong thing.** On the first full run with a judge, the prompt alone was the better layer on 58 of 89 questions and the all-skills layer on 31. Thirty-one skill files in one system prompt is what that does to an answer, and no agent in production loads a catalogue that way.",
      "**Runs, now,** three layers. **Baseline**: the prompt alone. **Routed**: a small model reads the catalogue of skill names and descriptions, exactly what a production agent sees, picks up to three, and those skill files are loaded. **Oracle**: the skill that owns the question, by label, loaded alone. Sixty-six prompts own a skill and 23 own none; for those the oracle layer is the baseline answer and the record says so rather than paying for a second identical call. Routed minus baseline is what the skills are worth in production; oracle minus routed is what routing costs. Labels were written by rules (a rule per category, a rule per trigger term) with a model check available, and the owning skill's catalogue name is resolved from its directory because two skills name themselves differently from their folders. Three attempts per layer; the score is the mean of per-category pass rates, with a coverage gate below which a run is listed but not ranked.",
      "**What it taught us, so far.** The first run under the new design, one model: baseline 74.3%, routed 73.3%, oracle 73.8%, with 95% intervals of about ±4 points, so all three overlap. The router loaded the owning skill (or correctly loaded nothing) on 58 of 89 prompts. For that model on this suite, even the right skill does not move the answer; that is a finding about the suite or the skills rather than about routing, and the full frontier run will say whether it holds across models.",
      "### 5. The routing eval",
      "**Measures** the thing every other evaluation skips. Every other runner hands the model the correct skill by name. In production the agent sees one description per skill and has to choose, so the frontmatter description is the product, and nothing tested it.",
      "**Runs** every eval prompt in the suite (158 cases against 32 skill descriptions on the last recorded run) through a small router model at temperature 0; the label is the skill that owns the eval. Three catalogues: each repository alone, and both together, because a developer with both installed sees one list, and a prompt from one product routing to a skill from the other is a collision only the combined list can show. Weekly, one cheap call per prompt.",
      "**Writes** top-1 accuracy (the owning skill was the first choice) and recall at three (it was among the three loaded), the skills never picked for their own prompts, the skills over-picked for prompts they do not own, the confusable pairs, and a row per skill. Then a second pass: for each skill the router gets wrong, a strong model drafts a replacement description from the prompts the skill lost, the description that won them, and the skill's own body (so it claims nothing the skill does not teach); the router is re-run on the affected prompts; and the result is recorded with before and after for both skills, kept only when the skill routes better and its rival no worse. Nothing is applied; a person opens the pull request. Last recorded run: 75% top-1, 92% recall at three, two skills losing their own prompts to a broader neighbour three times each.",
      "### 6. The agentic suites",
      "**Measures** whether an agent can complete a real development task in a sandbox, and what it got wrong.",
      "**Reads** task definitions: 17 tasks in the general corpus (scenario testing, capability patterns, derived objects, integrating a privacy service, an enclave, an indexer, a marketplace, a coin treasury, a flash loan, display metadata, modern syntax, transfer policies, event listeners, mixed-fund balances, an RPC migration, a package upgrade, failing tests) and 22 in a finance-specific corpus (building protocols from scratch, integrating existing ones, quantitative strategies, cross-venue, risk management, structured products). Each task has a prompt, the documentation pages it is built from, a rubric, and mechanical validations of five or six types: a file exists; a file contains these patterns and not those; a dependency is pinned to something current; a command succeeds (the compiler, the test suite); a linter passes; and, in the finance corpus, a placeholder rejection that fails any file containing the words a model writes when it does not know the answer.",
      "**Runs** three modes. **Baseline**: four turns, prompt only. **With skills**: four turns, skills loaded. **Oracle**: eight turns, skills loaded, with a second model watching every turn; when the agent's validation score has not improved it drafts a hint from the errors, the skills and the baseline run's transcript, and injects it as the next turn's message. After the task, the same model reviews the produced code against the documentation and classifies each finding as a skill gap (the correct pattern is not in any skill), a skill-unclear (it is in a skill and the agent still got it wrong), a deprecated pattern, or matches the documentation. For every finding, two further sessions replay the stalled turn with the toolchain's output rewritten, to say which surface should have carried the answer: the compiler or CLI message, or a skill. The oracle, with-skills and baseline phases run in one process per task so that they share a day, a turn budget and a version of the checks.",
      "**Grades** the task mechanically, by the validations; grades the code by the reviewer; and then **fact-checks the reviewer**. In the commit job, every review finding's claim about what the documentation says is checked against a lexical index of the documentation checkout at the commit under test, with a verbatim quote required before a claim can count as verified. The hints themselves are not checked before injection: that check depended on a hosted documentation search that is switched off (next section), and it failed open, so it was removed rather than left to report \"verified\" for every hint; each hint is recorded as unverified. Of 586 oracle transcripts on file, the oracle intervened with a hint 449 times and recorded 2,648 review findings; 835 counterfactual replays exist across 282 of them.",
      "**Writes** one transcript per task, model and mode, with the validation fingerprint it was scored against (a hash of every check's type, path, sorted patterns and gate flag, so two runs scored against different check lists cannot be compared silently), tool-call counts per tool, the reviewer's findings with their verdicts, and the replays. Resolve rates feed the dashboard and the per-page dossiers; verified findings feed the oracle-insights page.",
      "**What it taught us.** A run in which the agent never called a tool is not a failed attempt; it is no attempt. It is marked `didNotRun`, excluded from every rate, and counted out loud on the page. Across the roughly 1,740 transcripts on file, a quarter are dead runs: a provider on a free-tier key, a gateway that mangles one model's tool calls, and stalls. Four frontier models resolve every task in every mode, so the suite no longer separates them; the skills' effect shows on the middle tier (one model from 1 of 6 tasks to 3, another from 3 to 5). The fact check is the sobering part: on the most recent pass over 300 distinct review claims, 15 were verified, 113 contradicted by the documentation and 172 not found in it. Most of what the reviewer reports as a documentation gap, the documentation either contradicts or never mentions. The board shows verified findings and marks the rest.",
      "### 7. Retrieval, and why it is off",
      "The system once used a hosted documentation search as a retrieval layer: a context layer in the onboarding and knowledge suites, the oracle's hint check, the reviewer's source of documentation, and the fact check that gated proposed skill edits. The plan allowed 3,000 searches a month. On one day the pipelines made over 30,000, from an uncapped loop, and the first anyone knew of it was a $15,000 overage.",
      "Retrieval is now off at every call site. The two layers that depended on it are retired and refused if requested (not silently emptied), the monthly count is checked daily and gates every run, and each of the four consumers was given a replacement that does not need a search service: the oracle's reviewer and the ledger's fact check read a lexical index built from the documentation checkout (headings as the unit, tf-idf over passages with an exact-phrase bonus, built in a second from the pages on disk at the commit under test); the skill-edit proposer only accepts expectations the documentation already verified; the hint check is out until it can be rebuilt on the same index. The comparison the retrieval layers existed to make had already come back null on every model tried, so what was lost was a cost, not a measurement.",
      "### 8. The visibility suites",
      "Two smaller pipelines measure what a model says when nothing is loaded. An **unbranded** suite sends 79 comparison prompts with no platform context and records which ecosystems the model mentions, for visibility only, no pass or fail. A **competitor** benchmark sends the same task prompt with different ecosystem contexts and compares answer quality, then fetches competing documentation pages and scores them on the same extractability measure the audit uses. Both weekly, both cheap, both now three attempts per prompt.",
      "### 9. Analytics and the weekly report",
      "A weekly job pulls the analytics service (visitors, pageviews, time on page and scroll depth per route; entry pages and bounce from journeys) and the assistant export (every question with the page it was asked from), writes a dated snapshot per site, and has a model produce recommendations per route, each with a scope, a why-now and an expected impact, each fact-checked, with the note kept. Coverage gaps are computed as questions per pageview per page. The nightly checks job then builds a **worklist** per site that joins the ledger's findings with the audit's signals and the analytics, resolving each recommendation to a route; the dossier reads that worklist. A separate weekly job tracks skill installs and assistant usage as adoption signals.",
      "### 10. The model registry and the harness",
      "Every model evaluation goes through one harness over one agent SDK, so a comparison across providers is a comparison of models, not of client code. The harness owns the thinking-level selection per model from the provider catalogue; a retry when a reasoning model returns a turn with thinking and no text; a request rewriter for a gateway that rejects the SDK's content-array format and its null content on tool-call turns; a record of the last gateway rejection so an empty answer can be attributed to the request that caused it; and a silence watchdog that aborts a turn after five minutes with no event, because a hung model otherwise ran to the job ceiling, which was six hours.",
      "The model matrix is a registry file refreshed nightly from the provider catalogue. New members of model families already measured are adopted and run that night; retirements are manual and listed. A model can declare `tools: false` with a reason; one open-weight model's tool calls arrive from the gateway as JSON inside the reasoning text with a normal stop reason, so it is measured without tools where the skill text is in the prompt regardless, and left out of the agentic suites, which cannot run without them.",
      "## Joining it: the per-page dossier",
      "Twelve of the jobs above say something about a specific page, and for a long time each said it on its own dashboard page. A writer looking for work had to visit all twelve. The dossier joins everything per route and is the dashboard's work queue.",
      "**Identification.** Every source names a page differently (a content file, a URL, an analytics path, an assistant origin) and all are reduced to one route per site by one set of rules that mirror the worklist's: strip the extension, drop a trailing index, add the site's base path; strip scheme, host, query and fragment from URLs. Files that are not pages (a redirect table) get a pseudo-route under a configuration section; include fragments are kept but have no URL. A page exists in the join the moment any source names it. A page nothing names does not appear, and traffic alone does not make a page work.",
      "**Action items.** Each item is a sentence a writer can act on, with its source, a kind, a severity and the evidence that produced it: a score, a quote, a count, a check name, a file and line. Severity is set per source by rule, not per item by judgement. An audit accuracy note on a page scoring under 70 is high and above it medium; a clarity or coverage note under 70 is medium, otherwise low; a declared-goal check the page fails is high; a ledger finding is high, medium or low by tier B, A, C; a broken link is medium and a broken anchor low; an orphan is low; an entry page with a 90% bounce and 50 or more entries is high; a page whose readers stop before 40% is medium; an assistant page with at least three questions is high when questions exceed pageviews; a builder-path step rated missing is high and partial medium; a failing embedded example is high; an agent task resolved under half the time is high and under 80% medium. Filtered before an item exists: praise, closed and dismissed findings, dead runs, reviewer findings the fact check contradicted, questions asked from the homepage widget, pages with fewer than three questions, and behaviour on pages with too little traffic to mean anything. Three hundred hardcoded-address hits on one site collapse to one item per page naming the lines.",
      "**Scoring.** A page's score is how much the page matters times how much is wrong with it, with the second part damped:",
      "`score = weight × (1 + ln(1 + Σ severity))`, with high = 1.0, medium = 0.5, low = 0.2",
      "The log is the design decision: forty low notes cannot outrank one wrong signature on a busy path. The weight starts at 1 and is multiplied by every condition that holds, with the constants read at build time from the same file the worklist uses, so the two rankings agree by construction:",
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
      "The traffic cuts come from the site's own distribution rather than a constant, and a page must clear both a percentile and a share of total traffic: on a site with 500 routes, a median of two visitors and a top page of 800, the 90th percentile alone is 14 visitors, and weighting a 13-visitor page as top-decile would apply the weight to almost everything. Every multiplier that fires is written into the page's \"why\" list and shown under its title. The top page on the largest site at the last build carried five multipliers (weight 5.05), two high, five medium and 22 low items (evidence 8.9), and scored 16.64; the median page scores 3.7.",
      "**The button.** Each dossier page can send its full dossier and the page source to a strong model with the instruction to change only what an item justifies, to trace every edit to an item number, never to invent a fact (no API name, flag, URL, version, number, address or behaviour that is not already on the page or in an item's evidence), to apply the ledger's proposed replacements verbatim, to treat reader-behaviour and assistant items as \"readers needed this and did not find it\" and act only when the answer is already on the page, and to prefer the smallest edit. The revision is refused if it is empty, shorter than half or longer than twice the original, missing the frontmatter or any frontmatter field, missing any import line, or introduces an unbalanced code fence. What passes becomes a draft pull request, updated in place if one is already open, whose body is the model's own account read against the dossier: what changed and which items it addresses, which items were skipped and why, the page's signals, and a link back to the dossier.",
      "## Designing the dashboard",
      "Forty-one routes, grouped in the navigation as integration testing (the agentic suites, oracle insights, run history, eval coverage, and the two authoring tools that are moving to their own repository), documentation health (content quality by site, skill gaps, code examples, visitor analytics), marketing (onboarding, unbranded, competitor, adoption) and the knowledge boards (per repository, the skills-format analysis, the routing eval), with the per-page dossier reached from the home page. A few rules held across every page, and each came from a page that broke it.",
      "**Remove, don't explain.** A confusing number is deleted, not justified with a longer caption. The onboarding page once showed four layers where two were a null result from the retired retrieval; they are gone, with one sentence saying why.",
      "**Mark, don't delete.** A run that answered most of a suite is excluded from ranking and fully usable for everything else. A card scored against an older suite is shown as against an older set. A dead run is counted, out loud, as dead. Partial is a label.",
      "**Provenance with every number.** Who graded it, which suite fingerprint, when, how many attempts, how many empty answers, which ids were recovered, pipeline or community. When a rename invalidated the board, provenance is what let the cards be recovered instead of discarded. When a run of a dead provider was committed, provenance is what let the dashboard hide it.",
      "**Show the evidence, not the verdict.** A reader cannot act on \"failed.\" They can act on the judge's reason next to what the model said, the assistant's actual questions next to the page, the compiler's output next to the example that failed.",
      "**Plain labels, full URLs, no tiny text.** The audience includes people who do not run the pipelines. Each source on the dossier has a one-sentence description of what it is; a model is named by its label, not its gateway path.",
      "**Prerender everything.** The dashboard computes nothing on request. Every page is built from committed data, which makes it fast, auditable and deployable without credentials. The cost is freshness: a finding closed this morning shows until the next push rebuilds, and the page says when it was generated.",
      "**Publishing never fails a measurement.** The step that rebuilds a public board, pushes cards or opens a pull request may fail with a warning. The step that commits results always runs.",
      "**A degraded run does not replace a measurement.** Before the commit job stages a result file, it compares it with the committed one; where the new run errored on more than a third of its questions and the old one did not, the old file stays, and the degraded report remains in the run's artifacts and its dated archive.",
      "## The skill authoring tools",
      "Three tools exist for the people who write skills, sharing the pipeline's harness and judge so a number there means what a number on the board means. **Test a skill**: paste a skill file and its evals, pick models, and see every expectation with and without the skill, three attempts a side. **Generate a skill from a page**: the baseline is measured before anything is written, because a skill teaching what the model already knows costs context on every request and returns nothing (a strong model answers 64.5% of the published suite with no skills at all); the generator may answer \"no skill needed\" and stop, and that is a successful run; a third of the questions are held back and scored once at the end, because editing a skill until its own evals pass always converges and nothing inside the loop can tell that from a skill that learned the subject. **A/B a skill edit**: the same eval, model and prompt against the main branch's skill file and a pull request's, sampled several times a side, reported on the expectations the edit targets, so a skill-gap pull request can be checked for whether it moves anything before it merges.",
      "A related experiment on the dashboard measured whether how a skill is written changes what a model does with it: one skill, four rewrites, eight evals, ten attempts each, 56 expectations. No skill at all met 19; the skill as written met 18 at 14,200 tokens of context; a rewrite for salience met 18; a rewrite to a published skill-format guideline met 15 at 1,054 tokens. On that skill and that model, format did not help, and the shortest version cost the most.",
      "## What it costs, and what broke",
      "Over the thirty days before this report: about a thousand workflow runs. The oracle suite was the most expensive at roughly 6,100 wall-minutes with a median run of 204 minutes and a longest of 1,379; the knowledge suite about 4,400 across 76 runs, most of them manual dispatches during a week of fixes; the onboarding suite about 1,100, with single legs running over five hours on the slowest open-weight models. Half of all runs in the window were one job, since deleted, that fired hourly and failed every time on a missing integration that nothing alerted on. The failures that cost the most time were in the plumbing, not in the models.",
      "**A dead provider on every matrix.** One provider's key turned out to be free-tier, twenty requests a day per model. Its three models returned empty answers on every leg for weeks, discarded by the guards each time, and spent six legs per run doing it. They are out of the registry; because the registry only adopts families already present, they stay out unless someone adds one back deliberately.",
      "**A gateway that leaks tool calls.** One open-weight model's tool calls came back from the gateway as trailing JSON inside the reasoning text, with a normal stop reason and no tool-call array. The harness saw a thinking-only turn and an empty answer, 290 turns in a row across two legs, while the larger model of the same family on the same gateway used tools on 75 of 84 turns and scored 96%. Diagnosed from a wire capture of one request and response; fixed by declaring the model tools-off in the registry.",
      "**Context overflow retried as a throttle.** A model with a small context window spent eight tool rounds listing the empty baseline directory until the request no longer fit, and the retry loop re-asked a deterministic 400 three times per question, 34 retries on one leg. The gateway's error body was being cut at 600 characters, before the sentence that named the limit. Now the full body is recorded, a context-length 4xx is never retried and is counted separately, and the empty directory carries a README saying there is nothing to read.",
      "**A rate-limit storm overwrote a measurement.** One model's run met 429s on 155 of 156 questions (465 empty answers, 935 retries), exited 0 as designed, and the commit job wrote it as the model's result; the board carried a card covering one question. Hence the guard above.",
      "**The judge choked on a glob.** Asked whether an answer mentioned `*` and `**/*` patterns, the judge quoted them back with a Markdown escape that is not a JSON escape, the parser rejected the whole array, and the same eval was ungraded on twelve models. One repair of the escapes before retrying the parse; anything else still fails as before.",
      "**One sample is not a census.** Every comparison was published at one attempt per question for months. Three is now the floor everywhere, and the agentic suites were re-batched into single-task jobs so three attempts fit under the six-hour job ceiling.",
      "**A publishing step turned measurements red.** Twice in one week a scheduled knowledge run failed on a check inside the public repository's own validators after every leg had measured correctly and the results were committed. The board step is now allowed to fail.",
      "**A debugging run was committed as data.** A one-skill run dispatched to capture a wire log went through the normal results path and replaced a 156-question result with a two-question one. Reverted the same hour; a wire-logged run can no longer commit.",
      "**An apostrophe in a comment broke a shell script.** A comment inside a single-quoted script that builds the job matrix said \"a model's legs\"; every setup job after it failed on a syntax error until the comment was rewritten.",
      "**Build output was tracked.** A trace file from the build was committed and showed as modified on every status check, for months.",
      "## What it is worth",
      "Against the cost: a knowledge suite with a stated noise floor, every model measured on identical questions through one pipeline; two public boards anyone can reproduce from the published cards; an onboarding suite that now measures the thing an agent actually does; a routing eval that measures the one artifact nothing else tested, with measured rewrites waiting for a reviewer; agentic suites with dead runs marked and the reviewer's findings fact-checked against the documentation; two ledgers with 819 findings fixed; and a per-page dossier that turns twelve measurements into one ranked list of work with the evidence attached.",
      "The system tells the team which parts of the documentation models cannot use, which pages readers abandon, which proposed fixes reviewers accept, and the figures move when the documentation changes. What is next, in order: a page about the jobs themselves (last run, success rate, minutes, last data commit, pages fed), because every failure in the previous section was invisible until that view was assembled by hand; concurrency groups so three matrices stop queuing each other for hours; moving the raw analytics snapshots (10 MB a day of them) out of git with a retention policy; and finishing the move of the three authoring tools to their own repository, which has its own continuous integration as of this week.",
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
