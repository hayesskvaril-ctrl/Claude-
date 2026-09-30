/* Deeper commentary for Levels 3-4, plus new deep-dive lessons. */
(function () {
  const { code, tip, warn, pro, note, compare, table, steps } = H;
  const C = ACADEMY.commentary;

  ACADEMY.levelIntro.builder = {
    intro: `<p>Coding with an agent is a different skill from coding with autocomplete. You're no longer asking for the next line. You're delegating a task to something that reads the codebase, makes a plan, edits many files, runs the tests, and reports back.</p>
<p>That shift rewards the habits of a good tech lead: clear task definitions, a written-down set of project conventions, a way to verify work, and guardrails around anything risky. This level teaches Claude Code through that lens. The commands matter, but the workflow matters more.</p>`,
    outcomes: ["Install Claude Code and run productive sessions on a real codebase", "Use the explore, plan, code, verify loop", "Encode your team's conventions in CLAUDE.md, skills and hooks", "Connect tools with MCP, delegate to subagents, and automate in CI"],
  };

  ACADEMY.levelIntro.architect = {
    intro: `<p>This level is for people building products on Claude. The Claude API is simple on the surface, a single endpoint that takes messages and returns messages. The depth is in everything around it: tools, structured outputs, caching, context management, evaluation, and operating reliably at scale.</p>
<p>The recurring theme is <strong>start simple and measure</strong>. The best Claude-powered products are rarely the most elaborate. They use the simplest architecture that solves the problem, and they have evals that prove each change is an improvement.</p>`,
    outcomes: ["Call the API correctly, with streaming, thinking and effort", "Build reliable tool-using workflows and agents", "Control cost and latency with caching and batching", "Evaluate quality and run Claude safely in production"],
  };

  C["coding-in-chat"] = {
    why: `Chat is the lowest-friction way to get coding help, and for learning, quick scripts and one-off debugging it's often all you need.`,
    deeper: `<p><strong>Context is everything in debugging.</strong> "My code doesn't work" forces Claude to guess. The full error, the relevant code, the input, and what you expected together usually point straight at the cause. If you're not sure what's relevant, include more rather than less.</p>
<p><strong>Ask for explanations along with fixes.</strong> A fix without an explanation teaches you nothing and may hide a misunderstanding. "Explain the cause, then fix it" helps you catch a wrong diagnosis before you paste code in.</p>
<p><strong>Know when to graduate.</strong> Copying code between a chat window and your editor works for a single file. Once a change spans several files, or you want the tests run, the copying becomes the bottleneck. That's the point to move to Claude Code.</p>`,
    takeaways: ["Paste the full error, code, input and expected result", "Ask for the cause as well as the fix", "Use examples for regex, SQL and formulas", "Move to Claude Code when work spans many files"],
  };

  C["claude-code-intro"] = {
    why: `Claude Code turns Claude from an advisor into a collaborator that can act on your codebase directly. The first session sets habits that last, so it's worth doing deliberately.`,
    deeper: `<p><strong>Start with questions, not changes.</strong> Asking Claude to explain the codebase first does two things. It builds Claude's understanding of the project, and it lets you check that understanding before any edits happen. If it misreads the architecture, you find out cheaply.</p>
<p><strong>Permission prompts are a feature while you learn.</strong> It's tempting to approve everything to go faster. In early sessions, reading each proposed command teaches you how Claude approaches problems, which is exactly the knowledge you need to trust it with more autonomy later.</p>
<p><strong>Interrupting is normal.</strong> Pressing <kbd>Esc</kbd> to redirect isn't a failure. Experienced users interrupt often, early, and briefly: "stop, the config lives in /settings, not /config". Small, early corrections keep a session on track.</p>`,
    takeaways: ["Install, open in your project, and orient Claude first", "Run /init to create CLAUDE.md", "Read permission prompts while you're learning", "Interrupt early to redirect"],
  };

  C["agentic-workflow"] = {
    why: `Agents are fast, which makes it easy to go fast in the wrong direction. This workflow puts the thinking before the typing, where mistakes are cheap to fix.`,
    deeper: `<p><strong>Why planning matters more for agents than for people.</strong> A developer who misunderstands a task usually notices after a few lines. An agent can confidently implement a misunderstanding across ten files in a minute. A plan is a cheap checkpoint: you review a page of text instead of a large diff.</p>
<p><strong>Verification is what makes autonomy safe.</strong> An agent that can run tests can check its own work, find its own bugs, and fix them before you ever see them. Without verification, you are the test suite. Investing in fast, reliable checks pays off in every future session.</p>
<p><strong>Specificity is not micromanagement.</strong> Naming the file, the edge case, and the testing approach doesn't mean you don't trust Claude. It means you're sharing context Claude can't discover on its own, such as which tests matter, and which approach your team prefers.</p>
<p><strong>When to skip planning.</strong> Tiny, well-defined changes, like renaming a variable or fixing a typo, don't need a plan. Use the full loop when a change touches several files, involves design choices, or you're unsure of the approach.</p>`,
    takeaways: ["Explore and plan before coding on anything non-trivial", "Give Claude a way to verify: tests, type checks, screenshots", "Be specific about files, cases and approach", "Clear context between unrelated tasks"],
  };

  C["claude-md"] = {
    why: `CLAUDE.md is how you stop repeating yourself. It's the difference between onboarding Claude every session and having it start each session already knowing the project.`,
    deeper: `<p><strong>Every line is a cost and a promise.</strong> CLAUDE.md is loaded into every session, so it consumes context every time. Long files also dilute the important instructions. A focused 40-line file usually beats a 400-line one. If a line wouldn't change Claude's behavior, cut it.</p>
<p><strong>Write it from observed mistakes.</strong> The best additions come from watching Claude get something wrong. If it uses the wrong test command, add the right one. If it edits generated files, add a warning. This keeps the file grounded in real problems rather than hypothetical ones.</p>
<p><strong>Commands are the highest-value content.</strong> Exact commands for building, testing a single file, linting and type checking let Claude verify its work without guessing. Guessing the wrong command wastes a surprising amount of time.</p>`,
    takeaways: ["Keep CLAUDE.md short, specific and project-relevant", "Include exact commands, conventions and gotchas", "Add lines when you see Claude make a mistake twice", "Commit the shared file; keep personal notes local"],
  };

  C["permissions-settings"] = {
    why: `Autonomy and safety are a trade-off you control. Good permission settings let Claude work quickly on safe actions while stopping it before risky ones.`,
    deeper: `<p><strong>Grant autonomy gradually.</strong> Start in default mode. As you see which commands Claude runs repeatedly and safely (tests, linters, git status), add them to the allow list. Over time, the prompts that remain are the ones worth reading.</p>
<p><strong>Deny rules protect against accidents, not just attacks.</strong> Blocking reads of <code>.env</code> or force pushes isn't about distrust. It's about making sure a misunderstanding can't become an incident.</p>
<p><strong>Untrusted content is the real risk.</strong> The riskiest moment for any agent is when it reads something written by someone else, such as a web page, an issue or a dependency's README, and that content contains instructions. Narrow permissions limit what a successful injection could do.</p>`,
    takeaways: ["Start with default permissions and widen them deliberately", "Allow safe, repetitive commands; deny secrets and destructive actions", "Use plan mode before significant changes", "Treat content from outside as untrusted"],
  };

  C["skills-commands"] = {
    why: `Skills turn "the way we do things here" into something Claude can load on demand. They're how a team's expertise becomes reusable.`,
    deeper: `<p><strong>Skills load progressively.</strong> Claude always sees each skill's short description, but reads the full instructions only when a task calls for them. That means you can have dozens of skills without filling up context, as long as descriptions are clear about when each applies.</p>
<p><strong>Good candidates are procedures, not knowledge.</strong> "How we write release notes", "how we add an API endpoint", "how we triage a bug" are ideal: multi-step, repeatable, and specific to your team. General knowledge Claude already has doesn't need a skill.</p>
<p><strong>Skills can include scripts.</strong> A skill folder can contain helper scripts and templates alongside SKILL.md. Deterministic steps, like generating a changelog from git history, are better as scripts Claude runs than as instructions it interprets.</p>`,
    takeaways: ["A skill is a folder with SKILL.md plus optional files", "The description decides when it loads, so write it carefully", "Encode repeatable team procedures", "Put deterministic steps in scripts"],
  };

  C["hooks"] = {
    why: `Some rules must hold every single time. Hooks enforce them automatically, so you don't rely on Claude remembering.`,
    deeper: `<p><strong>Instructions versus guarantees.</strong> "Always run the formatter" in CLAUDE.md works most of the time. A PostToolUse hook works every time. Use instructions for judgment calls and hooks for rules with no exceptions.</p>
<p><strong>Blocking hooks teach Claude.</strong> When a PreToolUse hook blocks an action and returns a message, Claude reads it and adapts. A clear message like "Edits to migrations/ are blocked; create a new migration instead" turns a hard stop into guidance.</p>
<p><strong>Keep hooks fast.</strong> Hooks run often, sometimes after every edit. A slow hook makes every step slow. Format and lint only the changed file, and save full test runs for the Stop event.</p>`,
    takeaways: ["Use hooks for rules that must always apply", "PreToolUse can block actions; PostToolUse runs checks after", "Return clear messages so Claude can adjust", "Keep hooks fast and review them like code"],
  };

  C["mcp"] = {
    why: `Your codebase is only part of the picture. MCP connects Claude Code to tickets, databases, designs and internal systems, so it works with the same information you do.`,
    deeper: `<p><strong>Start with the tool you switch to most.</strong> If you constantly copy ticket descriptions into Claude, connect your issue tracker. If you paste query results, connect the database with read-only credentials. The best first server removes your most frequent copy-paste.</p>
<p><strong>Scope credentials tightly.</strong> An MCP server acts with whatever access you give it. Read-only database users, limited API tokens and development environments keep mistakes contained.</p>
<p><strong>Share team servers through .mcp.json.</strong> Committing the project config means every developer gets the same tools with no setup instructions to follow. Keep secrets out of the file and use environment variables instead.</p>`,
    takeaways: ["MCP connects Claude Code to external tools and data", "Pick servers that remove your most frequent copy-paste", "Use least-privilege credentials", "Share project servers via .mcp.json"],
  };

  C["subagents"] = {
    why: `Context is a finite resource. Subagents let Claude investigate, review and research without spending the main conversation's context on it.`,
    deeper: `<p><strong>Delegate reading, keep deciding.</strong> The ideal subagent task involves lots of reading and produces a short answer: "find every place we call the payments API and summarize how each handles errors". The main session gets the summary and keeps its context for the actual work.</p>
<p><strong>Fresh eyes catch more.</strong> A reviewer subagent that didn't write the code has no attachment to its approach. That's why writer-reviewer pairs catch bugs a single session misses.</p>
<p><strong>Parallelism needs isolation.</strong> Running several sessions in the same folder causes conflicting edits. Git worktrees give each session its own copy, so they can work on separate branches at once.</p>`,
    takeaways: ["Subagents have their own context, prompt and tools", "Delegate reading-heavy tasks that return short summaries", "Use a separate reviewer for unbiased review", "Use worktrees to run sessions in parallel safely"],
  };

  C["automation-ci"] = {
    why: `Once a workflow works interactively, you can run it automatically: on every pull request, every night, or across hundreds of files.`,
    deeper: `<p><strong>Prove it interactively first.</strong> Automating a flaky workflow just produces flaky results faster. Run the task by hand until the prompt reliably produces what you want, then script it.</p>
<p><strong>Structured output makes automation robust.</strong> Using <code>--output-format json</code> lets your scripts read results reliably instead of parsing prose.</p>
<p><strong>Large migrations work best as a fan-out.</strong> Converting 300 files in one session exhausts context. A loop that runs one focused session per file, each with its own tests, is more reliable and easy to resume if something fails.</p>`,
    takeaways: ["Use claude -p for scripts and pipelines", "Validate a workflow interactively before automating it", "Fan out large migrations one unit at a time", "Restrict tools and use secrets in CI"],
  };

  C["feature-walkthrough"] = {
    why: `Seeing a whole session from start to finish shows how the individual techniques fit together into a working rhythm.`,
    takeaways: ["Orient, plan, implement, verify, ship", "Review the plan before any code is written", "Correct course with short, specific messages", "Finish with tests passing and a clear commit"],
  };

  // ---------- Architect ----------
  C["api-quickstart"] = {
    why: `The API is how Claude becomes part of your product. Getting the basics right (keys, SDK, model IDs) avoids the most common early bugs.`,
    deeper: `<p><strong>Use the official SDK.</strong> The SDKs handle authentication, retries, timeouts, streaming and typed responses. Writing raw HTTP by hand means reimplementing all of that, usually with bugs.</p>
<p><strong>Keep keys out of code.</strong> Environment variables or a secrets manager keep keys out of your repository. Separate keys for development and production make rotation and cost tracking easier.</p>
<p><strong>Read the response structure properly.</strong> The response is a list of content blocks, not a single string. Code that assumes the first block is text will break when a response starts with a thinking or tool block. Always check block types.</p>`,
    takeaways: ["Install the official SDK and read the key from the environment", "Use exact model IDs from the docs", "Iterate over content blocks and check their type", "Start with the default flagship model, then tune"],
  };

  C["messages-anatomy"] = {
    why: `Every Claude feature is a variation on one request shape. Understanding it well makes the rest of the API feel familiar.`,
    deeper: `<p><strong>Statelessness is a feature.</strong> Because you send the full history each time, you control exactly what Claude sees. You can trim, summarize, or insert context. The cost is that history grows, which is why caching and context management matter later.</p>
<p><strong>Always check stop_reason.</strong> <code>max_tokens</code> means the answer was cut off, and treating it as complete is a common bug. <code>tool_use</code> means Claude is waiting for you. <code>refusal</code> means it declined. Branching on stop_reason makes your application behave correctly in each case.</p>
<p><strong>Append the full content back.</strong> When continuing a conversation, append the assistant's complete content (including thinking and tool blocks), not just the text. Dropping blocks can break tool use and features like compaction.</p>`,
    takeaways: ["The API is stateless: send full history each time", "System prompts hold role and rules for the whole conversation", "Branch on stop_reason", "Stream long outputs"],
  };

  C["thinking-effort"] = {
    why: `Effort is the main dial for trading quality against cost and speed on a given model. Tuning it per task is one of the easiest optimizations you can make.`,
    deeper: `<p><strong>Tune effort per route, not globally.</strong> A classification endpoint and a code-generation endpoint have very different needs. Setting effort per use case gives you quality where it matters and savings where it doesn't.</p>
<p><strong>Show a thinking summary in interactive apps.</strong> By default, thinking content isn't shown. For user-facing apps, a summarized display gives people something to watch during longer reasoning, which feels faster than a silent pause.</p>
<p><strong>Re-tune when you change models.</strong> Effort levels and defaults differ between models. An effort setting that was right for one model may be too high or too low for its successor. Your evals tell you which.</p>`,
    takeaways: ["Use adaptive thinking on current models", "Set effort explicitly per use case", "Use summarized thinking display in user-facing apps", "Re-run evals when changing models or effort"],
  };

  C["tool-use"] = {
    why: `Tools are how Claude acts in the world: fetching data, calling your APIs, and taking actions. Nearly every serious Claude application uses them.`,
    deeper: `<p><strong>Tool descriptions are prompts.</strong> Claude decides which tool to use, and with what inputs, based almost entirely on your names and descriptions. A vague description causes wrong or missed calls. Say what the tool does, when to use it, when not to, and what each parameter means.</p>
<p><strong>Errors are information.</strong> Returning a clear error with <code>is_error: true</code> ("order ID not found; IDs look like ORD-1234") lets Claude correct itself. Throwing an exception or returning nothing leaves it stuck.</p>
<p><strong>Parallel calls need one reply.</strong> When Claude requests several tools at once, return all the results together in a single message. Splitting them across messages teaches Claude to stop making parallel calls, which slows everything down.</p>
<p><strong>Design for the model, not your database.</strong> A tool that mirrors a raw API endpoint often returns far more data than needed. A purpose-built tool that returns just the relevant fields saves context and improves accuracy.</p>`,
    takeaways: ["Write clear tool names, descriptions and schemas", "Use strict: true for guaranteed valid inputs", "Return all parallel tool results in one message", "Return helpful errors and compact results"],
  };

  C["structured-outputs"] = {
    why: `When code consumes Claude's output, parsing failures become production bugs. Structured outputs remove that entire class of problem.`,
    deeper: `<p><strong>Guaranteed format, not guaranteed truth.</strong> Structured outputs ensure the JSON matches your schema. They don't ensure the values are correct. You still need evals and validation of the content itself.</p>
<p><strong>Use enums wherever you can.</strong> A free-text "category" field invites near-duplicates ("Bug", "bug", "Defect"). An enum forces one of your exact values, which makes downstream logic simple.</p>
<p><strong>Give the model room to reason when needed.</strong> For hard judgments, include a short "reasoning" field before the final decision in your schema, or rely on adaptive thinking. Forcing an instant label on a difficult case lowers accuracy.</p>`,
    takeaways: ["Use structured outputs whenever code reads the response", "Prefer enums and required fields", "Validate the content, not just the shape", "Use messages.parse with typed models where available"],
  };

  C["context-files"] = {
    why: `Much of the value in business applications comes from reading real documents accurately. Citations make that accuracy checkable by users.`,
    deeper: `<p><strong>Citations build user trust.</strong> An answer that links each claim to a page lets users verify it in one click. That is often the difference between a tool people rely on and one they double-check by hand.</p>
<p><strong>Upload once, reference many times.</strong> For documents used across many requests, the Files API avoids re-sending large files and keeps request payloads small.</p>
<p><strong>Big context doesn't mean dump everything.</strong> Large context windows are powerful, but relevance still matters. Sending the three relevant documents usually beats sending thirty, both for accuracy and cost.</p>`,
    takeaways: ["Send PDFs and images as content blocks", "Enable citations when users need to verify", "Use the Files API for reused documents", "Send what's relevant, even with a large context window"],
  };

  C["caching-cost"] = {
    why: `Cost and latency decide whether an AI feature is viable at scale. Caching and batching are usually the biggest, easiest savings available.`,
    deeper: `<p><strong>Design prompts for caching from the start.</strong> Order your request from most stable to least stable: tools, then system prompt, then shared documents, then the conversation, then the new question. This single habit makes caching work almost automatically.</p>
<p><strong>Hunt silent invalidators.</strong> A timestamp in the system prompt, a user's name near the top, randomly ordered tool definitions: each one changes the prefix and breaks the cache. If cache reads are zero, look for something that changes every request.</p>
<p><strong>Measure cost per completed task.</strong> A cheaper model that needs three attempts can cost more than a capable one that succeeds first time. Track what it costs to get a correct result, not what a single request costs.</p>`,
    takeaways: ["Put stable content first and cache it", "Check cache_read_input_tokens to confirm hits", "Use batches for non-urgent bulk work", "Optimize cost per successful task"],
  };

  C["agents"] = {
    why: `Agents are powerful but expensive, slower and harder to test than simpler designs. Knowing when to build one, and how, prevents a lot of wasted effort.`,
    deeper: `<p><strong>Most problems don't need an agent.</strong> If you can write down the steps in advance, a workflow with fixed steps is cheaper, faster and easier to debug. Agents shine when the path genuinely depends on what's discovered along the way, such as debugging, research, or open-ended tasks.</p>
<p><strong>Context is the agent's scarcest resource.</strong> Long-running agents fill their context with tool results. Techniques that keep it clean (compact tool outputs, clearing old results, summarizing, and delegating to sub-agents) often matter more than a smarter prompt.</p>
<p><strong>Give agents a definition of done.</strong> Without a clear finish line, agents either stop too early or keep going. "Done means all tests pass and the PR description lists every changed endpoint" gives it something to aim at and to check against.</p>`,
    takeaways: ["Use the simplest tier that works: call, workflow, then agent", "Choose manual loop, Tool Runner, Agent SDK or Managed Agents by who should run the loop", "Manage context deliberately", "Build in verification and guardrails"],
  };

  C["context-engineering"] = {
    why: `As tasks get longer, what the model sees matters more than how you phrase the prompt. Context engineering is the craft of curating that view.`,
    takeaways: ["Treat context as a budget and spend it on what matters now", "Keep tool results compact and clear old ones", "Give long tasks external memory: progress files, notes, tests", "Delegate reading-heavy subtasks to sub-agents"],
  };

  C["build-mcp-server"] = {
    why: `Building an MCP server once lets every MCP-capable client, including Claude apps and Claude Code, use your tool without custom integration work.`,
    takeaways: ["An MCP server exposes tools, resources and prompts", "The official SDKs make a server a few dozen lines", "Tool descriptions matter as much as in the API", "Scope credentials tightly and validate inputs"],
  };

  C["evals"] = {
    why: `Without evals, every prompt change is a guess. With them, you can improve steadily and upgrade models with confidence.`,
    deeper: `<p><strong>Start small and real.</strong> Twenty real examples you've looked at closely beat a thousand synthetic ones. Add every production failure you find to the set. Over time it becomes a precise description of what "good" means for your product.</p>
<p><strong>Code graders first, model graders second.</strong> Whenever something can be checked exactly (a category, a number, valid JSON, a passing test), check it with code. Use an LLM judge for open-ended qualities like tone or helpfulness, and spot-check the judge against human ratings.</p>
<p><strong>Watch for overfitting.</strong> If you tune a prompt against the same examples over and over, it can improve on those examples while getting worse in general. Keep a held-out set you only check occasionally.</p>`,
    takeaways: ["Define measurable success criteria", "Build the set from real inputs and past failures", "Grade with code where possible, rubrics where not", "Change one thing at a time and keep a held-out set"],
  };

  C["production"] = {
    why: `Demos work on good days. Production has to work on bad ones too: rate limits, odd inputs, refusals, and model upgrades.`,
    deeper: `<p><strong>Design for failure paths.</strong> Rate limits, timeouts, truncated responses and refusals will all happen at scale. Decide in advance what users see in each case. A friendly retry message beats a stack trace.</p>
<p><strong>Log enough to debug.</strong> When a user reports a bad answer, you need the exact request and response to reproduce it. Log inputs, outputs, model, settings, usage and stop reason, with appropriate privacy controls.</p>
<p><strong>Upgrade models like dependencies.</strong> New models are usually better, but behavior and defaults change. Pin a model ID, run your evals on the new one, read its migration notes, then switch deliberately.</p>`,
    takeaways: ["Handle retryable and non-retryable errors differently", "Plan user experiences for truncation and refusals", "Treat all external content as untrusted", "Log thoroughly and upgrade models deliberately"],
  };

  // ---------- New lessons ----------
  ACADEMY.extraLessons.push({
    level: "builder",
    after: "agentic-workflow",
    lesson: {
      id: "feature-walkthrough",
      title: "Walkthrough: a feature from start to finish",
      minutes: 13,
      summary: "A complete Claude Code session on a realistic task, with commentary on each decision.",
      body: `
<p>The task: add a "forgot password" flow to a web app. It touches the database, email, API routes and UI, which makes it a good example of a change that benefits from the full workflow.</p>

<h2>Step 1: Orient</h2>
${code("prompt", `
Read the auth code in src/auth/ and the user model in src/db/. Don't change
anything. Explain how signup and login work today, where emails are sent from,
and how tests are organized.
`, "You")}
<p><strong>Commentary:</strong> This costs a minute and prevents the biggest failure mode: Claude building a parallel system because it didn't notice the existing one. Reading the explanation also tells you whether Claude understood the code correctly.</p>

<h2>Step 2: Plan in plan mode</h2>
${code("prompt", `
Plan a forgot-password flow: request a reset by email, a single-use token that
expires after 30 minutes, a reset form, and invalidating existing sessions after
a reset. Reuse the existing email service. List files to change, the data model
change, the tests you'll write, and any security concerns.
`, "You (plan mode)")}
<p><strong>Commentary:</strong> The prompt states the requirements that matter for security (single use, expiry, session invalidation) instead of hoping Claude includes them. Asking for "security concerns" invites it to raise things you didn't think of, like not revealing whether an email address has an account.</p>

<h2>Step 3: Review and edit the plan</h2>
${code("prompt", `
Good plan. Two changes: store a hash of the token, not the token itself, and
rate-limit reset requests to 3 per hour per email. Then go ahead.
`, "You")}
<p><strong>Commentary:</strong> This is where your expertise has the most leverage. Two sentences of review here would have been two rounds of rework after implementation.</p>

<h2>Step 4: Implement with tests first</h2>
<p>Claude writes failing tests for the token lifecycle and rate limit, confirms they fail, then implements until they pass. You glance at the edits as they happen and interrupt once:</p>
${code("prompt", `
Stop. Don't add a new email template engine; templates live in src/email/templates.
`, "You")}
<p><strong>Commentary:</strong> An early, short correction. Waiting until the end would mean undoing a whole subsystem.</p>

<h2>Step 5: Verify end to end</h2>
${code("prompt", `
Run the full test suite and the type checker. Then start the dev server and walk
through the flow in the browser: request a reset, use the link, confirm the old
session is logged out. Report anything that looks wrong.
`, "You")}
<p><strong>Commentary:</strong> Unit tests prove the parts work; the end-to-end check proves they work together. This is the step people most often skip, and where integration bugs hide.</p>

<h2>Step 6: Ship</h2>
${code("prompt", `
Commit with a clear message and open a PR. In the description, summarize the
flow, the security decisions (hashed tokens, expiry, rate limit, session
invalidation), and how to test it manually.
`, "You")}
<p><strong>Commentary:</strong> A good PR description helps your human reviewers, and asking for it makes Claude summarize what it actually did, which is one last chance to spot a gap.</p>

${pro("What made this session work", "The requirements were explicit, the plan was reviewed, tests came first, corrections were early and short, and verification covered the whole flow. None of those steps is complicated. Doing all of them consistently is what separates great results from average ones.")}
`,
    },
  });

  ACADEMY.extraLessons.push({
    level: "architect",
    after: "agents",
    lesson: {
      id: "context-engineering",
      title: "Context engineering for long-running agents",
      minutes: 12,
      summary: "Curating what the model sees over long tasks: compaction, clearing, memory, progress files and sub-agents.",
      body: `
<p>A prompt is written once. Context accumulates. In a long agent run, the instructions you wrote are soon a small fraction of what the model sees; the rest is tool calls, results, files and its own previous reasoning. <strong>Context engineering</strong> is managing that accumulated view so the model keeps seeing what matters.</p>

<h2>Why context degrades</h2>
<ul>
  <li><strong>Volume:</strong> tool outputs like file contents, search results and logs are large, and they pile up.</li>
  <li><strong>Staleness:</strong> results from an hour ago may describe files that have since changed.</li>
  <li><strong>Dilution:</strong> the more there is, the harder it is for the important parts to stand out.</li>
</ul>

<h2>The toolkit</h2>
${table(["Technique", "What it does", "Use when"], [
  ["Compact tool results", "Tools return only the fields needed, not raw dumps", "Always. It's the cheapest win"],
  ["Context editing", "Clears old tool results (or thinking) from the history automatically", "Many tool calls whose results are no longer needed"],
  ["Compaction", "Summarizes earlier conversation when it grows large", "Very long sessions that must keep going"],
  ["Memory / progress files", "The agent writes notes to a file and re-reads them", "Multi-hour tasks, or work that spans sessions"],
  ["Sub-agents", "Delegate reading-heavy side tasks; only summaries return", "Research, codebase exploration, reviewing many files"],
  ["Just-in-time retrieval", "Store references (paths, IDs) and load details when needed", "Large knowledge bases or codebases"],
])}

<h2>External memory in practice</h2>
<p>For long tasks, have the agent keep its state outside the context window, in a file it updates and can always re-read:</p>
${code("markdown", `
# progress.md
## Goal
Migrate all API handlers from callbacks to async/await. Done = all tests pass.

## Status
- [x] users.js (tests pass)
- [x] orders.js (tests pass)
- [ ] payments.js: in progress, refund path still uses callbacks
- [ ] reports.js

## Notes
- Shared helper withRetry() in lib/retry.js already supports promises.
- Don't touch legacy/ (scheduled for deletion).
`, "progress.md")}
<p>If the context is compacted or a new session starts, the agent reads this file and picks up where it left off. Tests act as a second, objective memory of what works.</p>

<h2>Principles</h2>
<ul>
  <li><strong>Treat context as a budget.</strong> Every token should earn its place in the model's view.</li>
  <li><strong>Put the full task up front.</strong> Goals, constraints and the definition of done at the start anchor everything that follows.</li>
  <li><strong>Append, don't rewrite.</strong> Keep history append-only where possible. Rewriting earlier turns can break caching and invalidate earlier reasoning on current models.</li>
  <li><strong>Prefer structure over prose for state.</strong> Checklists, JSON status files and test results are easier to re-read reliably than paragraphs.</li>
</ul>
${pro("A useful test", "Pause a long agent run and read its context as if you were the model. Is the current goal obvious? Is most of what you see still relevant? If not, that's where to engineer.")}
`,
    },
  });

  ACADEMY.extraLessons.push({
    level: "architect",
    after: "tool-use",
    lesson: {
      id: "build-mcp-server",
      title: "Build your own MCP server",
      minutes: 11,
      summary: "Expose your own tools and data to Claude apps, Claude Code and agents through the Model Context Protocol.",
      body: `
<p>Tool use in the API connects Claude to your code for one application. An <strong>MCP server</strong> packages tools so that any MCP-capable client can use them: the Claude apps, Claude Code, the Agent SDK and many third-party tools. Write it once, use it everywhere.</p>

<h2>What a server exposes</h2>
${table(["Primitive", "What it is", "Example"], [
  ["Tools", "Functions the model can call", "search_tickets, create_invoice"],
  ["Resources", "Data the client can read", "A config file, a database schema"],
  ["Prompts", "Reusable prompt templates", "\"Summarize this incident\""],
])}

<h2>A minimal server in Python</h2>
${code("bash", `
pip install "mcp[cli]"
`, "Terminal")}
${code("python", `
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("inventory")

STOCK = {"SKU-100": 42, "SKU-200": 0, "SKU-300": 7}

@mcp.tool()
def check_stock(sku: str) -> str:
    """Return how many units of a product are in stock.

    Use when the user asks about availability or stock levels.
    SKUs look like SKU-100.
    """
    if sku not in STOCK:
        return f"Unknown SKU {sku}. Valid SKUs look like SKU-100."
    return f"{sku}: {STOCK[sku]} units in stock"

if __name__ == "__main__":
    mcp.run()  # communicates over stdio by default
`, "inventory_server.py")}
${code("bash", `
claude mcp add inventory -- python inventory_server.py
`, "Connect it to Claude Code")}

<h2>Design advice</h2>
<ul>
  <li><strong>Docstrings are the tool descriptions.</strong> Write them for the model: what it does, when to use it, what inputs look like.</li>
  <li><strong>Return helpful errors.</strong> An error that explains valid inputs lets the model correct itself.</li>
  <li><strong>Build around tasks, not endpoints.</strong> "find_customer_by_email" beats a generic "api_get" with a URL parameter.</li>
  <li><strong>Local or remote.</strong> Local (stdio) servers are great for personal tools. Remote (HTTP) servers with proper authentication suit shared team and company tools.</li>
</ul>
${warn("Security", "Your server runs with the credentials you give it. Use least-privilege access, validate every input, and be cautious with tools that write, delete or send.")}
`,
    },
  });
})();
