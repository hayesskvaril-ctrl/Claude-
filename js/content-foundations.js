/* Level 1 — Foundations: for someone who has never used Claude. */
(function () {
  const { code, tip, warn, pro, note, compare, table, steps, exercise } = H;

  ACADEMY.levels.push({
    id: "foundations",
    n: 1,
    name: "Foundations",
    color: "--l1",
    tagline: "Your first conversations. What Claude is, where to find it, and how to get good answers from day one.",
    audience: "Complete beginners",
    lessons: [
      {
        id: "what-is-claude",
        title: "What Claude is (and isn't)",
        minutes: 6,
        summary: "Claude is an AI model made by Anthropic. Learn what it's good at, where it falls short, and which model does what.",
        body: `
<p>Claude is a family of large language models built by Anthropic. You talk to it in plain language, and it reads, writes, reasons, analyzes, and writes code. It can work with text, images, PDFs, spreadsheets and codebases, and with the right setup it can search the web, use your apps and take actions on a computer.</p>

<h2>What Claude is great at</h2>
<ul>
  <li><strong>Writing and editing:</strong> drafts, rewrites, tone changes, summaries, translations.</li>
  <li><strong>Thinking with you:</strong> breaking down problems, weighing options, planning projects.</li>
  <li><strong>Reading a lot, fast:</strong> long reports, contracts, research papers, whole code repositories.</li>
  <li><strong>Analysis:</strong> pulling structure out of messy data, spotting patterns, building charts.</li>
  <li><strong>Coding:</strong> from explaining a single line to building and shipping full applications.</li>
  <li><strong>Learning:</strong> explaining any topic at your level and quizzing you on it.</li>
</ul>

<h2>Where it can go wrong</h2>
<ul>
  <li><strong>It can be confidently wrong.</strong> Claude may state something false in a fluent, convincing way. Check facts that matter, especially numbers, citations, legal and medical details.</li>
  <li><strong>Its knowledge has a cutoff date.</strong> Without web search, it doesn't know about recent events.</li>
  <li><strong>It only knows what you tell it.</strong> Claude can't see your screen, files, or company context unless you share them or connect a tool.</li>
  <li><strong>It isn't a person.</strong> It doesn't remember past chats unless memory or a Project is set up, and it has no personal stake in your decisions.</li>
</ul>
${warn("Rule of thumb", "Treat Claude like a brilliant new colleague on their first day: extremely capable, but missing context about you. The more context you give, the better the result.")}

<h2>The model family</h2>
<p>Anthropic releases models in tiers. Bigger models are smarter but slower and cost more; smaller ones are fast and cheap. In the apps you can usually pick the model from a menu.</p>
${table(["Model", "Best for", "Think of it as"], [
  ["<strong>Claude Fable 5.1</strong>", "The hardest reasoning, research and long-running agent work", "The specialist you call for the toughest problems"],
  ["<strong>Claude Opus 5.5</strong>", "Complex work, serious coding, deep analysis. The everyday flagship", "Your senior expert"],
  ["<strong>Claude Sonnet 5.5</strong>", "Fast, capable everyday work and coding at a lower cost", "The strong all-rounder"],
  ["<strong>Claude Haiku 4.5</strong>", "Quick answers, high-volume and real-time tasks", "The fast assistant"],
])}
${tip("Which should I pick?", "Start with the default the app gives you. Move up a tier when the answer isn't good enough; move down when you need speed or are running many small tasks.")}

${exercise("Meet Claude", `<p>Open Claude and ask: <em>"Explain what you can and can't help me with, in 5 bullet points, for someone who works as a [your job]."</em> Compare its answer with this lesson.</p>`)}
`,
      },
      {
        id: "where-to-use",
        title: "Where to use Claude",
        minutes: 5,
        summary: "The web app, desktop and mobile apps, Claude Code, the API, and the cloud platforms. Which one fits you.",
        body: `
<p>Claude is available in several places. They share the same models but are built for different jobs.</p>
${table(["Surface", "What it is", "Who it's for"], [
  ["<strong>claude.ai</strong> (web)", "The chat app in your browser. Projects, artifacts, research, connectors.", "Everyone"],
  ["<strong>Desktop apps</strong> (Mac, Windows)", "The chat app plus deeper computer integration, local tools and Claude Code.", "Daily power users"],
  ["<strong>Mobile apps</strong> (iOS, Android)", "Chat on the go, voice, photos of documents and whiteboards.", "Everyone"],
  ["<strong>Claude Code</strong>", "An agentic coding tool that works in your terminal, IDE, desktop app or the web. It reads your code, edits files and runs commands.", "Developers, technical teams"],
  ["<strong>Claude API</strong> (Claude Console)", "Programmatic access so you can build Claude into your own products.", "Developers building apps"],
  ["<strong>Cloud platforms</strong>", "Claude via Amazon Bedrock, Google Cloud Vertex AI and Microsoft Foundry.", "Companies already on those clouds"],
  ["<strong>Integrations</strong>", "Claude inside tools like Slack, Chrome and Excel.", "Teams who want Claude where they already work"],
])}

<h2>Plans at a glance</h2>
<p>Consumer and business plans differ mainly in usage limits and team features. Names and prices change, so check the pricing page for current details.</p>
<ul>
  <li><strong>Free:</strong> try Claude with daily limits.</li>
  <li><strong>Pro and Max:</strong> much higher usage, access to the most capable models, Claude Code, research and more.</li>
  <li><strong>Team and Enterprise:</strong> shared projects, admin controls, single sign-on, data controls and higher limits.</li>
  <li><strong>API:</strong> pay per token (per chunk of text processed). Separate from chat subscriptions.</li>
</ul>
${note("Usage limits", "Chat plans limit how much you can use Claude over a rolling window. Long conversations and big files use up more of your allowance. Starting a fresh chat for a new topic keeps things fast and efficient.")}
`,
      },
      {
        id: "first-conversation",
        title: "Your first conversation",
        minutes: 8,
        summary: "How to ask, how to follow up, and the controls you'll use every day: edit, retry, new chat.",
        body: `
<p>Talking to Claude is just typing, but a few habits make a big difference.</p>

<h2>The anatomy of a good first message</h2>
${steps([
  "<strong>Say what you want.</strong> \"Write\", \"summarize\", \"compare\", \"explain\", \"fix\".",
  "<strong>Give the context.</strong> Who it's for, why you need it, what you already have.",
  "<strong>Describe the output.</strong> Length, format, tone. \"Three bullet points\", \"a friendly email under 150 words\".",
  "<strong>Share the material.</strong> Paste the text, attach the file, or add a screenshot.",
])}
${compare(
  "Write an email about the meeting.",
  "Write a short, friendly email to my team (8 people) moving Thursday's 2pm planning meeting to Friday 10am because the client call ran over. Ask them to reply if Friday doesn't work. Under 100 words."
)}

<h2>Keep the conversation going</h2>
<p>Your first answer is a draft, not the final result. Follow up the way you would with a colleague:</p>
<ul>
  <li>"Make it shorter and less formal."</li>
  <li>"Good, but the second point is wrong: our deadline is March, not April."</li>
  <li>"Give me three more options for the subject line."</li>
  <li>"Why did you suggest that? What are the risks?"</li>
</ul>

<h2>Controls you'll use constantly</h2>
${table(["Control", "When to use it"], [
  ["<strong>Edit your message</strong>", "You phrased something badly. Edit and resend instead of adding a correction, which keeps the conversation clean."],
  ["<strong>Retry</strong>", "Get a different version of the same answer."],
  ["<strong>New chat</strong>", "Switching topic. Old context can confuse new tasks and uses up your limits."],
  ["<strong>Model picker</strong>", "Choose a more capable or a faster model."],
  ["<strong>Copy</strong>", "Grab the answer, keeping formatting."],
])}
${tip("One topic per chat", "Long, wandering chats get slower and less focused. When you change subject, start a new chat. When you need to carry context over, ask Claude: \"Summarize everything important from this chat so I can paste it into a new one.\"")}

${exercise("The follow-up habit", `<p>Ask Claude for a 3-day meal plan. Then refine it three times: change a constraint (budget or diet), change the format (a shopping list table), and ask it to explain one choice.</p>`)}
`,
      },
      {
        id: "files-and-images",
        title: "Working with files and images",
        minutes: 6,
        summary: "Upload PDFs, spreadsheets, screenshots and photos, and ask Claude to read, extract and analyze them.",
        body: `
<p>Claude can read many file types directly. Drag them into the chat, use the attachment button, or paste a screenshot.</p>
${table(["You can share", "Try asking"], [
  ["PDFs and documents", "\"Summarize this contract and list every date and obligation in a table.\""],
  ["Spreadsheets and CSVs", "\"Which region grew fastest? Make a chart.\""],
  ["Screenshots", "\"What does this error mean and how do I fix it?\""],
  ["Photos", "\"Turn this whiteboard photo into clean meeting notes.\""],
  ["Charts and diagrams", "\"Explain this chart to someone who's never seen it.\""],
  ["Code files", "\"What does this script do? Is anything risky?\""],
])}
<h2>Tips for better results</h2>
<ul>
  <li><strong>Say what to look for.</strong> "Focus on the termination clause" beats "read this".</li>
  <li><strong>Ask for quotes.</strong> "Quote the exact sentence you're relying on" makes answers easier to check.</li>
  <li><strong>Split huge jobs.</strong> For very large sets of files, work through them in batches, or use a Project.</li>
  <li><strong>Crop images.</strong> A tight screenshot of the relevant area beats a whole-screen capture.</li>
</ul>
${warn("Be careful with sensitive files", "Follow your organization's rules about what can be uploaded. Remove passwords, API keys and personal data you don't need Claude to see.")}
`,
      },
      {
        id: "everyday-uses",
        title: "20 everyday things to try",
        minutes: 7,
        summary: "A starter menu of practical tasks for work and life, so you build the habit of reaching for Claude.",
        body: `
<p>The fastest way to learn Claude is to use it on real tasks. Pick three of these today.</p>
<h2>Work</h2>
<ol>
  <li>Turn messy notes into a clean summary with action items and owners.</li>
  <li>Draft a hard email (saying no, chasing an invoice, giving feedback) and make it kinder.</li>
  <li>Prepare for a meeting: "What questions will the CFO ask about this proposal?"</li>
  <li>Summarize a long report into a one-page brief.</li>
  <li>Rewrite a document for a different audience, such as executives, customers or new hires.</li>
  <li>Build a spreadsheet formula from a plain-English description.</li>
  <li>Brainstorm 20 names, headlines or ideas, then pick the best 3 with reasons.</li>
  <li>Role-play a tough conversation (salary negotiation, difficult client) and get feedback.</li>
  <li>Make a project plan with milestones and risks.</li>
  <li>Proofread for clarity, not just typos.</li>
</ol>
<h2>Learning and life</h2>
<ol start="11">
  <li>"Explain [topic] like I'm new to it, then quiz me."</li>
  <li>Plan a trip itinerary around your budget and interests.</li>
  <li>Compare two products or options in a pros and cons table.</li>
  <li>Decode a confusing letter, bill or policy.</li>
  <li>Make a weekly meal plan and shopping list.</li>
  <li>Practice a language by chatting at your level.</li>
  <li>Get step-by-step help with a DIY or tech problem, with photos.</li>
  <li>Draft a cover letter tailored to a job posting.</li>
  <li>Structure a study plan for an exam.</li>
  <li>Ask for honest feedback on your own writing.</li>
</ol>
${pro("Make Claude interview you", "When you're not sure what to ask, say: \"I want to [goal]. Ask me questions one at a time until you have what you need, then produce it.\" This is one of the most useful habits you can build.")}
`,
      },
      {
        id: "safety-privacy",
        title: "Accuracy, safety and privacy",
        minutes: 6,
        summary: "How to check Claude's work, protect your data, and use AI responsibly at work.",
        body: `
<h2>Checking Claude's work</h2>
${steps([
  "<strong>Ask for sources.</strong> With web search or research on, Claude cites where information came from. Open the links.",
  "<strong>Ask it to check itself.</strong> \"Review your answer for mistakes and anything you're unsure of.\"",
  "<strong>Let it say \"I don't know\".</strong> Add: \"If you're not sure, say so rather than guessing.\"",
  "<strong>Verify what matters.</strong> Numbers, names, dates, quotes, laws and medical claims deserve a second look.",
])}

<h2>Protecting your data</h2>
<ul>
  <li>Review your privacy settings in the app, including whether your chats may be used to improve models.</li>
  <li>Use incognito chats for things you don't want saved to your history.</li>
  <li>On Team and Enterprise plans, your admin controls data retention and which connectors are allowed.</li>
  <li>Never paste passwords, API keys or other secrets into a chat.</li>
</ul>

<h2>Using AI responsibly at work</h2>
<ul>
  <li>Know your company's AI policy and follow it.</li>
  <li>You are responsible for what you send, publish or ship, even when Claude wrote the first draft.</li>
  <li>Be open about AI use where it matters to others.</li>
  <li>Keep a human in the loop for decisions that affect people.</li>
</ul>
${note("Why Claude sometimes says no", "Claude is trained to decline some requests that could cause harm. If a legitimate request is refused, add context about who you are and why you need it. That often resolves it.")}
`,
      },
    ],
    quiz: [
      { q: "Why do very long chats tend to get less sharp over time?", options: ["Claude gets tired", "Old, irrelevant content competes for attention in the context window", "The model downgrades itself", "Chats expire after an hour"], answer: 1, why: "Everything must fit in the context window, and clutter dilutes what matters now." },
      { q: "Claude gives you a statistic with a specific percentage. What should you do before using it in a report?", options: ["Use it; Claude is always accurate", "Verify it with a reliable source or ask Claude to cite one", "Round it to the nearest 10%", "Ask Claude the same question again"], answer: 1, why: "Claude can be confidently wrong. Facts that matter should be checked against a source." },
      { q: "You've been chatting about a marketing plan and now want help with an unrelated spreadsheet. What's best?", options: ["Keep going in the same chat", "Start a new chat", "Switch to the smallest model", "Upload the plan again"], answer: 1, why: "A new chat keeps context focused, answers sharper and usage lower." },
      { q: "Which message is most likely to get a great first answer?", options: ["\"Help with email\"", "\"Write an email\"", "\"Write a friendly 100-word email to my team moving Thursday's meeting to Friday 10am\"", "\"EMAIL!!!\""], answer: 2, why: "It states the task, audience, context, tone and length." },
      { q: "Which tool is designed to read your codebase, edit files and run commands?", options: ["Claude mobile app", "Claude Code", "Projects", "Styles"], answer: 1, why: "Claude Code is Anthropic's agentic coding tool." },
      { q: "You wrote a prompt badly. What's the cleanest fix?", options: ["Add a new message saying \"ignore that\"", "Edit the original message and resend", "Close the app", "Switch models"], answer: 1, why: "Editing keeps the conversation clean, with no confusing leftovers." },
    ],
  });
})();
