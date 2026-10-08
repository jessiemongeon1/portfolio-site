const { useState, useEffect, useRef } = React;

const JOURNAL_POSTS = [
  {
    id: "p7",
    title: "Measuring documentation with AI agents: methodology, design, and learnings",
    dek: "Four benchmark pipelines, and the failures that taught us which numbers to trust.",
    tag: "Evaluation",
    date: "Oct 07, 2026",
    read: "55 min",
    accent: "blue",
    body: [
      "This is a report on building a benchmark that measures how well AI coding agents answer real developer questions about a software platform, and how much a set of authored skill files improves those answers. Four separate measurement pipelines were built: a knowledge suite, an onboarding suite, an end-to-end build suite, and a rescue harness that records what an agent had to be told. The skills turn out to be worth anything from a rounding error to a transformation depending on the model. Almost all of the engineering went into making a number like that trustworthy rather than into producing it, and this report is mostly about the failures that taught us the difference.",
      "## The system",
      "The benchmark asks AI models developer questions about a platform and grades the answers against expectations written in advance. It has four parts, and keeping them in the right repositories turned out to matter more than any single design choice inside them.",
      "The **suite** is a few hundred questions, each carrying several expectations, assembled from a manifest file that sits beside each skill in a public skills repository. A question is a prompt a developer would actually type, such as whether two operations can be composed inside a single transaction. Each one cites the documentation page a correct answer comes from, which is what makes the suite a test of whether the product is documented rather than a test of what a model memorised.",
      "A **card** is the publishable part of one run: which model, which configuration, and how many expectations it met on each question. No prompts, no responses, no judge transcripts. Cards arrive by pull request, they are validated in CI against the current suite, and anyone can submit one.",
      "The **board** is a function of the cards plus the skills they were scored against. It is rebuilt at deploy time rather than served from whatever was last committed, because a card merged without a rebuild, or a skill edited without one, would publish a page that disagrees with the repository it came from.",
      "The **pipeline** runs the suite against a model and emits the cards. It lives in a private repository alongside several other eval pipelines that have nothing to do with this board.",
      "That last split is deliberate and was nearly undone. Moving the measurement into the public repository would make the whole thing reproducible, which is the stated goal of publishing the board at all. The import closure of the runner came to a handful of source files, which looked self-contained. It was not: the harness module alone has many other consumers, and so do the statistics and retrieval modules. Moving them would have left two copies of the eval harness in two repositories with no test comparing them, which is a failure this project had already paid for twice. The boundary that works is the one where cards cross: the pipeline produces them, the public repository consumes them, and the code either produces or consumes but not both.",
      "There is also an **internal dashboard**, which reads the same published cards and shows three things the public page leaves out: both layers of every model rather than the comparison, the runs that answered too little of the suite to be ranked, and the reliability figures. The public page answers \"which model should I use.\" The internal one answers \"which runs need re-running.\" Those are different questions and they were worth separating.",
      "Three further pipelines measure things the knowledge suite cannot, and they get their own sections below: an **onboarding suite** of open-ended prompts run through four context layers, an **end-to-end build suite** of tasks graded on code that has to compile, and an **oracle harness** that interrupts a failing agent, tells it what it needed to know, and records what it had to be told.",
      "## How a score is built",
      "A score is the mean of four area scores, where each area score is the share of its expectations that a model satisfied. Four decisions shape that sentence, and each one was made against a specific failure.",
      "### Expectations are counted, not questions",
      "A question carries several expectations: the import to use, the call to make, the mistake to avoid. The obvious scoring rule is to pass a question only when every expectation is met, and that rule destroys the measurement. Scored pass-or-fail, the weakest models on the board bunch together near zero, and the ranking says nothing about which of them is closer to useful. Counting expectations separately spreads the same models across a usable range.",
      "This is not a presentational nicety. A model that gets five of a question's six expectations right has not failed it the way a model that gets none has, and a measure that cannot tell those apart cannot tell you whether a documentation change helped.",
      "### Four areas, equally weighted",
      "The suite groups questions into four areas: the data model, transactions, application building, and security. Application building holds about half the questions; security holds a small fraction. A pooled total would therefore let the largest area set the score almost on its own, and a weak showing on security would vanish into it.",
      "Averaging the four area scores makes each one worth a quarter regardless of how many questions it holds. The question counts are uneven because the questions were written per skill and grouped into areas afterwards, which is an accident of history rather than a judgement about what matters, and the scoring should not inherit that accident.",
      "### Asked more than once",
      "The same model asked the same question twice does not always answer the same way. One answer is a sample, not a census.",
      "Most runs ask each question several times and score the average. The sampled runs also produce two figures that a single run cannot: pass@k, whether any attempt answered a question in full, and pass^k, whether every attempt did. The gap between them is how much of a model's apparent ability is unreliable rather than absent, and it is large. A bare model's pass^k is a small fraction of its headline score, with dozens of questions per model changing verdict between identical attempts.",
      "That last number is the one that justifies sampling at all. Those flaky questions are the only ones a single-run board can report wrongly, and every number published before sampling was introduced came from a single run.",
      "### The judge decides, and term matching is the fallback",
      "Most expectations are prose, such as \"warns that each transfer grants full privileges,\" and only a reader can judge them, so a second model reads the answer and grades it. Where an expectation names something exact, a pattern can be written down and checked literally instead; a small minority are written that way so far, and those never reach a judge.",
      "The ordering matters and was wrong at first. The original design graded everything by extracting key terms out of the English of an expectation and matching those, which is a regular expression reverse-engineered from a sentence. A later section covers what that cost. What replaced it is a rule about authority: the judge decides, and term matching is consulted only when the judge could not answer. An expectation the judge failed to grade is unknown, not failed, because a single judge timeout read as a verdict would mark a whole question failed and show a regression that never happened.",
      "How much this choice matters is visible in a second pipeline that made the opposite one. The onboarding suite grades by static expectation matching with the judge disabled, and the handful of runs in its history that did use a judge report the skills as a solid double-digit gain while every judge-free run reports somewhere between a small loss and a small gain. Same prompts, same layers, opposite conclusion. The grader is not an implementation detail of a benchmark; it is a term in the result.",
      "### Coverage decides whether a run is ranked",
      "A run that answered part of the suite is not a lower score, it is a different measurement. A card must cover nearly all of the suite to be ranked; below that it is marked and shown without a number.",
      "This threshold does real work. Several of the open-weight models measured so far answered only a fraction of the suite, because they returned nothing for most questions. Publishing a percentage for those runs would put a number next to a model that never answered, and the number would look like a score.",
      "## Design decisions and what each defends against",
      "Every one of these exists because something went wrong, and the table is more useful read as an incident list than as a feature list.",
      "| Decision | What it defends against |",
      "| --- | --- |",
      "| The suite carries a version fingerprint | A card scored against an older set of questions being ranked beside current ones as though the two were comparable |",
      "| Every question cites a page | The suite drifting into product trivia rather than testing whether the product is documented |",
      "| Cards hold counts, never prompts or responses | A public artifact that cannot be published because it contains judge transcripts and internal paths |",
      "| A card records who measured it | Two measurements of one model colliding into one board row, the second silently overwriting the first |",
      "| The board is rebuilt at deploy | A page that disagrees with the repository it was built from |",
      "| An expectation the judge could not grade is unknown | One judge timeout marking a whole question failed and showing a regression that never happened |",
      "| Baseline runs are excluded from coverage figures | A work queue of questions a bare model cannot answer, which is a different question from what the documentation fails to teach |",
      "| Retrieval is off at every call site | An uncapped loop spending a monthly plan in a day |",
      "| A build task's checks name a gate | A task scored on a row of cosmetic file checks after the one check that mattered already failed |",
      "| A rescue hint is fact-checked before the agent sees it | The harness teaching an agent something the documentation contradicts, then scoring it as a win |",
      "### Provenance, and why a label is not a permission",
      "A card records a source field: `ci` for the pipeline's own runs, `community` for everything else, with absent counting as community. The default claims less on purpose, because a card that forgets the field is far likelier to be a first submission than a pipeline run.",
      "The interesting part is what that field had to become. Labelling the runs was half-built already: the board checked whether the source was something other than `ci` and appended \"(submitted)\". But nothing validated the field, nothing displayed it, and it was not part of a run's identity. The board keys a run on model and layer and ignores filenames, so two cards for the same pair collided: the second overwrote the first's record page and the board showed two rows with the same name. The repository's own control runs already had that shape, since two differently named files described the same model at the same layer.",
      "So provenance went into the run's name, which is what the slug is built from, and a contributor re-measuring a model the pipeline already covered now adds a row instead of replacing one.",
      "A label in a JSON file cannot defend itself, though. What stops a community card claiming `ci` is a CI check that fails a pull request from a fork which adds or changes a card claiming it. A reviewer would catch it in the diff; a check that fails is not something anyone has to remember to look for.",
      "### Marking rather than ranking",
      "The board has three states for a run, not two: ranked, marked, and held back.",
      "A marked run answered too little of the suite to rank. A held-back run was measured a different way, which currently means graded by term matching rather than by the judge. Tool access is folded into the grading regime for the same reason, so a run made without the file-reading tools is held back as \"judge, no tools\" rather than ranked beside runs that had them. On one skill that difference was the better part of sixty points, and ranking the two in one column would compare harnesses while appearing to compare models.",
      "## The onboarding suite, and a result whose sign depends on the grader",
      "The knowledge suite asks closed questions with citable answers. The onboarding suite asks the open-ended ones a developer actually opens a chat window to ask, and it exists because those are the questions documentation is for.",
      "It holds a few dozen prompts across more than a dozen categories, weighted toward the places people get stuck rather than the places the product is interesting. Error triage and node operation carry the most; the \"complete beginner\" category holds among the fewest, which is the opposite of how a documentation site allocates its front page. Each prompt carries written expectations in the same form as the knowledge suite, including negative ones: \"does NOT recommend building from source as the primary method\" is an expectation a correct answer must fail to satisfy.",
      "Prompts also carry an optional language tag. An untagged prompt is English, and the tag exists so a model can be caught answering with correct facts in the wrong language, which is a failure mode that scores perfectly on every expectation written in English.",
      "### Four layers instead of two",
      "The knowledge suite compares two layers, with the skills and without. The onboarding suite runs four: bare model, skills only, retrieval only, and both. The extra two answer a question the two-layer design cannot, which is whether an authored skill file earns its place over simply searching the documentation at question time.",
      "That is the right question and this suite cannot currently answer it, for a reason that is worth stating plainly: **it takes one sample per layer.** A four-way comparison between single draws cannot separate a layer that helped from a layer that drew a luckier sample, and the published figures differ between layers by a tenth of a point. The knowledge suite learned this and moved to three samples; this pipeline has the flag and defaults to one.",
      "### The grader changes the answer",
      "The runs in this suite's history mostly graded by static expectation matching with the judge switched off. A few, all older, ran a judge as well.",
      "The two groups disagree about the sign of the result.",
      "| Grading | Skills vs. bare model |",
      "| --- | --- |",
      "| Judge plus static matching | a consistent double-digit gain |",
      "| Static matching only | no gain, and as often a small loss |",
      "No run in the second group reproduces any run in the first. Same prompts, same four layers, same expectations. Across every recorded run the bare model is scored the best of the four layers several times more often than the skills are, which on its face says the skills make onboarding answers worse.",
      "The explanation is the one the knowledge suite already paid to learn. Static matching tests whether an answer contains particular strings. A skill file makes answers longer, better organised, and more likely to phrase a thing the way the skill phrases it rather than the way the expectation's author phrased it. A judge reads for meaning and finds the improvement; a term matcher reads for tokens and does not. A later section describes the same mechanism making a large minority of expectations unpassable in the knowledge suite.",
      "What makes this a reporting failure rather than a measurement failure is that both groups of numbers were on the same dashboard page, in the same table, with no column for which grader produced them. A reader comparing a judge-graded run against a static-only run was comparing graders and reading it as models.",
      "### Three more things the data says and the page did not",
      "**Run lengths differ and nothing said so.** The runs in this suite's history cover several different prompt counts. Most stop well short of the full set; only a few completed it, and one of those recorded no scores at all. The knowledge suite has a coverage gate for exactly this; this suite has none, so a part-length run and a full-length run sat in one ranking.",
      "**A dead run reported a score.** One run reports the same figure on all four layers, identical to three decimal places. Four layers agreeing exactly is not a result, it is the signature of a run that failed before the layers diverged. It was displayed as a score for weeks, same as the empty-holdout run described later.",
      "**A metric that is always zero is still a column.** The summary carries average judge scores alongside average pass rates. In the judge-free runs that field is zero for every layer, because nothing filled it. Zero is a value, it renders, and it sorts.",
      "## The end-to-end suite: grading work instead of answers",
      "A model can describe the right API and still be unable to build anything. The end-to-end suite closes that gap by giving an agent a sandbox, a multi-turn budget, and a task specified the way a ticket is, then grading what is on disk when it stops.",
      "A couple of dozen tasks, split between on-chain code, integrations against a running service, and migrations from a deprecated API to its replacement. Each carries a prose specification naming the files to produce and what each must contain, a ten-minute wall-clock budget, a machine-checkable validation list, and a rubric.",
      "### Checks that run, and one that stops the rest",
      "Validation is six check types, in rising order of how much they prove:",
      "- **file exists** at a given path",
      "- **content check**, the file containing every one of a list of patterns",
      "- **version check**, a dependency pinned to something current rather than to whatever the model remembers",
      "- **command**, something the harness runs, which in practice means the compiler and the test suite",
      "- **lint**",
      "- **placeholder reject**, which fails a file containing the words a model writes when it does not know the answer",
      "That last one exists because an agent that writes `// TODO: implement the actual logic` passes a file-exists check, passes most content checks, and has done none of the work. Pattern matching rewards the shape of an answer, and a stub is the right shape.",
      "One check per task is marked as a gate. If the gate fails, the remaining checks are not credited. The gate is almost always the project manifest, because a task whose build file never appeared cannot have produced a working anything, and a row of cosmetic file checks passing underneath a failed build reads as a passing majority when the honest figure is zero. A healthy-looking score on a project that does not compile is worse than a zero, because somebody will act on it.",
      "### Two graders, because the checks cannot see quality",
      "Checks answer whether the files exist and compile. They cannot answer whether the design is right, so each task also carries a rubric: six criteria common to every task, plus task-specific ones, each flagged hard or soft. A hard criterion is one where getting it wrong means the result is wrong rather than merely rough, and those are the ones that distinguish code that compiles from code that works.",
      "### What the runs say, and what three of them were actually measuring",
      "Dozens of aggregate runs exist, in three modes: bare agent, agent with the skills loaded, and agent with the oracle described in the next section. Taken as they sit on disk, they say this:",
      "| Mode | Tasks resolved |",
      "| --- | --- |",
      "| Bare agent | about two in five |",
      "| With skills | about half |",
      "| With the oracle | more than four in five |",
      "That table is wrong, and the way it is wrong is the most useful thing in this report. A gap that size is the kind of result that gets presented to a leadership team, and every point of it came from somewhere other than the oracle.",
      "The tell was visible before any of the causes were. Restricted to the model-and-task pairs present in both the skills and oracle modes, the oracle resolved twice as many, **with every single flip running from fail to resolve and not one in the other direction.** A real effect on a stochastic process does not produce zero regressions across two hundred trials. Something was different about the measurement, not the agent.",
      "Three things were, and they compose.",
      "**The oracle mode loads the skills.** One line in the runner sets the skill context when the mode is either `with-skills` or `oracle`, so the oracle column was never bare-plus-oracle. Its only honest contrast is the skills column, and that alone absorbs a quarter of the gap.",
      "**Scores of zero were recorded for runs where the agent never acted.** On one day, well over half the bare runs and half the skills runs made no tool call and wrote no files. Every check fails when nothing is written, so each one counts as a total failure by a model that may be perfectly capable. The affected runs are every model from two providers and no model from the third, which is a tool-calling fault in the harness or the API, not a capability result. **No oracle run exists on that day at all**, so the dead runs land entirely on the two columns the oracle was being compared against. This is the knowledge suite's empty-response lesson arriving in a different pipeline: a run that did not happen is not a run that failed.",
      "**The task definitions changed underneath the comparison.** A quarter of the matched pairs were scored against different check lists. The specific change is almost comic: a manifest check went from an empty pattern list, which nothing can fail, to a real requirement. The oracle runs were measured before that change. In most of the otherwise-unexplained flips, **a check the later run failed was never asked of the oracle run.** That is also the explanation for the zero regressions: the oracle arm was scored against a strictly weaker check set, so it could not lose.",
      "The turn budget is a fourth difference and a small one. Oracle runs were given twice as many turns as the others, which accounts for a handful of the remaining flips.",
      "Controlling for all of it, on the subset of model-and-task triples where all three modes ran live and were scored against identical check lists:",
      "| Mode | Tasks resolved |",
      "| --- | --- |",
      "| Bare agent | roughly three in four |",
      "| With skills | roughly three in four |",
      "| With the oracle | a few points higher |",
      "The skills are worth **about a point** on this suite, which is to say nothing measurable. The oracle is worth a few, and since it never injected a single hint across the entire corpus, that residual is most likely the doubled turn budget rather than the oracle.",
      "The honest summary of the end-to-end suite today is that it has not yet measured the thing it was built to measure. It can: the tasks are good, the checks compile real code, and the gate is right. But three uncontrolled variables and a broken day were enough to manufacture a transformative result out of a negligible one, and nothing in the pipeline objected.",
      "### What this cost and what stops it recurring",
      "The comparison was published, read, and quoted, including earlier in this report. It survived because every individual number in it was correct. Each ratio was a true statement about the runs it counted. The error is entirely in the comparison: the denominators were not the same experiment.",
      "Four changes came out of it, and only the first is interesting.",
      "**Each run now records a fingerprint of the checks it was scored against**, a hash of every check's type, path, sorted patterns and gate flag. Two runs with different fingerprints are measuring different things and the board says so rather than averaging them. The knowledge suite has carried a manifest fingerprint since its question ids were renamed underneath it; the end-to-end suite had no equivalent, and a vacuous check quietly becoming a real one is exactly what it could not see.",
      "**A run that made no tool call is marked rather than scored.** It is recorded as `didNotRun`, excluded from resolve rates, and counted out loud on the page, which now says how many runs it is leaving out and why, right beside the figures.",
      "**The modes declare what differs between them.** The page states that the oracle column is not comparable to the bare column, and names the skill loading, the turn budget and the fingerprint spread as the reasons.",
      "**The turn budget is reported per mode**, because a comparison across different budgets is a comparison of budgets.",
      "### What the harness taught us about harnesses",
      "**The prompt is not in the report.** For months, every task in one corpus told the model its task was the literal word `undefined`, because the prompt builder interpolated a description field that no task in that corpus had. Nothing caught it because the system prompt was never written to the report, so the one artifact a reviewer reads did not contain the one string that was wrong. There is now a test that asserts the prompt for a task with no description, and the prompt is recorded.",
      "**A field nothing reads is a field that is wrong.** Tasks recorded worked reference implementations in a `references` list, and the prompt builder ignored it. A task with a known-good implementation to point at and a task with none produced byte-identical prompts. Whether a task had a reference was a fact about the repository rather than about the measurement, and it stayed that way until a test compared two prompts.",
      "**Headers and rows came from two places.** Roughly a third of the aggregate reports disagree with their own task list: a header claiming fewer tasks than the rows beneath it, and in one case claiming a task resolved where no row is marked resolved. The summary was computed during the run and the rows were written at the end, so a task added, retried, or timed out after the counter was taken does not appear in it. This is the same defect as the duplicated board described later, in a pipeline nobody had checked for it.",
      "**The old runner graded prose, and it showed.** An earlier version of this suite had no sandbox. It asked the model for code and then extracted files out of the reply, which required four separate patterns for the ways a model announces a filename: in backticks, in bold, as a heading, and bare on its own line. It also had to flatten extra directory levels the model invented. Every one of those patterns is a place where a correct answer scores zero because of how it was formatted. Giving the agent real file tools and a real compiler removed an entire class of grading error, and that is the single largest methodological improvement in this project.",
      "## The oracle: measuring what the agent had to be told",
      "The other three pipelines measure whether an agent succeeds. The oracle measures something more directly useful to a documentation team: **what the agent needed to be told in order to stop failing.** A pass rate tells you there is a problem. A hint that unsticks an agent names it.",
      "### How it works",
      "The oracle is an extension that watches an agent work a build task. After every turn it compares the task's check score against the previous turn's. If the score went up, it does nothing. If the score stalled or regressed, the agent is stuck in a way it is not going to fix by itself, and the oracle steps in:",
      "1. Generate a hint, using the loaded skills and a documentation search as context.",
      "2. **Fact-check the hint against the documentation server before the agent sees it.**",
      "3. If the documentation supports it, inject it as a follow-up message.",
      "4. If the documentation contradicts it, log the contradiction and stay silent.",
      "5. Record the intervention either way.",
      "Step two is the part worth copying. A harness that can inject guidance can inject wrong guidance, and an agent that succeeds because the harness told it something the documentation contradicts has produced a result that is worse than a failure, because it will be scored as a win and read as evidence the documentation works.",
      "There is also a rescue path for the case where a bare run already solved a task that the current run is failing. That asymmetry is itself a finding, and it switches the oracle from hinting to rescuing.",
      "### Counterfactual replay: whose job was it to say this?",
      "A finding says the agent got something wrong. It does not say who should have told it, and that is the question a documentation team actually needs answered, because the two answers have different owners:",
      "- **The tooling should have said it.** A better compiler error, lint warning or CLI message. Fixing that reaches every agent and every person, and nobody has to read anything.",
      "- **A skill should have said it.** Fixing that is a writing job, and it only helps whoever reads that skill.",
      "So every finding worth replaying is replayed twice. One arm resumes from the last turn where the agent was still stuck, with the finding spliced in as the compiler would have phrased it. The other starts the task from scratch with the finding added to the skill context, as though it had always been written down. Each arm gets two turns and the task's real checks decide the outcome, so what is measured is whether the information arriving on that surface was enough.",
      "The framing matters more than it looks. \"Suggestion: you should add X\" tests whether a model follows instructions. `error: missing edition field in manifest` tests whether the fact landing where the agent is already looking is sufficient, which is the thing being asked.",
      "The output per finding is a best surface and an impact: high when a surface resolves the task and saves turns, medium when it resolves it, low when neither arm does, which means the finding was not the blocker. Aggregated, this is the most directly actionable number the whole project produces, because \"the tooling wins most of these and the skills win a few\" is a work allocation.",
      "This was built, then lost, and the loss is instructive. It lived in the older runner and was deleted in a cleanup commit as one of a batch of \"dead\" scripts, on the correct observation that no workflow referenced it. It was not dead: it was the only implementation of this A/B, and the dashboard and the progress report both still read the field it wrote. They have rendered nothing since. Worse, the port was documented as having happened: the oracle's own header still claims the agent framework's message tree lets it \"rewind to any point for counterfactual replays, replacing manual checkpoints.\" No such API is exposed by the harness, and nothing was ever built on it. A comment described a replacement that did not exist, which is why nobody noticed the original was gone.",
      "The restored version keeps checkpoints explicitly, as the original did. It did not need tree navigation: the files each turn produced are already recorded per turn, so a replay is a fresh session over a sandbox seeded with those files. That is a cleaner comparison than splicing a transcript anyway, because the two arms then differ only in what the agent was told. Every dependency is injected, so the full A/B runs in a test with no model, no sandbox and no network, which is the difference between code that survives the next cleanup and code that reads as dead.",
      "### The post-run reviewer",
      "After the task ends, resolved or not, a second pass reads every file the agent produced and classifies each pattern it finds into one of four buckets:",
      "| Classification | Meaning | What to do about it |",
      "| --- | --- | --- |",
      "| Skill gap | A correct pattern that is nowhere in the skills | Write it down |",
      "| Skill unclear | A correct pattern that is in the skills, and the agent still got it wrong | Make it land |",
      "| Deprecated pattern | The code uses an API that has been replaced | Fix the docs that still show it |",
      "| Matches docs | The code follows the documented pattern | Nothing |",
      "The first two are the pair that matters, and keeping them apart is the whole value of the exercise. Both look identical in a pass rate. One is a writing task and the other is an editing task, and treating them as one bucket produces a backlog that cannot be worked.",
      "Making that distinction automatic required a specific trick. Comparing the reviewer's prose against the skills finds nothing, because the prose is the reviewer's own wording and never appears in a skill verbatim. What does appear verbatim is the code a finding quotes, so the check runs on the distinctive tokens inside a finding, discarding anything shorter than six characters or lacking punctuation, since a bare word like `package` or `vector` matches everything and proves nothing.",
      "Before that check existed, the field was in the schema and nothing ever set it, so every finding read as a documentation gap. The four highest-ranked entries on the resulting page were all the same one-line edition setting in a project manifest, which one of the loaded skills states outright.",
      "### What the oracle runs actually contain",
      "A dozen models, a couple of dozen tasks, a few hundred per-task reports, three quarters of them resolved. The recorded oracle actions break down like this:",
      "| Action | Count |",
      "| --- | --- |",
      "| No intervention needed | about a third |",
      "| Post-run review finding | nearly all the rest |",
      "| Oracle error | a handful |",
      "| **Hints injected mid-run** | **none** |",
      "The row that matters is the last one. **In the entire recorded corpus, the oracle never injected a single hint.** Every one of its interventions is a post-run review. The in-turn mechanism described above, the fact-check gate and the rescue path, is present in the code and fired zero times.",
      "The cause is one line, and it is the best example in this report of a precondition that cannot be met:",
      "```\nif (!config.baselineContext) { record no_intervention; return null }\n```",
      "Nearly half the recorded declines are that branch. The baseline summary it wants is read off disk from a file the *baseline* mode writes, in a separate CI job, with its own filesystem and no ordering between them. In more than half the report pairs on disk, the baseline file was written **after** the oracle run that wanted it. The dependency was unsatisfiable by construction.",
      "What made it invisible rather than merely broken is how the failure was recorded. A missing precondition was written down as `no_intervention`, which reads as \"the agent was fine and the oracle had nothing to add.\" The field said the opposite of what happened. A run that had lost half its inputs was indistinguishable, on every page downstream, from one that had everything.",
      "The gate is gone. The baseline summary is enrichment for the hint prompt, not a precondition for hinting: what the oracle diagnoses from is the errors, which it already requires. A run without the summary now warns once, records `baselineContextAvailable: false` so a reader can tell the two apart, and hints anyway. A second fix came out of reading the loop while it was open: the oracle was also being consulted on the final turn, so every unresolved run paid for one hint, injected it, and then fell out of the loop without ever validating what the agent did with it. The older runner guarded that and the port had dropped the guard.",
      "Three consequences followed from the silence, and all three were live until this review.",
      "**The lift attributed to the oracle was not the oracle's.** The previous section traces the whole of it: the oracle mode also loads the skills, many runs in the comparison columns were scored as failures without the agent ever acting, and a quarter of the pairs were scored against different checks because a vacuous check became a real one between the two sets of runs. Controlled for all three, the oracle is worth a few points rather than a transformation, and with no hints injected even those few are most likely the doubled turn budget. The chain from \"no hint ever fired\" to \"then what produced the number\" is the single most useful inference in this project, and it started from noticing that a large set of matched pairs contained zero regressions.",
      "**The page that reports hints reports zero.** The internal signals page counts interventions whose action is a hint, which is the correct filter and currently matches nothing, so its \"oracle hints\" figure is zero. Meanwhile hundreds of skill-gap findings sit in the same files, collected by nothing on that page. The headline says there is no signal; the files underneath it hold the largest gap list in the project.",
      "**A published recommendations artifact cannot be reproduced.** A tooling-recommendations file on disk reports a few hundred hints clustered into a short list of recommendations. It was generated months before the current corpus, from reports that have since been overwritten, and nothing now on disk can regenerate it. It is not necessarily wrong. It is unfalsifiable, which for a document that tells a team what to go fix is the same problem.",
      "### Half the gap findings are wrong",
      "The reviewer's findings carry a fact-check verdict, and the distribution is the most important thing in this report.",
      "| Verdict | All findings | Skill-gap findings |",
      "| --- | --- | --- |",
      "| Verified by the docs | a third | a half |",
      "| **Contradicted by the docs** | **nearly as many** | **nearly as many** |",
      "| Already documented | a few | a few |",
      "| Never checked | the largest group | the largest group |",
      "Of the skill-gap findings that were checked against the documentation, **close to half were contradicted by it.** A further few describe something already documented. The reviewer is a model reading code and asserting what the documentation ought to say, and left unchecked it is wrong close to half the time in the one direction that costs the most, because a contradicted skill gap sends a writer to document something that is not true.",
      "Separately, about a quarter of all findings flag a pattern the loaded skills already cover. Those are the skill-unclear cases, and they are the ones a documentation team can act on fastest, because the content exists and only its placement or phrasing has to change.",
      "And most findings were never checked at all. The bulk of those are the \"matches docs\" class, which needs no check. The remainder are unverified claims about documentation gaps, indistinguishable on the page from the verified ones until the verdict field is displayed, which it now is.",
      "The lesson is the one the whole project keeps arriving at from different directions. A model-generated finding is a hypothesis. The oracle's own hint path already knew this, which is why hints were fact-checked before reaching the agent; the reviewer was built later, on the same data, and shipped without the gate. Two code paths, one principle, applied in one of them.",
      "## The instrument is the first suspect",
      "The single most expensive habit in this project was trusting a number because it was produced by code that ran without erroring. Four bugs, each of which produced plausible output for weeks.",
      "### The grader that could not pass its own questions",
      "The static checker extracted key terms from an expectation and matched them against the answer. It read any capitalised word as a code identifier, so the expectation \"flags the operational cost of running an indexer\" reduced to the single term \"Flags,\" and an answer passed or failed on whether it contained that word.",
      "A large minority of all expectations were unpassable this way, and they held roughly a third of all recorded failures. A separate, corrected implementation of the same checker already existed in the repository; the fix had never reached the copy the published comparison actually used.",
      "The tell was available the whole time and nobody was reading it: the judge and the matcher disagreed on a large fraction of expectations, and that disagreement was computed and then discarded. It is counted now, in both directions, because divergence between two graders is the alarm that one of them is broken.",
      "### The baseline that could read the skills",
      "The comparison this whole board exists for is a model with the skills against the same model without them. The baseline run was given a working directory that was not gated on the layer, so a baseline model could open the skill files off disk.",
      "The result was a baseline scoring several points above the with-skills run: the skills appeared to make models worse. That number is absurd on its face, which is the only reason it was caught. A subtler leak would have produced a plausible lift and been published.",
      "The fix was a function that derives the tool root from the layer, plus a temporary empty directory for baseline runs, plus a test that fails if a baseline can reach a skill. Setting the layer explicitly rather than by withholding a variable matters here: the skill loader fell back to a bundled directory that also carries skills, so an unset variable would have quietly produced a baseline that was not one.",
      "### Three unit mismatches in one pipeline",
      "A percentage is a ratio of two numbers and it is wrong whenever those numbers count different things.",
      "- Empty responses were compared against the question count rather than the attempt count, which printed a percentage above one hundred. Worse than the nonsense figure, it moved a threshold: the same limit measured against the wrong unit fires several times too early, so a merely noisy run would have been failed as broken.",
      "- A tools-usage figure counted questions where tools were available rather than attempts where they were used.",
      "- The board divided passes by expectations in one place and by questions in another, reporting a markedly higher figure than the measurement supported.",
      "None of these threw an error. All three produced a number of the right shape.",
      "### The run that scored almost perfectly against nothing",
      "The skill generator holds a third of the questions back so the final number is one the skill could not have been tuned against. The split was stratified by citation, and when every citation was distinct it held nothing back at all.",
      "A run then reported a near-perfect score with a standard deviation of zero and no holdout, which is the signature of a skill evaluated entirely on the questions it was written from. The fix was a round-robin top-up so the holdout is never empty, and a test that asserts it.",
      "### What these have in common",
      "Every one of them produced output that looked like a measurement. None of them failed loudly. In each case the error was found by noticing that a number was impossible, not by a test, and in three of the four cases a correct implementation of the same logic already existed elsewhere in the repository.",
      "The pattern held in every pipeline, not just this one. The onboarding suite reported a model with the same score on four layers at once. The end-to-end suite told models their task was the literal word `undefined`. The oracle published a recommendations file computed from a corpus that no longer exists. Four pipelines, four instrument failures, and each was found by reading the data rather than by anything that was watching.",
      "The practice that came out of this: before believing a comparison, check that the two sides differ only in the thing being compared. That is what the baseline leak violated, what the grader drift violated, what the unit mismatches violated, and what the end-to-end suite's three modes violated in four ways at once.",
      "## A switch beats a budget",
      "The documentation search service allowed a few thousand requests a month. On one Saturday the pipeline made an order of magnitude more than that in a single day, and the overage ran into five figures.",
      "The response was a cap: a fixed number of searches per process, enforced inside the one function every caller passed through, with a comment stating that every search call in the repository went through it. Two days later the plan was passed again.",
      "### Why the cap failed",
      "Two reasons, and both are general.",
      "A per-process cap divides a monthly allowance by a job count nobody is tracking. The eval workflow crosses models with layers, so one dispatch is dozens of jobs. At the per-job allowance the workflows asked for, a single dispatch exceeds the entire monthly plan. Every workflow's own arithmetic looked prudent in isolation, which is exactly how the total escaped notice.",
      "The cap was not where the calls were. The comment claiming otherwise was wrong. Several modules did route through the capped function. Several did not: a snippet scanner opening its own HTTP client, run across seven documentation sites on every pull request; a verifier in another language using that language's standard library, run across five sites; and a third client nothing currently referenced but which was one import away from being live.",
      "### The credential nobody meant to hand out",
      "The key resolver fell back to the analytics key. That key is passed by most of the workflows to read question data from a completely different API, one that costs nothing against the search plan. Accepting it as a search credential meant every one of those jobs silently held the ability to spend the plan.",
      "This is why \"which workflows can reach the search server\" had a much longer answer than \"which workflows meant to search.\" The fallback is gone from every client now, with a comment in each saying why, because the next person to add a convenience fallback will do it for the same reason the first one did.",
      "### The monitor that never ran",
      "A monthly allowance check was written at the same time as the cap. It ran exactly once and crashed with a module-not-found error: it imported a helper that pulls in a third-party dependency, and its job had no install step.",
      "A guardrail that needs an install step is a guardrail that reports nothing on the day the install is missing, which was the day it was needed. It depends on nothing outside the standard library now. It is also worth being honest about what it can see: it sums self-recorded usage from one pipeline, so it never saw the snippet scanner or the other-language verifier at all. The switch is the control; the monitor is a report.",
      "### What replaced it",
      "Retrieval is off, at every call site, and the switch defaults to off. The enabling variable must be explicitly set before any client sends a request, in every implementation, including the one in another language.",
      "The reasoning is the part worth keeping. A budget has to be divided correctly against a job count nobody is tracking, and it has to be enforced at every call site, and both of those have to stay true as the system grows. A switch that defaults to off cannot be defeated by multiplying jobs, and a new call site that forgets it fails closed rather than open. The per-process cap still exists as a second line, but it is no longer what stands between the pipeline and the invoice.",
      "The layers that existed only to put search in front of a model are refused rather than run empty, because a layer with no context in it reported as a measurement is worse than no layer at all. The onboarding suite's retrieval-only layer is the live example: it is one of four columns on a published page, and with retrieval off it would score a bare model and label it as retrieval.",
      "## One computation, one implementation",
      "Several times in this project, one calculation existed in two places, both copies were internally consistent, and they disagreed about the answer. It is the most reliable bug in the system and the easiest to introduce, because the second copy is always created for a good local reason.",
      "| What was duplicated | How far it drifted | What it produced |",
      "| --- | --- | --- |",
      "| The static expectation checker | A fix applied to one copy, never the other | A large minority of expectations unpassable |",
      "| The board build | Two scripts of similar length, quietly diverged | A dashboard and a public board disagreeing about how many questions and runs existed |",
      "| The ledger reader | Two independent readers of the same files | Two pages disagreeing about whether a finding needed a person |",
      "| The board data itself | Two separately-built copies of one board | Open-weight models absent from the internal pages entirely |",
      "| A build run's summary and its rows | Summary counted during the run, rows written at the end | A third of reports disagreeing with their own task list |",
      "### The board that was two boards",
      "The clearest case. The internal page reported a different model count against a different question count on an older version of the suite, while the public board had the current question set, a different version fingerprint, and more than twice as many ranked runs, with the open-weight models among them.",
      "Both numbers were correct. They were different boards. The dashboard built its own copy using its own build script from its own reports, and the public repository had the other copy. The dashboard's predated a change to how ranking works, so it still dropped every card marked partial, which is most of the open-weight runs. They looked excluded by a decision; they were excluded by a stale copy of an algorithm.",
      "The fix was to delete the duplicate and build the dashboard's copy with the published build against the published cards, which makes it a mirror rather than a parallel. What stays in the private repository is the step that turns internal reports into public cards, because that genuinely belongs there. The boundary is: one side produces cards, the other consumes them, and nothing implements both.",
      "### The two pages that disagreed about the same rows",
      "A subtler version. One page listed findings the automation could not finish, meaning a check found something real, a model drafted a fix, and the documentation would not confirm it. Another page read the same ledger files and filed those same findings under \"With the pipeline, nothing to do here.\"",
      "The first page was right, and the disagreement had gone unnoticed because each page was self-consistent. Consolidating them was not simply deduplication; it required deciding which page was correct about what the rows meant.",
      "### A summary is a second implementation",
      "The newest instance is the one the end-to-end suite turned up. A run writes a summary object with its task and resolved counts, then writes the per-task rows. Those are two computations of the same two numbers, separated in time, and in a third of reports they disagree: a header claiming fewer tasks than the rows beneath it, and one claiming a task resolved where no row says so.",
      "This is worth naming separately because it does not look like duplication. Nobody writes a second implementation of a count on purpose. A counter incremented during a loop and a length taken afterwards are the same number only if nothing changes between them, and in a pipeline with retries and timeouts something always does. A summary computed from the rows it summarises cannot drift from them.",
      "### The test that only existed on one side",
      "The duplication that did not cause an incident is instructive too. The static checker had a fix in one copy and not the other; the copy with the fix also had the tests. Nothing compared them. A duplicate with tests on one side only is strictly worse than a duplicate with no tests at all, because the passing suite is evidence for a claim it is not actually making.",
      "The rule that came out of it: if a calculation must exist in two places, the second one is a call to the first. If that is impossible, a test that runs both on the same input and asserts they agree is the minimum, and that test is the deliverable, not a nice-to-have.",
      "## Reading the wire",
      "A batch of open-weight models was added to the board through a third-party inference gateway. Most of them returned empty answers whenever tools were enabled. The harness reported, for every one, `The model returned an empty response`.",
      "Finding the cause took four wrong explanations, and the shape of the mistake was identical every time: a correlation was found, a story was built on it, and the story was never tested against the mechanism it claimed.",
      "### The four wrong answers",
      "**\"The context window is too small.\"** Empty-response rates tracked context size at the low end: the smallest-window model was empty every time, a slightly larger one occasionally, and a larger one never. The arithmetic kills it. Even the smallest window here holds a short system prompt, three tool schemas, and a short document with room to spare. And one of the failing models has a context window measured in millions of tokens and failed about half the time, which one more row in the same table would have shown.",
      "**\"They cannot complete the tool loop.\"** True of a third of the failures. Of the empty attempts, a third ended on a tool result with the model never getting a turn to use what it fetched. The rest made no tool call at all and produced an empty assistant message, so there was nothing to recover.",
      "**\"We are injecting junk into the context.\"** Every one of those tool calls returned the same thing: the agent framework's own documentation about what skills are. That looked like a configuration leak until a control run settled it. A frontier model, same prompt, same questions, tools on, made several tool calls and composed a full answer, and saw that document **zero** times. The junk was fetched by the failing model itself.",
      "**\"The models do not support tools.\"** The provider catalogue's capability flags are byte-identical between the models that work and the ones that fail. Nothing declares an incapability.",
      "### What the wire said",
      "The gateway logs every request and response, which would have answered this on day one, but the token available is scoped to run inference and cannot read logs back. That turned out not to matter, because we are the client: the request leaves our process and the response arrives in it, so the one place guaranteed to see both is our own code.",
      "A `fetch` wrapper logging requests to the gateway returned the answer immediately:",
      "```\nstatus=200  text/event-stream   (streamed answer)\nstatus=200  text/event-stream   (streamed answer)\nstatus=400  application/json     (rejected, every time)\n```",
      "**HTTP 400.** The models were never silent. The requests were being rejected, and the SDK flattened the rejection into \"empty response.\"",
      "The body named it exactly:",
      "```\nBad input: oneOf at '/' not met, 0 matches:\n  Type mismatch of '/messages/0/content', 'array' not in 'string'\n  Type mismatch of '/messages/2/content', 'string' not in 'null'\n```",
      "The gateway's compatibility endpoint requires message content to be a string. The SDK sends the content-parts array that the upstream API it is imitating also accepts, and an assistant message carrying tool calls has null content. Both are legal in the format being imitated and both are refused here. That is why the first turn of every conversation succeeded, with a correctly streamed tool call, and every turn after the first tool result failed: appending a tool result is what produces the shape the endpoint will not accept.",
      "A request rewriter that flattens content arrays to strings and replaces null content took the rejections to **zero**, and the worst-affected model went from empty on every attempt to running the full suite.",
      "### The instrument repeated the error",
      "The first version of the wire logger found the answer and discarded it. It parsed the rejection body, looked for the keys a successful response carries, found none, and printed only the status line. The few hundred bytes that explained everything were thrown away by the tool written to capture them.",
      "Non-2xx bodies print whole now, before anything tries to read structure out of them. The general form: a diagnostic that only understands the shape you expected will not tell you about the shape you got.",
      "### The cost of the four wrong answers",
      "Several runs, two of which tested nothing at all because a boolean workflow input could not be switched off. In the CI system's expression language, `A && false || true` always evaluates to `true`, so the flag under test never changed; the replacement, a null check on the input, is also true when the input is `false`, because the language casts both to zero. The lesson about that expression language is narrow. The lesson about method is not: the job's own environment block prints the value it received, and reading it once would have caught both.",
      "## A measure built for a few models, used on many",
      "The gap analysis was written when the board held a few models, all frontier, all scored on the full suite. Every definition in it quietly assumed those conditions. Adding many more, several of which answered only part of the suite, broke the definitions without breaking any code, which is the harder kind of breakage to notice.",
      "### \"Failed by every model\" stops meaning anything",
      "The original gap list ranked expectations by how many models missed them, and the headline category was **failed by every model**. With a handful of frontier models that is a real signal: a question nobody can answer is a question the documentation does not answer.",
      "With more models on the board, several of them small open-weight ones, \"failed by every model\" is almost empty, and what remains of it is not about the docs. One weak model failing everything drags every count toward \"failed by some,\" and the category that was supposed to surface documentation gaps instead surfaces the weakest model on the board.",
      "It also produced a line that could not be parsed:",
      "> 6 expectations · failed by all 2 models · 4 evals · 4 unanswered",
      "The obvious objection is the right one: there are a lot more than two models. Every number in that line was computed correctly and the line still said nothing true. \"All 2 models\" meant *all models that attempted this question and are eligible for gap analysis*, which is not what \"all\" means in English. \"4 unanswered\" meant *questions in this group that no eligible model attempted*, double-counting against the 4 beside it.",
      "The replacement does not aggregate. It names the failing models, shows the specific expectations each one missed, and quotes the judge's reason and an excerpt of the response. Six expectations failed by two named models with their answers visible is a finding. \"Failed by all 2 models\" is a statistic about an eligibility filter.",
      "### Two filters that compose into near-nothing",
      "Incomplete runs are labelled partial rather than discarded, and ranking requires near-complete coverage. Both rules are defensible alone. Together they left **a handful of runs out of dozens** in the ranking, and nobody had done that multiplication.",
      "The fix was not to loosen either threshold. It was to stop treating one list as serving both purposes. Ranking needs comparability and keeps its gate. Gap analysis needs evidence, and a model that answered most of the suite has real evidence about that part of it; excluding it throws away findings to protect a leaderboard the findings page is not drawing.",
      "### The coverage question is a units question",
      "Four variants of the same mistake appeared in the same month, all of them a number divided by the wrong denominator:",
      "- expectations compared against a question count",
      "- per-model totals summed across models and reported as a suite total",
      "- `attempts` used as a unit, when an attempt is one model answering one question once, so the figure changes if sample count changes and nothing about the docs did",
      "- coverage computed over the suite manifest in one place and over the recorded runs in another, which differ whenever the manifest moves",
      "Each was arithmetically fine. Each described a different thing than its label claimed. The rule that came out of it: **every displayed figure names its denominator in the label**, not in a tooltip and not in the surrounding prose. \"Answered most of the questions, and here is how many\" cannot be misread. A bare coverage percentage can.",
      "The other three pipelines have the same disease and no equivalent cure yet. The onboarding suite ranks part-length runs beside full-length ones. The end-to-end suite averages across runs covering different numbers of tasks. The oracle's resolve rate is computed over whichever models happened to be run in that mode. In each case the denominator is real, variable, and absent from the page.",
      "## Presenting a number is part of measuring it",
      "A figure that is correct in the data and misread on the page has not been measured successfully. Several of this project's worst errors were not computational.",
      "### A percentage next to a model name reads as a score",
      "The runs table showed coverage, meaning the share of the suite a run attempted. For complete runs it is invisible. For partial runs it is the most prominent number in the row, sitting immediately beside the model name, in the position a reader has been trained by every other leaderboard to read as performance.",
      "The case that made it undeniable: one model appeared near the top of one row and near the bottom of another. Both were coverage figures from runs of different lengths, and the page was inviting a reader to conclude that the same model had scored brilliantly and terribly on the same suite.",
      "The repair was to stop putting a bare percentage there. Partial runs now read **\"answered this many of that many\"**, which is unmistakably a count of questions attempted and not a grade, and the figure never appears without that phrasing anywhere on the board.",
      "### Removing a label removed the data",
      "The note explaining why a few runs sat outside the ranking was itself confusing, and the instruction was to remove the line. The line went, and so did the six models underneath it. They had been explicitly requested additions, so deleting them was the opposite of what was asked, and the correction was immediate.",
      "The underlying error is one worth naming, because it is easy to repeat under instruction: **a caption and the data it captions are separate objects.** \"This explanation is confusing\" is a statement about the explanation. The models stayed; they are now a grouped list with an explicit answered-count on every figure and no explanatory paragraph, which is what the instruction actually described.",
      "### Verdicts are not findings",
      "The gap pages originally reported which expectations failed. That is a true statement and an unusable one, because the next question is always *what did the model actually say*, and the page could not answer it.",
      "The drill-down now carries, for each failing expectation: the model name, the judge's stated reason, and a capped excerpt of the model's own response. This changes what the page is for. \"This question failed that expectation\" sends a reader to the raw JSON. The judge's reason beside the response excerpt often shows the answer in one glance, and in several cases it showed the *expectation* was wrong rather than the model. That is the class of finding the whole exercise exists to produce, and it was invisible while the page showed verdicts.",
      "The oracle pipeline is the same lesson at a larger scale. Its findings carry a fact-check verdict, a flag for whether the skills already cover the pattern, and the quoted code that triggered them. Displaying the classification alone turns hundreds of skill gaps into a backlog; displaying the verdict alongside it reveals that close to half of the checked ones are contradicted by the documentation and should never reach a writer.",
      "### Prose that hedges is prose that is not read",
      "A handful of cards on the public page explain how scoring works. The first draft contained \"catch people out,\" a shrug about what the numbers mean, and a note about low-scoring runs so indirect that it read as an accusation nobody could check. All of it was rewritten to a few dozen words per card, definition first, no hedging.",
      "The page's credibility rests entirely on those cards, because a reader who does not trust the method does not read the table.",
      "## From measurements to a worklist: one dossier per page",
      "A dozen measurements in this project say something about a specific documentation page, and until recently none of them met. The page meant to turn them into work showed one of them.",
      "### A dozen measurements, no shared unit",
      "Every pipeline reports in its own unit. The correspondence audit reports findings per line. The content audit reports scores and issue lists per page. The analytics report visitors, scroll depth and bounce per route. The chatbot export records the page a reader was on when they gave up and asked. The journey audits rate coverage per step and name the URL. The staleness and link checks carry line numbers, the example validator reports per embedded example, and the end-to-end tasks name the pages they are built from while hundreds of transcripts say how often agents resolved them.",
      "The fixes page showed the first of these: a few hundred open line-level findings, grouped by theme, with a weight derived from some of the others. The last design question asked about it was how far an analytics weight should propagate up the URL tree, so that a child page's chatbot questions could lift its parent's findings. Of three weights wired in that week, one moved anything. The sharpest signal in the whole dataset, a reference page that drew more than ten chatbot questions per pageview, moved nothing, because that page had no line-level finding for the weight to attach to. Neither did the second most visited page on the site, an entry page that almost every reader left immediately. The question was about ranking one source better. The page was not aggregating anything.",
      "### The page is the unit people act on",
      "A writer opens a page and edits it, so the join key is the route, and every source is attached to the route it names. The content audit's review, which a model wrote for every page on the site and which no page on the dashboard had ever shown, becomes accuracy, clarity, coverage and agent-readiness items with the score beside each. The ledger's findings arrive with their pipeline state: fix ready, held by the fact check, in a draft pull request, needs a decision. The chatbot export is grouped by origin URL and the questions themselves ride along. Journey steps rated partial or missing, open gaps with evidence URLs, mis-pointed journey links, failing embedded examples via the page that references them, and each end-to-end task's resolve rate across every model and mode, with the rescue harness's most frequent findings on that task, all land on the page they name.",
      "The result is several hundred pages with a few thousand action items between them, one dossier each, and a detail route per page that groups every item under the source that produced it. The knowledge suite and the onboarding suite describe topics rather than pages and stay where they were. The one page-level fact the onboarding transcripts do yield is which routes models link readers to that the site no longer has, which is a redirect to add and is listed as such.",
      "### Every item names its source and the measurement",
      "An action item is a sentence a writer can act on, the evidence that produced it, and the source. \"Cover this step fully\" carries the journey that rated the page's coverage of that step as partial, and the journey's own score. \"Answer on the page what readers asked the chatbot from here\" carries the questions. \"Agents working from this page resolved this task in fewer than half their runs\" carries the split by mode. This is the show-the-evidence rule from the gap pages applied to a worklist. The verdict is the item, and a reader who can see the measurement can disagree with it.",
      "### Ranked by readership, with constants read from the join",
      "Pages are ranked by a page weight times a damped evidence weight. The page weight is the product the worklist join already used: traffic bands set from the site's own distribution rather than a constant, repeat visits, scroll depth, bounce on entry pages, chatbot questions per pageview, a failing goal, staleness, a low extractability score, and whether the page sits on a primary reader path. The evidence weight is one plus the log of the severity-weighted item count, so a page with forty low notes does not outrank a page with one wrong signature on a busy path. Every page states its reasons in words: on a primary reader path, failing its own declared goal, top-decile traffic, read twice per visitor, readers stop a quarter of the way down.",
      "The constants are not transcribed. The generator reads them out of the join script's source by name at build time, so the two rankings agree by construction. The provenance diagram on the same page already had a test holding its transcription to that file; this is the same rule, one computation and one implementation, applied before a second implementation could exist.",
      "### What the join exposed in its inputs",
      "Joining the sources read each of them more closely than any page had. The content audit's \"issues\" lists contain praise: a note that a page's figures are accurate is a confirmation, and an action list that says fix this because it is correct is noise, so the few percent of notes that only praise are dropped, and notes that praise and then qualify are kept. Close to nine in ten chatbot questions originate from the homepage widget, which is where a reader opens the chatbot and not what they are asking about, so the homepage is excluded from per-page attribution. The ledger carries findings against the redirect table, which is a file and not a page. The content tree holds include fragments that have findings and no URL. And the end-to-end task definitions reference several documentation URLs that no file in the content tree produces, a defect in the eval definitions that no eval page could have shown.",
      "### Generated at build, committed",
      "The inputs are over a hundred megabytes of reports outside the directory the deployment traces, which is why the previous version of this page rendered an empty shell in production while rendering correctly on a laptop. The dossiers are generated by a prebuild script into a file a few megabytes long that a static import bundles, the page is prerendered with its filters running in the browser, and the generated file is committed so a build without the reports keeps the last good one. Two lessons from earlier in this report, the two pages that disagreed about the same rows and the summary that was a second implementation, are why it is one file read by both the list and the detail route.",
      "## What holds up",
      "Nineteen principles survived contact with the work. Each one is here because violating it cost something specific.",
      "**A switch beats a budget.** A per-run cap on an expensive external call is a promise about aggregate behaviour that any new code path can break without touching the cap. A single enabling variable, read at every call site and defaulting to off, is a fact about whether the call can happen at all. The budget failed twice; the switch has not failed.",
      "**Count the egress paths, not the call sites you remember.** The first cap covered one of several paths to the same server, and the comment above it asserted it was the only one. The assertion was the error, not the code.",
      "**Fail loudly and locally.** A silent empty return from a search that 404s is indistinguishable from \"the docs had nothing to say,\" and that one substitution ran for months producing fact checks that never happened. Every failure path now logs the status before returning the empty value.",
      "**One computation, one implementation.** Several places computed the same quantity twice and drifted: the static grader, two board build scripts, the ledger readers, the board data itself, and a run summary against the rows it summarises. Drift is not a risk of duplication, it is the default outcome.",
      "**The instrument is the first suspect.** Grader drift made a large minority of expectations unpassable. A baseline run read skills off disk and reported a score several points above the truth. A holdout set was empty, which is why its standard deviation was zero. A model scored the same figure on four layers at once. In each case the number looked plausible and the measuring code was wrong.",
      "**The grader is a term in the result, not an implementation detail.** The same onboarding prompts, the same four layers, and the same expectations produce a solid double-digit gain under a judge and roughly nothing under term matching. Any page that mixes runs from two graders without a column saying which is comparing graders while appearing to compare models.",
      "**A diagnostic that only parses the expected shape is not a diagnostic.** The wire logger found the rejection body and discarded it because the body lacked the keys a success carries. Dump first, parse second.",
      "**The prompt is part of the data.** A system prompt that is never recorded is a system prompt that can say `undefined` for months. Record what the model was actually told, because it is the one input every result depends on.",
      "**A model-generated finding is a hypothesis.** Of the machine-generated documentation gaps checked against the documentation, close to half were contradicted by it and a few described something already written. A finding that reaches a writer without a verdict attached is a coin flip on whether the work should be done at all.",
      "**Separate \"write it down\" from \"make it land.\"** A pattern missing from the documentation and a pattern present but ignored look identical in a pass rate and need opposite responses. About a quarter of findings were the second kind, and the field distinguishing them sat in the schema unset until something filled it.",
      "**Gate the check that matters.** A row of cosmetic checks passing underneath a failed build reads as a passing majority when the honest figure is zero, and somebody will act on the majority.",
      "**Record provenance with every number.** Who graded it, which suite version, when, by what source, and which ids were recovered. When a manifest change renamed every question id, those fields are the only reason dozens of runs of existing data could be re-matched by expectation text instead of re-purchased.",
      "**Mark what you cannot compare; do not delete it.** Partial is a label. A run that answered most of the suite is excluded from ranking and fully usable for finding gaps, and the two uses read different lists.",
      "**Show the evidence, not the verdict.** A reader cannot act on \"failed.\" They can act on the judge's reason sitting next to what the model said.",
      "**A precondition that cannot be met is a bug, and declining is not the same as being satisfied.** The oracle's hint path required a file that a different CI job writes with no ordering between them, so it never ran, and it recorded that as \"no intervention needed.\" A guard that cannot pass must fail loudly and name the precondition, never report the outcome it was guarding.",
      "**A comment is not an implementation.** The counterfactual replay was deleted as dead code, and the header of the module that replaced it said the new framework's message tree had made it unnecessary, via an API the harness does not expose. The description of the replacement is what kept anyone from noticing the original was gone. Code that no workflow calls is a question to ask, not a conclusion, and the answer is in who reads its output.",
      "**Zero regressions is a finding, not a success.** Hundreds of matched pairs where one arm never lost is not a strong effect, it is a measurement artifact. Any comparison that is perfectly one-sided is reporting on its own construction.",
      "**Record what differs between the arms, not just the result.** Three modes differed in the skills they loaded, the turn budget they were given, the day they ran, and the checks they were scored against, and every one of those was recoverable from the data only by going and looking. The fingerprint, the turn budget and the dead-run marker are now on the report, because a comparison that cannot state its own conditions should not be rendered.",
      "**Join at the unit people act on.** A dozen measurements, each correct in its own unit, produced no work until every one was keyed to the page a writer would open. A better ranking of one source was the wrong question; the join was the answer, and it exposed defects in four of the sources on the way.",
      "### What this cost and what it is worth",
      "Wasted runs, two of which tested nothing because a boolean input could not be turned off. Four wrong diagnoses of a problem whose cause was in the rejection body the whole time. Months of fact checks that never ran. A proposal to re-purchase data that had never been lost. An onboarding suite whose headline result has the wrong sign in most of its runs. An oracle that never fired its oracle, an A/B that was deleted for looking dead while two pages read its output, and a transformative result that was four uncontrolled variables and a broken day.",
      "Against that: a knowledge suite with a stated noise floor, every model measured on identical questions through one pipeline, an onboarding suite across four context layers, build tasks graded on code that has to compile and now fingerprinted so two runs cannot be compared across a change to the checks, reviewed findings with fact-check verdicts attached, an A/B that says whether each finding belongs to the tooling or to a skill, gap findings that name the failing model and quote its answer, a worklist that puts every one of those measurements under the page it is about with the measurement cited, and a public page whose method a reader can audit at a glance.",
      "The suite now tells us which parts of the documentation models cannot use, with the evidence attached, and the figure moves when the documentation changes and not when the harness does. That last property is the entire point, and it is the one that took the longest to earn. Three of the four pipelines have it. The fourth is the subject of the next round of work."
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
