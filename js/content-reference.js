/* Reference material: prompt library, cheat sheets, glossary, learning paths. */
(function () {
  ACADEMY.prompts = [
    { cat: "Writing", title: "Rewrite for an audience", use: "Adapt any text for a different reader.", text: `Rewrite the text below for {{AUDIENCE}}.

Goal: {{WHAT THEY SHOULD DO OR UNDERSTAND AFTER READING}}
Keep: all facts, numbers and commitments.
Change: vocabulary, length, and order to suit the reader.
Length: about {{N}} words.

<text>
{{PASTE}}
</text>` },
    { cat: "Writing", title: "Hard email, kind tone", use: "Say no, chase, or deliver bad news without burning bridges.", text: `Help me write an email to {{WHO}} about {{SITUATION}}.

What I need to happen: {{OUTCOME}}
Relationship: {{e.g. important client, my manager, new colleague}}
Tone: direct but warm. No apologies I don't mean, no corporate filler.

Give me two versions: one short (under 80 words) and one fuller.` },
    { cat: "Writing", title: "Editor, not ghostwriter", use: "Feedback that improves your writing without replacing your voice.", text: `Act as a sharp but supportive editor. Don't rewrite my piece.
Instead give me:
1. The single biggest problem, and why it matters
2. Up to 5 specific line-level suggestions (quote the line, then suggest)
3. What's working and should stay

<draft>
{{PASTE}}
</draft>` },
    { cat: "Thinking", title: "Decision matrix", use: "Compare options against weighted criteria.", text: `I'm deciding between: {{OPTIONS}}.
Context: {{SITUATION, CONSTRAINTS, WHAT I CARE ABOUT}}

1. Propose 5-7 criteria and suggested weights; ask me to confirm or adjust.
2. After I confirm, score each option 1-5 per criterion in a table, with a one-line reason per score.
3. Give a recommendation, the biggest risk, and what would change your mind.` },
    { cat: "Thinking", title: "Pre-mortem", use: "Find the failure points before you start.", text: `It's 6 months from now and {{PROJECT}} has failed badly.
Write the post-mortem: the 7 most likely reasons it failed, ranked by likelihood x impact.
For each, give an early warning sign and one cheap thing I can do now to prevent it.

Project details:
{{DETAILS}}` },
    { cat: "Thinking", title: "Interview me first", use: "When you're not sure what to ask for.", text: `I want to {{GOAL}}.
Before producing anything, interview me. Ask one question at a time, up to 8 questions,
choosing each based on my previous answers. When you have enough, say "Ready"
and produce {{DELIVERABLE}}.` },
    { cat: "Analysis", title: "Document Q&A with quotes", use: "Grounded answers from long documents.", text: `<document>
{{PASTE OR ATTACH}}
</document>

Question: {{QUESTION}}

First, extract the relevant quotes into <quotes> tags.
Then answer using only those quotes, citing each one.
If the document doesn't answer the question, say "Not in the document".` },
    { cat: "Analysis", title: "Data first look", use: "Understand a new spreadsheet or CSV quickly.", text: `I've attached {{DATASET}}. I'm trying to understand {{QUESTION}}.

1. Describe the columns, data types, and any quality issues (missing values, outliers, duplicates)
2. Give the 5 most interesting findings, each with the numbers behind it
3. Make the one chart that best answers my question
4. List 3 follow-up questions worth investigating` },
    { cat: "Analysis", title: "Meeting notes to actions", use: "Turn a transcript into decisions and owners.", text: `From the transcript below, produce:
- Decisions made (one line each)
- Action items as a table: owner | task | due date (write "unassigned" or "no date" if unclear)
- Open questions
- A 3-sentence summary for people who missed it

Don't invent owners or dates.

<transcript>
{{PASTE}}
</transcript>` },
    { cat: "Learning", title: "Socratic tutor", use: "Learn by being asked, not told.", text: `Teach me {{TOPIC}}. My current level: {{LEVEL}}.
Use the Socratic method: ask me questions that lead me to the idea, one at a time.
If I'm wrong, give a hint rather than the answer. After every 3 questions,
summarize what I've learned. Finish with a 5-question quiz.` },
    { cat: "Learning", title: "Explain it three ways", use: "Build real understanding of a hard concept.", text: `Explain {{CONCEPT}} three ways:
1. An everyday analogy
2. A precise technical explanation
3. A worked example with numbers
Then list the 3 most common misconceptions about it.` },
    { cat: "Coding", title: "Debug with full context", use: "Get to the root cause, not a guess.", text: `I have a bug.

Expected: {{WHAT SHOULD HAPPEN}}
Actual: {{WHAT HAPPENS}}
Steps to reproduce: {{STEPS}}

Error / stack trace:
{{PASTE}}

Relevant code:
{{PASTE}}

List the most likely root causes in order, how to confirm each one,
then the fix for the most likely one.` },
    { cat: "Coding", title: "Code review", use: "A focused, ranked review.", text: `Review this code as a senior engineer. Focus on:
correctness bugs, security issues, edge cases, performance, and readability, in that order.

For each finding: location, severity (critical/high/medium/low), what goes wrong
with a concrete input, and the fix. Don't comment on style unless it hides a bug.
If it's solid, say so.

{{CODE OR DIFF}}` },
    { cat: "Coding", title: "Claude Code: plan a feature", use: "Kick off a feature in plan mode.", text: `I want to add {{FEATURE}}.

Explore first: read the relevant parts of the codebase and explain how {{RELATED AREA}} works today.
Then write a plan: files to change, new files, data model changes, tests to add,
and risks. Don't write code until I approve the plan.

Constraints: {{e.g. no new dependencies, keep the public API unchanged}}
Definition of done: {{e.g. tests pass, pnpm check is clean, works in the UI}}` },
    { cat: "Coding", title: "Claude Code: fix with a failing test", use: "Reliable bug fixes.", text: `Bug: {{DESCRIPTION}}

1. Find the relevant code and explain the cause.
2. Write a test that reproduces the bug and confirm it fails.
3. Fix the bug with the smallest reasonable change.
4. Run the test suite and the linter; fix anything you broke.
5. Summarize the change in a commit message.` },
    { cat: "Building", title: "System prompt skeleton", use: "A starting structure for an API app.", text: `You are {{ROLE}} for {{PRODUCT}}, helping {{USERS}} with {{JOB}}.

<context>
{{WHAT THE MODEL NEEDS TO KNOW: product facts, policies, tone}}
</context>

<guidelines>
- {{BEHAVIOR 1, with the reason why}}
- {{BEHAVIOR 2, with the reason why}}
- When information isn't in <context>, say you don't know and offer {{ESCALATION PATH}}.
</guidelines>

<output_format>
{{LENGTH, STRUCTURE, TONE}}
</output_format>` },
    { cat: "Building", title: "Eval case generator", use: "Bootstrap a test set for your app.", text: `I'm building {{APP}}. Real users send things like:
{{3-5 REAL EXAMPLES}}

Generate 30 test inputs that cover: typical cases (50%), edge cases (30%), and
adversarial or out-of-scope cases (20%). For each, give the input, the category,
and what a correct response must do. Output as JSON lines.` },
    { cat: "Building", title: "Write the prompt for me", use: "The meta-prompt.", text: `I want Claude to {{TASK}} for {{AUDIENCE/SYSTEM}}.
Good output looks like: {{DESCRIPTION OR EXAMPLE}}
Common failure modes I want to avoid: {{LIST}}

Write the best possible prompt for this. Use XML tags for structure, explain the
"why" behind important instructions, and include 2 varied examples.
Ask me questions first if anything important is missing.` },
  ];

  ACADEMY.sheets = [
    { title: "Claude Code: commands", rows: [
      ["claude", "Start an interactive session"],
      ["claude -p \"…\"", "Run one prompt headlessly"],
      ["claude -c", "Continue the most recent conversation"],
      ["claude -r", "Resume a past conversation"],
      ["/init", "Generate CLAUDE.md for the project"],
      ["/clear", "Clear context and start fresh"],
      ["/compact", "Summarize context to free space"],
      ["/context", "Show context window usage"],
      ["/model", "Switch model"],
      ["/memory", "Edit memory (CLAUDE.md) files"],
      ["/permissions", "Manage allow and deny rules"],
      ["/agents", "Create and manage subagents"],
      ["/hooks", "Configure hooks"],
      ["/mcp", "Manage MCP servers"],
      ["/help", "List all commands"],
    ] },
    { title: "Claude Code: keys and syntax", rows: [
      ["Shift+Tab", "Cycle permission modes (incl. plan mode)"],
      ["Esc", "Interrupt Claude"],
      ["Esc Esc", "Rewind to an earlier point"],
      ["@file", "Reference a file or folder"],
      ["!cmd", "Run a shell command"],
      ["CLAUDE.md", "Project memory, loaded every session"],
      [".claude/settings.json", "Permissions, hooks, env (shared)"],
      [".claude/skills/", "Project skills (SKILL.md)"],
      [".claude/agents/", "Project subagents"],
      [".mcp.json", "Project MCP servers"],
    ] },
    { title: "API: request essentials", rows: [
      ["model", "claude-opus-5-5, claude-sonnet-5-5, claude-haiku-4-5, claude-fable-5-1"],
      ["max_tokens", "Output cap. ~16000 non-streaming, ~64000 streaming"],
      ["system", "Instructions for the whole conversation"],
      ["messages", "Full user/assistant history every time"],
      ["tools", "Custom tools, or Anthropic-hosted ones like web search"],
      ["thinking", "{type: \"adaptive\"}"],
      ["output_config", "{effort: …, format: {type: \"json_schema\", …}}"],
      ["cache_control", "{type: \"ephemeral\"} to cache a prefix"],
    ] },
    { title: "API: stop reasons", rows: [
      ["end_turn", "Finished normally"],
      ["max_tokens", "Hit the cap; output is truncated"],
      ["tool_use", "Wants you to run a tool"],
      ["pause_turn", "Server tool paused a long turn; send it back to continue"],
      ["refusal", "Declined by safety systems; check stop_details"],
      ["stop_sequence", "Hit one of your stop sequences"],
    ] },
    { title: "Prompting: the essentials", rows: [
      ["Clear", "Say exactly what you want, including ambition"],
      ["Context", "Audience, purpose, and why"],
      ["Examples", "1-3 varied examples of good output"],
      ["Structure", "<tags> around instructions and material"],
      ["Role", "A specific expert perspective"],
      ["Format", "Say what to do; give length and shape"],
      ["Grounding", "Quotes first; allow \"I don't know\""],
      ["Verify", "Ask Claude to check its work"],
    ] },
    { title: "Which model when", rows: [
      ["Fable 5.1", "Hardest problems, long autonomous work"],
      ["Opus 5.5", "Default for complex work and coding"],
      ["Sonnet 5.5", "Fast everyday work, lower cost"],
      ["Haiku 4.5", "High volume, real-time, sub-agents"],
      ["Tip", "Try a bigger model at lower effort before a cascade"],
    ] },
  ];

  ACADEMY.glossary = [
    ["Context engineering", "Curating what a model sees over a long task: compact tool results, clearing, compaction, memory files and sub-agents."],
    ["Knowledge cutoff", "The date after which a model's training data stops; it won't know later events without search."],
    ["Agent", "A system where the model decides which steps and tools to use in a loop until a goal is met."],
    ["Agent SDK", "A library (Python, TypeScript) that provides Claude Code's agent loop, tools and context management for building your own agents."],
    ["Artifact", "A standalone piece of content Claude creates in its own panel: documents, web pages, apps, diagrams."],
    ["Batch API", "Asynchronous bulk processing of many requests at a discount."],
    ["Caching (prompt)", "Reusing a previously processed prompt prefix to cut cost and latency."],
    ["CLAUDE.md", "A markdown file Claude Code loads into every session as project memory."],
    ["Claude Code", "Anthropic's agentic coding tool for terminal, IDEs, desktop and web."],
    ["Compaction", "Summarizing earlier conversation to free up context in long sessions."],
    ["Connector", "A secure link between Claude and another app, such as Drive, Gmail or Slack."],
    ["Context window", "The maximum amount of text (in tokens) the model can consider at once."],
    ["Effort", "An API setting (low to max) that trades thoroughness against speed and token spend."],
    ["Eval", "A set of test inputs plus a grading method used to measure quality."],
    ["Hallucination", "A confident but false statement produced by a model."],
    ["Hook", "A shell command Claude Code runs automatically at a lifecycle event."],
    ["LLM", "Large language model: a model trained on large amounts of text to predict and generate language."],
    ["LLM-as-judge", "Using a model with a rubric to grade another model's output."],
    ["MCP", "Model Context Protocol, an open standard for connecting AI applications to tools and data."],
    ["Managed Agents", "An Anthropic-hosted service that runs the agent loop and a per-session sandbox for you."],
    ["Plan mode", "A read-only Claude Code mode for researching and proposing a plan before changing code."],
    ["Project", "A claude.ai workspace with its own knowledge files and instructions."],
    ["Prompt", "Everything you give the model: instructions, context, examples and material."],
    ["Prompt injection", "Malicious instructions hidden in content an AI reads, aimed at hijacking its behavior."],
    ["Refusal", "When Claude declines a request; in the API, stop_reason \"refusal\"."],
    ["Research", "A claude.ai mode that runs many searches and produces a cited report."],
    ["Skill", "A folder of instructions (SKILL.md) and resources that Claude loads when relevant."],
    ["Stop reason", "Why a response ended: end_turn, max_tokens, tool_use, refusal, and others."],
    ["Streaming", "Receiving the response incrementally as it's generated."],
    ["Structured outputs", "API feature guaranteeing responses match a JSON schema."],
    ["Subagent", "A separate Claude instance with its own context, used for a delegated task."],
    ["System prompt", "Instructions that frame the whole conversation: role, rules, context."],
    ["Thinking (adaptive)", "The model reasoning before answering, deciding for itself how much to think."],
    ["Token", "A chunk of text (roughly a short word or part of a word). Models read and are billed in tokens."],
    ["Tool use", "The model requesting that your code run a function and return the result."],
    ["Worktree", "A git feature for checking out several branches in separate folders, handy for parallel agents."],
  ];

  ACADEMY.paths = [
    { title: "Writers, marketers and communicators", lc: "--l2", steps: ["first-conversation", "prompting-fundamentals", "prompt-teardown", "projects", "personalize", "artifacts", "research"] },
    { title: "Analysts and researchers", lc: "--l1", steps: ["files-and-images", "advanced-prompting", "research", "connectors", "artifacts", "structured-outputs"] },
    { title: "Managers and team leads", lc: "--l4", steps: ["what-is-claude", "safety-privacy", "everyday-uses", "projects", "connectors", "common-mistakes"] },
    { title: "Software developers", lc: "--l3", steps: ["coding-in-chat", "claude-code-intro", "agentic-workflow", "feature-walkthrough", "claude-md", "skills-commands", "subagents", "automation-ci"] },
    { title: "AI product engineers", lc: "--l4", steps: ["api-quickstart", "messages-anatomy", "tool-use", "structured-outputs", "caching-cost", "agents", "context-engineering", "build-mcp-server", "evals", "production"] },
    { title: "Students and learners", lc: "--l1", steps: ["how-claude-works", "what-is-claude", "first-conversation", "safety-privacy", "prompting-fundamentals", "personalize"] },
  ];
})();
