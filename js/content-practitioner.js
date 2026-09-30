/* Level 2 — Practitioner: confident daily users who want consistently great results. */
(function () {
  const { code, tip, warn, pro, note, compare, table, steps, exercise } = H;

  ACADEMY.levels.push({
    id: "practitioner",
    n: 2,
    name: "Practitioner",
    color: "--l2",
    tagline: "Prompting that works every time, plus Projects, artifacts, research, connectors and memory.",
    audience: "Regular users who want expert results",
    lessons: [
      {
        id: "prompting-fundamentals",
        title: "Prompting fundamentals",
        minutes: 12,
        summary: "The six principles behind nearly every great prompt, with before-and-after examples.",
        body: `
<p>A prompt is everything you give Claude: instructions, context, examples and material. Good prompting isn't about magic words. It's about being clear, the way you would with a smart colleague who is new to your situation.</p>

<h2>1. Be clear and direct</h2>
<p>Say exactly what you want. If you want Claude to go above and beyond, ask for that too.</p>
${compare("Make a dashboard.", "Build an analytics dashboard for a small online shop. Include revenue over time, top products and conversion rate. Make it as complete and polished as you can.")}

<h2>2. Give the context and the why</h2>
<p>Explaining <em>why</em> helps Claude make good decisions in cases you didn't anticipate.</p>
${compare("Never use bullet points.", "Write in flowing paragraphs rather than bullet points. This will be read aloud on a podcast, so it needs to sound natural when spoken.")}

<h2>3. Show examples</h2>
<p>One or two examples of what "good" looks like are often worth a paragraph of description. Vary them so Claude learns the pattern rather than copying one example.</p>
${code("prompt", `
Turn customer feedback into a one-line tag and a sentiment.

Examples:
"Shipping took 3 weeks and nobody answered my emails" -> Delivery delay | negative
"Love the new colors, the fit is perfect" -> Product design | positive

Now do these:
{{FEEDBACK}}
`)}

<h2>4. Structure long prompts with tags</h2>
<p>When a prompt mixes instructions, documents and examples, wrap each part in simple XML-style tags. Claude was trained to pay attention to them, and it stops material from blurring into instructions.</p>
${code("prompt", `
<instructions>
Compare the two proposals and recommend one for a 10-person startup.
</instructions>

<proposal_a>
...paste...
</proposal_a>

<proposal_b>
...paste...
</proposal_b>

<output_format>
A 3-row comparison table (cost, risk, time to launch), then a one-paragraph recommendation.
</output_format>
`)}

<h2>5. Give Claude a role</h2>
<p>A role sets expertise and tone: "You are a senior employment lawyer reviewing this contract for an employee." Be specific about the perspective you want.</p>

<h2>6. Describe the output you want</h2>
<p>Say what to do rather than what not to do, and match your prompt's style to the output you want. A prompt written in plain paragraphs tends to get plain paragraphs back.</p>
${table(["Instead of", "Try"], [
  ["\"Don't be too long.\"", "\"Answer in 3 sentences.\""],
  ["\"Don't use jargon.\"", "\"Write for a smart 15-year-old.\""],
  ["\"No markdown.\"", "\"Write in plain prose paragraphs.\""],
])}
${pro("The golden test", "Show your prompt to a colleague with no context. If they'd be confused about what you want, Claude probably will be too.")}
${exercise("Upgrade a prompt", `<p>Take a prompt you used recently. Rewrite it using at least four of the six principles, run both, and compare the results.</p>`)}
`,
      },
      {
        id: "advanced-prompting",
        title: "Advanced prompting techniques",
        minutes: 12,
        summary: "Letting Claude think, chaining tasks, getting grounded answers from documents, and controlling format and length.",
        body: `
<h2>Let Claude think before answering</h2>
<p>For hard problems, turn on extended thinking (or a higher effort setting) in the app, or ask Claude to reason first. Modern Claude models decide for themselves how much to think; your job is to allow it on hard tasks and skip it on simple ones.</p>
${code("prompt", `
Before answering, think through the trade-offs carefully. Consider at least
three options, then give your recommendation and the single biggest risk.
`)}

<h2>Break big jobs into a chain</h2>
<p>Instead of one giant request, run a sequence where each step's output feeds the next:</p>
${steps([
  "\"Read these 5 interview transcripts and extract every pain point, with quotes.\"",
  "\"Group these pain points into themes and rank them by frequency.\"",
  "\"Write a one-page product brief addressing the top 3 themes.\"",
  "\"Now critique the brief as a skeptical VP. What's weak?\"",
])}

<h2>Grounded answers from long documents</h2>
<ul>
  <li>Put long documents <strong>first</strong> and your question <strong>at the end</strong>. This measurably improves quality.</li>
  <li>Ask Claude to <strong>pull relevant quotes first</strong>, then answer using only those quotes.</li>
  <li>Allow it to say <strong>"the document doesn't say"</strong>.</li>
</ul>
${code("prompt", `
<document>
...your 80-page policy...
</document>

First, find the quotes relevant to parental leave and put them in <quotes> tags.
Then answer: how many weeks of paid leave does a new parent get?
Use only the quotes. If the document doesn't say, reply "Not specified".
`)}

<h2>Ask for self-review</h2>
<p>"Check your answer against the requirements I gave and fix anything that's missing." Asking Claude to verify its own work catches a surprising number of errors, especially in code and math.</p>

<h2>Control length and format</h2>
<ul>
  <li>Give a concrete target: "about 200 words", "exactly 5 bullets", "a table with these columns".</li>
  <li>Give a template to fill in.</li>
  <li>For content you'll paste elsewhere: "Output only the email, with no introduction."</li>
</ul>

<h2>Reduce made-up answers</h2>
${table(["Technique", "Prompt"], [
  ["Permission to not know", "\"If you're not confident, say so.\""],
  ["Cite the source", "\"For each claim, cite the page or quote.\""],
  ["Investigate first", "\"Don't speculate about the file contents. Read them before answering.\""],
  ["Separate facts from guesses", "\"Label each point as Confirmed or Inference.\""],
])}
`,
      },
      {
        id: "projects",
        title: "Projects: your reusable workspace",
        minutes: 8,
        summary: "Give Claude standing knowledge and instructions so every chat starts with the right context.",
        body: `
<p>A <strong>Project</strong> is a workspace with its own files (project knowledge) and its own custom instructions. Every chat inside it starts with that context. Stop re-explaining yourself.</p>
<h2>Great uses for Projects</h2>
<ul>
  <li><strong>Brand voice:</strong> upload your style guide and good examples; every draft comes out on-brand.</li>
  <li><strong>A client or product:</strong> specs, meeting notes, FAQs and decisions in one place.</li>
  <li><strong>A course or exam:</strong> syllabus and notes, with instructions to tutor you Socratically.</li>
  <li><strong>A codebase companion:</strong> architecture docs and conventions for quick questions.</li>
</ul>
<h2>Writing project instructions</h2>
${code("prompt", `
You are the content assistant for Northwind Outdoor, a hiking gear brand.

Audience: beginner and intermediate hikers, 25-45.
Voice: warm, practical, lightly funny. Never salesy. British spelling.
Always:
- Check product facts against the catalogue in project knowledge.
- Suggest one relevant product at most per piece.
- Keep social posts under 50 words.
When unsure about a product detail, ask instead of guessing.
`, "Project instructions")}
${tip("Keep knowledge tidy", "Remove outdated files. Clear file names like <code>2026-pricing.pdf</code> help Claude find the right one. On Team plans, share Projects so everyone works from the same context.")}
`,
      },
      {
        id: "artifacts",
        title: "Artifacts: documents, apps and visuals",
        minutes: 8,
        summary: "Have Claude build standalone documents, interactive tools, diagrams and web pages you can use and share.",
        body: `
<p>When Claude makes something substantial (a document, a web page, an interactive tool, a diagram or a chart), it can create it as an <strong>artifact</strong>: a separate panel you can view, iterate on, copy, download and share.</p>
<h2>Things you can build without coding</h2>
<ul>
  <li>A budget calculator or loan comparison tool.</li>
  <li>A flashcard app from your study notes.</li>
  <li>An interactive org chart, timeline or flowchart.</li>
  <li>A one-page website or landing page.</li>
  <li>A dashboard from a CSV you upload.</li>
  <li>A simple game for a class or team event.</li>
</ul>
<h2>How to iterate on an artifact</h2>
${steps([
  "Describe the purpose and the user: \"A calculator my sales team uses on calls to quote prices.\"",
  "Test it. Click everything.",
  "Give specific feedback: \"The discount field accepts negative numbers. Block that.\"",
  "Ask for polish last: layout, colors, mobile friendliness.",
])}
${pro("AI-powered artifacts", "Artifacts can call Claude themselves, so you can build small AI apps such as a tutor, a feedback tool or a writing coach, and share them with people who use them with their own Claude account.")}
`,
      },
      {
        id: "research",
        title: "Web search and Research",
        minutes: 7,
        summary: "Get current, cited information, and run deep multi-source research reports.",
        body: `
<p>With <strong>web search</strong> turned on, Claude can look things up and cite its sources. <strong>Research</strong> mode goes further: Claude plans a research strategy, runs many searches (and searches your connected work apps if enabled), and writes a cited report. It takes minutes rather than seconds.</p>
${table(["Use", "When"], [
  ["No search", "Timeless knowledge, writing, reasoning about material you've provided"],
  ["Web search", "Current facts, prices, news, documentation, quick checks"],
  ["Research", "Market scans, competitor analysis, literature reviews, due diligence"],
])}
<h2>A strong research brief</h2>
${code("prompt", `
Research the market for B2B expense-management software for companies with
50-500 employees in the UK.

I need:
1. The top 8 vendors, with pricing model and standout features (table)
2. What changed in the last 12 months
3. Gaps an entrant could exploit

Prioritise vendor sites, analyst reports and recent reviews. Flag anything
you couldn't verify.
`)}
${warn("Still verify", "Citations make checking easy, so actually open the key ones. Sources can be outdated or misread.")}
`,
      },
      {
        id: "connectors",
        title: "Connectors, tools and integrations",
        minutes: 8,
        summary: "Connect Claude to your email, calendar, drive and work tools so it can read and act on your real information.",
        body: `
<p><strong>Connectors</strong> give Claude secure access to other apps, such as Google Drive, Gmail, Calendar, Slack, Notion, GitHub, Asana, Jira and many more. Most are built on the <strong>Model Context Protocol (MCP)</strong>, an open standard for connecting AI to tools and data.</p>
<h2>What it unlocks</h2>
<ul>
  <li>"What's on my calendar this week, and which meetings can I skip?"</li>
  <li>"Find the latest version of the pricing deck in Drive and summarize the changes."</li>
  <li>"Draft replies to the unread emails from customers."</li>
  <li>"Create Jira tickets from these meeting notes."</li>
</ul>
<h2>Setting up</h2>
${steps([
  "Open Settings, then Connectors (or the tools menu in a chat).",
  "Pick a connector and sign in to grant access.",
  "Enable it in the chat where you need it. Fewer active tools means more focused answers.",
])}
${warn("Permissions matter", "Claude asks before taking actions like sending email or creating events. Read what it's about to do before you approve. On Team and Enterprise plans, admins decide which connectors are available.")}
${note("Beyond connectors", "Claude in Chrome lets Claude navigate websites and fill forms in your browser. On desktop, Claude can also use apps on your computer when you allow it. Both ask for permission and let you watch and stop.")}
`,
      },
      {
        id: "personalize",
        title: "Memory, styles and preferences",
        minutes: 6,
        summary: "Make Claude remember what matters and write the way you like, across every chat.",
        body: `
<ul>
  <li><strong>Profile preferences:</strong> tell Claude about yourself once (your role, your expertise, how you like answers). It applies to every chat.</li>
  <li><strong>Memory:</strong> when enabled, Claude can remember useful context from past conversations and search previous chats. You can view, edit and clear what it remembers.</li>
  <li><strong>Styles:</strong> choose a preset (concise, explanatory, formal) or create a custom style from writing samples.</li>
</ul>
${code("prompt", `
I'm a product manager at a healthcare SaaS company. I'm technical enough to
read code but don't write it daily. Skip basic definitions. Lead with the
answer, then the reasoning. Use British English. Push back if my
assumptions look wrong.
`, "Example profile preferences")}
${tip("Ask Claude to disagree with you", "Adding \"push back if I'm wrong\" to your preferences makes Claude a much better thinking partner.")}
`,
      },
      {
        id: "common-mistakes",
        title: "Common mistakes and how to fix them",
        minutes: 6,
        summary: "The problems people hit most often, and the one-line fix for each.",
        body: `
${table(["Symptom", "Likely cause", "Fix"], [
  ["Generic, bland output", "Too little context", "Add audience, purpose, examples and constraints"],
  ["Answer ignores part of the request", "Too many asks in one message", "Number your asks, or split into steps"],
  ["Too long", "No length target", "Give a concrete limit or template"],
  ["Made-up facts", "No grounding", "Provide sources, enable search, allow \"I don't know\""],
  ["Keeps drifting from instructions", "Very long chat", "Start fresh with a summary of the key points"],
  ["Tone is off", "Tone described vaguely", "Paste a sample of the tone you want"],
  ["Hitting usage limits", "Huge chats, repeated big uploads", "New chats, Projects for shared files, a faster model for simple tasks"],
  ["Refused a legitimate request", "Missing context", "Explain who you are and why you need it"],
])}
${pro("The meta-prompt", "Stuck? Ask Claude to write the prompt: \"I want to get [result]. Write the best possible prompt for this, and ask me for anything you need.\"")}
`,
      },
    ],
    quiz: [
      { q: "What do all strong prompts in the teardown lesson have in common?", options: ["They use capital letters for emphasis", "They state the audience, the purpose, the output shape and what to do when unsure", "They are always under 20 words", "They start with \"You are a helpful assistant\""], answer: 1, why: "Audience, purpose, format and a fallback remove Claude's guesswork." },
      { q: "Where should you put a long document relative to your question?", options: ["Question first, document after", "Document first, question at the end", "It doesn't matter", "Split it across messages"], answer: 1, why: "Long material at the top and the question at the end improves answer quality." },
      { q: "What is the main benefit of wrapping prompt sections in XML-style tags?", options: ["It makes Claude faster", "It separates instructions from material so they don't blur together", "It is required syntax", "It hides the text from Claude"], answer: 1, why: "Tags give clear structure. They're a convention Claude follows well, not required syntax." },
      { q: "Your team keeps re-uploading the same style guide to every chat. What should they use?", options: ["Artifacts", "A Project with the guide in project knowledge", "Research mode", "A bigger model"], answer: 1, why: "Projects hold standing knowledge and instructions for every chat inside them." },
      { q: "Which instruction is likely to work best?", options: ["\"Don't use markdown\"", "\"Write in plain prose paragraphs\"", "\"NO MARKDOWN EVER!!!\"", "\"Avoid formatting maybe\""], answer: 1, why: "Say what to do rather than what not to do, and skip the shouting." },
      { q: "What open standard do most connectors use?", options: ["REST", "OAuth", "Model Context Protocol (MCP)", "GraphQL"], answer: 2, why: "MCP is the open standard for connecting AI to tools and data." },
    ],
  });
})();
