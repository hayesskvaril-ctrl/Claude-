/* Level 3 — Builder: coding with Claude, centered on Claude Code. */
(function () {
  const { code, tip, warn, pro, note, compare, table, steps, exercise } = H;

  ACADEMY.levels.push({
    id: "builder",
    n: 3,
    name: "Builder",
    color: "--l3",
    tagline: "Code with Claude. Claude Code from install to custom skills, hooks, MCP servers, subagents and CI.",
    audience: "Developers and technical users",
    lessons: [
      {
        id: "coding-in-chat",
        title: "Coding with Claude in chat",
        minutes: 7,
        summary: "Before agents: using the chat app to explain, write, debug and review code effectively.",
        body: `
<p>You don't need any setup to get real coding value from Claude. The chat app is great for learning, one-off scripts and debugging.</p>
<h2>High-value chat patterns</h2>
${table(["Task", "Prompt pattern"], [
  ["Explain code", "\"Explain this function line by line, then tell me what could break.\""],
  ["Debug", "Paste the <strong>full error, the code, and what you expected</strong>. \"Here's the stack trace, the function, and the input that fails.\""],
  ["Write a script", "\"Python script that renames all .jpg files in a folder by date taken. Handle missing EXIF data.\""],
  ["Review", "\"Review this for bugs, security issues and readability. Rank findings by severity.\""],
  ["Learn", "\"I know JavaScript. Teach me Rust ownership using JS comparisons, with exercises.\""],
  ["Regex, SQL, formulas", "Describe it in English with 2 to 3 example inputs and expected outputs."],
])}
${tip("Always include the error", "The exact error message and stack trace are worth more than any description of the problem.")}
<p>When your work spans many files, or you want Claude to run the code and tests itself, move up to Claude Code.</p>
`,
      },
      {
        id: "claude-code-intro",
        title: "Claude Code: install and first session",
        minutes: 10,
        summary: "Install Claude Code, open it in a project, and complete your first real task.",
        body: `
<p><strong>Claude Code</strong> is an agentic coding tool. It reads your codebase, edits files, runs commands and tests, and works with git. It runs in the terminal, in VS Code and JetBrains IDEs, in the desktop app, and on the web at claude.ai/code, where tasks run in a cloud environment.</p>

<h2>Install</h2>
${code("bash", `
# macOS, Linux, WSL (native installer)
curl -fsSL https://claude.ai/install.sh | bash

# or with npm (Node.js 18+)
npm install -g @anthropic-ai/claude-code

# start it inside your project
cd my-project
claude
`, "Terminal")}
<p>The first run asks you to sign in with your Claude account (Pro, Max, Team or Enterprise) or a Claude Console API account.</p>

<h2>Your first session</h2>
${steps([
  "<strong>Orient.</strong> Ask: \"Give me an overview of this codebase: structure, main entry points, how to run tests.\"",
  "<strong>Create memory.</strong> Run <code>/init</code> to generate a <code>CLAUDE.md</code> file describing the project.",
  "<strong>Pick a small task.</strong> \"Add input validation to the signup form and a test for it.\"",
  "<strong>Watch and approve.</strong> Claude asks permission before editing files and running commands. Read what it proposes.",
  "<strong>Review the diff</strong> and ask Claude to commit with a clear message.",
])}

<h2>Essential controls</h2>
${table(["Keys / command", "What it does"], [
  ["<kbd>Shift</kbd>+<kbd>Tab</kbd>", "Cycle permission modes, including auto-accept edits and plan mode"],
  ["<kbd>Esc</kbd>", "Interrupt Claude so you can redirect it"],
  ["<kbd>Esc</kbd> <kbd>Esc</kbd>", "Rewind to an earlier point in the conversation"],
  ["<code>@path/to/file</code>", "Reference a file or folder in your message"],
  ["<code>!command</code>", "Run a shell command directly"],
  ["<code>/clear</code>", "Start fresh context (do this between unrelated tasks)"],
  ["<code>/compact</code>", "Summarize the conversation to free up context"],
  ["<code>/context</code>", "See what's using the context window"],
  ["<code>/model</code>", "Switch models"],
  ["<code>/help</code>", "List all commands"],
])}
`,
      },
      {
        id: "agentic-workflow",
        title: "The winning workflow: explore, plan, code, verify",
        minutes: 12,
        summary: "The loop experienced engineers use to get reliable results from coding agents on real codebases.",
        body: `
<p>The biggest mistake new users make is jumping straight to "build it". Great results come from a deliberate loop.</p>
${steps([
  "<strong>Explore.</strong> \"Read the auth module and the user model. Don't write code yet. Tell me how login works today.\"",
  "<strong>Plan.</strong> Switch to plan mode (<kbd>Shift</kbd>+<kbd>Tab</kbd>) and ask for a step-by-step plan. Challenge it. Edit it. Approve it.",
  "<strong>Code.</strong> Let Claude implement the plan. Interrupt early with <kbd>Esc</kbd> if it heads the wrong way.",
  "<strong>Verify.</strong> Claude runs tests, type checks, linters, or the app itself. Give it a way to check its own work.",
  "<strong>Commit.</strong> Ask for a commit and a pull request with a clear description.",
])}

<h2>Give Claude a way to check its work</h2>
<p>Agents are dramatically better when they can verify results themselves:</p>
<ul>
  <li><strong>Tests:</strong> "Write failing tests for this behavior first, then make them pass." (test-driven development works very well with agents)</li>
  <li><strong>Type checks and linters:</strong> name the exact commands in <code>CLAUDE.md</code>.</li>
  <li><strong>Screenshots:</strong> for UI work, let Claude open the page in a browser and compare it to a design mockup.</li>
  <li><strong>Reproduction scripts:</strong> for bugs, have Claude reproduce the bug first, then fix it.</li>
</ul>

<h2>Be specific</h2>
${compare("Add tests for foo.py", "Write tests for foo.py covering the case where the user is logged out. Avoid mocks. Use the fixtures in tests/conftest.py.")}
${compare("Fix the login bug", "Users report login fails after session timeout. Check the token refresh flow in src/auth/. Write a failing test that reproduces it, then fix it.")}

<h2>Manage context like a pro</h2>
<ul>
  <li><code>/clear</code> between unrelated tasks. Stale context is the number-one cause of drifting agents.</li>
  <li>For long tasks, have Claude keep a checklist or progress file it updates as it goes.</li>
  <li>Use subagents for investigation so exploration doesn't fill your main context.</li>
</ul>
${pro("Course-correct early", "Two quick corrections in the first minute save twenty minutes of cleanup. If a session has gone off the rails, <code>/clear</code> and restart with a better prompt that includes what you learned.")}
`,
      },
      {
        id: "claude-md",
        title: "CLAUDE.md: project memory",
        minutes: 8,
        summary: "The file Claude reads at the start of every session. What to put in it, and what to leave out.",
        body: `
<p><code>CLAUDE.md</code> is a markdown file Claude Code loads automatically into every session. Think of it as the onboarding doc for your agent.</p>
${table(["Location", "Applies to"], [
  ["<code>./CLAUDE.md</code> (commit it)", "Everyone working in this repo"],
  ["<code>./CLAUDE.local.md</code> (gitignore it)", "Just you, in this repo"],
  ["<code>~/.claude/CLAUDE.md</code>", "You, in every project"],
  ["<code>subdir/CLAUDE.md</code>", "Loaded when Claude works in that folder"],
])}
<h2>A good CLAUDE.md</h2>
${code("markdown", `
# Project: Orders API

## Commands
- Install: \`pnpm install\`
- Dev server: \`pnpm dev\` (port 3000)
- Tests: \`pnpm test\` (run a single file: \`pnpm test path/to/file\`)
- Typecheck + lint before committing: \`pnpm check\`

## Architecture
- \`src/routes/\` HTTP handlers, thin. Business logic lives in \`src/services/\`.
- Database access only through \`src/db/repo.ts\`.

## Conventions
- TypeScript strict mode. No \`any\`.
- Every new endpoint needs an integration test in \`tests/api/\`.
- Money is stored in integer cents, never floats.

## Gotchas
- The payments sandbox needs \`STRIPE_KEY\` from \`.env.example\`.
- Don't edit files in \`src/generated/\`. Run \`pnpm codegen\` instead.
`, "CLAUDE.md")}
<h2>Rules of thumb</h2>
<ul>
  <li><strong>Short and specific wins.</strong> Every line costs context in every session. Include what Claude can't discover on its own.</li>
  <li><strong>Commands, conventions, gotchas.</strong> Skip generic advice like "write clean code".</li>
  <li><strong>Treat it like code.</strong> Review it, prune it, and update it when Claude makes the same mistake twice.</li>
  <li>Use <code>/memory</code> to open and edit memory files from inside a session.</li>
</ul>
`,
      },
      {
        id: "permissions-settings",
        title: "Permissions, settings and safety",
        minutes: 8,
        summary: "Control what Claude Code can do on its own, and keep secrets and systems safe.",
        body: `
<p>By default, Claude Code asks before editing files or running commands. You decide how much autonomy to give.</p>
${table(["Mode", "Behavior", "Use when"], [
  ["Default", "Asks before edits and commands", "Learning, unfamiliar or sensitive code"],
  ["Accept edits", "Edits files freely, still asks for commands", "You trust the direction and review diffs after"],
  ["Plan", "Read-only. Researches and proposes a plan", "Before any non-trivial change"],
  ["Auto", "A classifier approves safe actions and blocks risky ones", "Longer autonomous tasks with guardrails"],
  ["Bypass permissions", "No prompts at all", "Only in isolated sandboxes or containers"],
])}
<h2>Allow and deny rules</h2>
<p>Pre-approve safe, repetitive commands and block anything dangerous in <code>.claude/settings.json</code> (shared with the team) or <code>.claude/settings.local.json</code> (just you). Use <code>/permissions</code> to manage them interactively.</p>
${code("json", `
{
  "permissions": {
    "allow": [
      "Bash(pnpm test:*)",
      "Bash(pnpm check)",
      "Bash(git status)",
      "Bash(git diff:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./secrets/**)",
      "Bash(git push --force:*)"
    ]
  }
}
`, ".claude/settings.json")}
${warn("Prompt injection", "Web pages, issues, files and tool results can contain hidden instructions. Be careful letting an agent act on untrusted content with broad permissions, and never give it credentials it doesn't need.")}
`,
      },
      {
        id: "skills-commands",
        title: "Skills and custom slash commands",
        minutes: 10,
        summary: "Package your team's workflows as reusable skills that Claude loads when relevant, or that you trigger with a slash.",
        body: `
<p>A <strong>skill</strong> is a folder with a <code>SKILL.md</code> file (instructions plus optional scripts and reference files). Claude sees each skill's short description and loads the full instructions only when the task calls for it, so you can have many skills without bloating context. You can also invoke a skill directly as <code>/skill-name</code>.</p>
${code("markdown", `
---
name: release-notes
description: Write release notes from merged PRs. Use when the user asks for release notes, a changelog, or "what shipped".
---

# Release notes

1. Run \`git log --merges --oneline <last-tag>..HEAD\` to list merged PRs.
2. Group changes into: New, Improved, Fixed. Skip internal refactors.
3. Write each item for customers, not engineers: what changed and why it matters.
4. Follow the format in \`template.md\` in this folder.
5. End with contributor thanks, listing GitHub handles alphabetically.
`, ".claude/skills/release-notes/SKILL.md")}
<h2>Where skills live</h2>
<ul>
  <li><code>.claude/skills/</code> in a repo: shared with the team.</li>
  <li><code>~/.claude/skills/</code>: personal, available in every project.</li>
  <li><strong>Plugins:</strong> bundles of skills, subagents, hooks and MCP servers that you install from a marketplace.</li>
</ul>
<p>Skills also work in the Claude apps and the API, so the same package can power chat, code and your own agents.</p>
${tip("Write the description carefully", "The description decides when Claude uses the skill. Say what it does and the phrases or situations that should trigger it.")}
${exercise("Your first skill", `<p>Pick a task you explain to Claude repeatedly (writing a PR description, adding an API endpoint, triaging a bug). Ask Claude Code: "Create a skill for this workflow based on how we just did it."</p>`)}
`,
      },
      {
        id: "hooks",
        title: "Hooks: automatic guardrails",
        minutes: 9,
        summary: "Run your own scripts automatically at points in Claude Code's lifecycle: format on edit, block risky commands, notify when done.",
        body: `
<p>Instructions in CLAUDE.md are guidance; Claude usually follows them. <strong>Hooks</strong> are guarantees: shell commands the harness runs every time a given event happens.</p>
${table(["Event", "Fires", "Typical use"], [
  ["<code>PreToolUse</code>", "Before a tool runs (can block it)", "Block edits to protected files, dangerous commands"],
  ["<code>PostToolUse</code>", "After a tool succeeds", "Auto-format, lint or type check edited files"],
  ["<code>UserPromptSubmit</code>", "When you send a prompt", "Add context, validate prompts"],
  ["<code>Stop</code>", "When Claude finishes responding", "Run tests, send a notification"],
  ["<code>SessionStart</code>", "At the start of a session", "Install dependencies, load context"],
  ["<code>Notification</code>", "When Claude needs your input", "Desktop or phone alert"],
])}
<h2>Example: format every edited file</h2>
${code("json", `
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
`, ".claude/settings.json")}
<p>Hooks receive event details as JSON on standard input. A <code>PreToolUse</code> hook that exits with code 2 blocks the action and sends its error message back to Claude so it can adjust.</p>
${warn("Hooks run with your permissions", "They're real shell commands. Review hook scripts from others as carefully as any code you run.")}
${tip("Ask Claude to write them", "Run <code>/hooks</code>, or just ask: \"Add a hook that runs the linter after every file edit.\"")}
`,
      },
      {
        id: "mcp",
        title: "MCP servers: connect tools and data",
        minutes: 9,
        summary: "Give Claude Code access to issue trackers, databases, browsers, design tools and internal APIs.",
        body: `
<p>The <strong>Model Context Protocol</strong> lets Claude Code use external tools: read Jira tickets, query a database, drive a browser, pull Figma designs, check error monitoring, and more.</p>
${code("bash", `
# a remote server over HTTP
claude mcp add --transport http my-tracker https://mcp.example.com/mcp

# a local server started as a process
claude mcp add my-db -- npx -y @example/postgres-mcp postgresql://localhost/dev

# see what's connected (also /mcp inside a session)
claude mcp list
`, "Terminal")}
<h2>Scopes</h2>
<ul>
  <li><strong>Local</strong> (default): just you, just this project.</li>
  <li><strong>Project</strong>: saved to <code>.mcp.json</code> and committed so the whole team gets it.</li>
  <li><strong>User</strong>: you, across all projects.</li>
</ul>
<h2>Build your own</h2>
<p>An MCP server is a small program exposing tools (functions), resources (data) and prompts. Official SDKs exist for TypeScript, Python and other languages. A useful first server wraps one internal API your team uses constantly.</p>
${tip("Keep the tool list lean", "Every connected tool's description takes context. Connect what the project actually needs.")}
`,
      },
      {
        id: "subagents",
        title: "Subagents and parallel work",
        minutes: 9,
        summary: "Delegate focused tasks to specialized agents with their own context, and run several Claudes at once.",
        body: `
<p>A <strong>subagent</strong> is a separate Claude instance with its own context window, system prompt and tool permissions. The main agent delegates a task, the subagent does it, and only a summary comes back. Your main context stays clean.</p>
${code("markdown", `
---
name: security-reviewer
description: Reviews code changes for security vulnerabilities. Use proactively after changes to auth, payments or user input handling.
tools: Read, Grep, Glob, Bash
---

You are a senior application security engineer. Review the current diff for:
injection, broken auth and access control, secrets in code, unsafe
deserialization, and missing input validation.

Report each finding with file:line, severity (critical/high/medium/low),
a concrete exploit scenario, and a fix. Say explicitly if you found nothing.
`, ".claude/agents/security-reviewer.md")}
<p>Create and manage subagents with <code>/agents</code>. Good candidates: code reviewer, test writer, researcher, documentation writer, debugger.</p>
<h2>Running Claudes in parallel</h2>
<ul>
  <li><strong>Git worktrees:</strong> check out several branches in separate folders and run a Claude session in each, with no conflicts.</li>
  <li><strong>Writer and reviewer:</strong> one session writes code, a fresh one reviews it without the author's biases.</li>
  <li><strong>Claude Code on the web:</strong> kick off several tasks in cloud sessions and review the pull requests later.</li>
</ul>
${code("bash", `
git worktree add ../app-feature-a -b feature-a
cd ../app-feature-a && claude
`, "Terminal")}
`,
      },
      {
        id: "automation-ci",
        title: "Headless mode, GitHub and CI",
        minutes: 9,
        summary: "Run Claude Code from scripts and pipelines: automated reviews, issue triage, migrations at scale.",
        body: `
<h2>Headless mode</h2>
<p><code>claude -p</code> runs a single prompt non-interactively and prints the result, which is perfect for scripts.</p>
${code("bash", `
# one-shot question
claude -p "Summarize what changed in the last 10 commits"

# machine-readable output for scripts
claude -p "List TODO comments as JSON" --output-format json

# pipe data in
cat error.log | claude -p "Find the root cause of these errors"

# fan out across many files
for f in src/legacy/*.js; do
  claude -p "Migrate $f from callbacks to async/await. Run its tests." \\
    --allowedTools "Edit,Bash(npm test:*)"
done
`, "Terminal")}
<h2>GitHub integration</h2>
<ul>
  <li>Run <code>/install-github-app</code> inside Claude Code to set up the GitHub app and Actions workflow.</li>
  <li>Then mention <code>@claude</code> in an issue or pull request to have Claude implement a fix, answer questions or review code.</li>
  <li>Automated code review can run on every pull request.</li>
</ul>
<h2>The Agent SDK</h2>
<p>The <strong>Claude Agent SDK</strong> (Python and TypeScript) gives you the same agent loop, tools and context management that power Claude Code, as a library for building your own agents. Covered in the Architect level.</p>
${warn("Scope permissions in automation", "In CI, pass an explicit <code>--allowedTools</code> list, run in an isolated environment, and store keys as secrets.")}
`,
      },
    ],
    quiz: [
      { q: "What should you do before asking Claude Code to implement a non-trivial change?", options: ["Enable bypass permissions", "Explore and plan first, for example in plan mode", "Write the code yourself", "Run /compact"], answer: 1, why: "Explore then plan then code then verify is the most reliable loop." },
      { q: "Which is the best content for CLAUDE.md?", options: ["\"Write clean, high-quality code\"", "The exact test, lint and build commands, plus project gotchas", "Your entire README", "A list of every file"], answer: 1, why: "Include specific things Claude can't discover itself. Every line costs context." },
      { q: "You need prettier to run after every edit, without exception. What do you use?", options: ["A CLAUDE.md instruction", "A PostToolUse hook", "A subagent", "An MCP server"], answer: 1, why: "Hooks are deterministic; instructions are guidance." },
      { q: "Why use a subagent for investigating a large codebase?", options: ["It's always faster", "Its exploration stays in its own context; only the summary comes back", "It can't make mistakes", "It has more permissions"], answer: 1, why: "Subagents protect the main context window." },
      { q: "Which command runs Claude Code non-interactively for scripts?", options: ["claude --script", "claude -p", "claude run", "claude --ci"], answer: 1, why: "-p (print mode) runs one prompt headlessly." },
      { q: "When does Claude load a skill's full SKILL.md instructions?", options: ["Always, at session start", "When its description matches the task, or you invoke it by name", "Only in CI", "Never; skills are for the API only"], answer: 1, why: "Descriptions are always visible; the full instructions load on demand." },
    ],
  });
})();
