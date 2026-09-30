/* Deeper commentary for Levels 1-2. Rendered around each lesson as:
   "Why this matters" (top), "Going deeper" (after the lesson), "Key takeaways" (end). */
(function () {
  const { code, tip, warn, pro, note, compare, table, steps } = H;
  ACADEMY.commentary = ACADEMY.commentary || {};
  ACADEMY.levelIntro = ACADEMY.levelIntro || {};

  ACADEMY.levelIntro.foundations = {
    intro: `<p>Most people who give up on AI do it in the first week. They ask a vague question, get a bland answer, and decide it isn't for them. This level exists to get you past that week.</p>
<p>You won't learn tricks here. You'll learn an accurate mental model of what Claude is, where it's strong, where it fails, and how a conversation actually works. That model is what everything later in the course builds on. People with a good mental model get good results from almost any prompt. People without one get lucky sometimes.</p>`,
    outcomes: ["Explain what Claude is good and bad at, in your own words", "Pick the right app and model for a task", "Write a first message that gets a useful answer", "Check answers before you rely on them"],
  };

  ACADEMY.levelIntro.practitioner = {
    intro: `<p>At this level the question changes from "can Claude do this?" to "how do I get the best version of this, every time?"</p>
<p>The difference between an average user and an expert isn't secret phrasing. Experts give better context, structure their requests, and set Claude up with standing knowledge so they don't repeat themselves. They also know which feature to reach for: a Project for recurring work, Research for a market scan, a connector when the answer lives in their inbox. By the end of this level you'll have a toolkit for each of those situations.</p>`,
    outcomes: ["Write prompts that produce consistent, high-quality output", "Use chaining, grounding and self-review on hard tasks", "Set up Projects, connectors and preferences so Claude knows your context", "Diagnose a bad answer and fix the prompt behind it"],
  };

  const C = ACADEMY.commentary;

  C["how-claude-works"] = {
    why: `You don't need to understand the maths, but a rough picture of how Claude works explains almost every quirk you'll meet: why it's confident when wrong, why long chats drift, why context matters so much.`,
    takeaways: ["Claude reads and writes tokens, and everything it knows about your task has to fit in the context window", "It predicts likely text, so fluency is not evidence of accuracy", "Each chat starts blank unless memory, a Project or a connector supplies context", "Better input is the single biggest lever you control"],
  };

  C["what-is-claude"] = {
    why: `Knowing what Claude is for saves you from two opposite mistakes: using it for things it's bad at and getting burned, or never trying things it's brilliant at because you assumed it couldn't.`,
    deeper: `<p><strong>The "brilliant new colleague" model is the one to keep.</strong> Imagine a new hire who has read an enormous amount, writes beautifully, and reasons well, but started this morning. They don't know your customers, your acronyms, or what your boss cares about. You wouldn't hand them a one-line task and expect perfection. You'd brief them. Claude is the same, and nearly every tip in this course is a variation on "brief it properly".</p>
<p><strong>Capabilities are uneven, not uniform.</strong> Claude can write a clean legal summary and then miscount the words in it. It can explain a complex proof and slip on simple arithmetic done in its head. That isn't a contradiction: language models are strongest at reasoning about meaning and weakest at tasks that need exact bookkeeping without tools. When precision matters, ask Claude to use a tool (code execution, a spreadsheet, search) or to show its working.</p>
<p><strong>Model choice is a dial, not a ladder you climb once.</strong> Experienced users switch models within a day. They use a fast model for quick rewrites, a flagship model for analysis, and the most capable model for the problem they've been stuck on all week. Don't think of the smaller models as worse. Think of them as faster tools for smaller jobs.</p>`,
    takeaways: ["Treat Claude like a capable colleague who needs a briefing", "Verify facts, numbers and citations that matter", "Match the model to the job: faster for simple tasks, more capable for hard ones", "Claude only knows what you share or connect"],
  };

  C["where-to-use"] = {
    why: `The same model behaves very differently depending on where you use it. The app decides what Claude can see, which tools it can use, and whether your work is saved. Picking the right surface is half the job.`,
    deeper: `<p><strong>Think in terms of "what can Claude reach from here?"</strong> In the web app, Claude sees what you type and upload, plus any connectors you enable. In Claude Code, it can read your whole project folder and run commands. Through the API, it sees exactly what a developer sends and nothing more. When results disappoint, ask whether Claude could actually reach the information it needed.</p>
<p><strong>Most people only need two surfaces.</strong> A non-technical user will live in the web or desktop app, with the mobile app for quick questions and photos. A developer will add Claude Code. Very few people need everything on the list. Start with one and add another only when you hit a real limit.</p>
<p><strong>A chat plan and the API are separate.</strong> This confuses a lot of people. A Pro or Max subscription covers the apps and Claude Code. The API is billed separately, per token, through the Claude Console. Building your own product uses the API; using Claude yourself uses a plan.</p>`,
    takeaways: ["Choose the surface by what Claude needs to reach", "Web and desktop apps cover most non-technical work", "Claude Code is for working directly in codebases and files", "Subscriptions and API billing are separate"],
  };

  C["first-conversation"] = {
    why: `Your first message sets the direction for everything that follows. A few extra seconds of context usually saves several rounds of correction.`,
    deeper: `<p><strong>Why the first answer is often "fine but generic".</strong> When a request is short, Claude has to guess at audience, tone, length and purpose. It picks the safest middle option, which reads as generic. That's not laziness; it's the reasonable default when information is missing. Every detail you add removes a guess.</p>
<p><strong>Editing beats correcting.</strong> If you send "write a report" and then "no, shorter" and then "no, for executives", the conversation now contains three conflicting instructions. Claude has to reconcile them, and older instructions can resurface later. Editing your original message replaces the bad instruction instead of piling on top of it.</p>
<p><strong>Feedback works best when it's specific and explains why.</strong> "Make it better" gives Claude nothing to act on. "The opening is too formal for a team Slack update; start with the news, not the context" gives it a direction and a reason it can apply to the rest of the text.</p>`,
    takeaways: ["State the task, context, output format and material up front", "Treat the first answer as a draft and give specific feedback", "Edit your original message rather than stacking corrections", "One topic per chat"],
  };

  C["files-and-images"] = {
    why: `Most real work lives in documents, spreadsheets and screenshots, not in what you can type. Sharing the actual material instead of describing it is one of the fastest ways to better answers.`,
    deeper: `<p><strong>Describe the job, not just the file.</strong> "Here's a PDF" leaves Claude guessing what matters in 40 pages. "This is our supplier contract; I need to know if we can exit early and what it would cost" tells it exactly where to look and what to produce.</p>
<p><strong>Quotes make answers checkable.</strong> Asking Claude to quote the sentences it relied on turns a claim you'd have to trust into one you can verify in seconds. It also noticeably reduces made-up details, because Claude has to anchor its answer in real text.</p>
<p><strong>Spreadsheets reward specific questions.</strong> Claude can analyze data and build charts, but "analyze this" produces a tour of everything. "Which three products lost the most margin between Q2 and Q3, and why might that be?" produces an answer you can use.</p>
<p><strong>Images are read, not just seen.</strong> Claude can read text in screenshots, interpret charts, and follow diagrams. Cropping to the relevant area removes noise and makes small text legible.</p>`,
    takeaways: ["Share the real material instead of describing it", "Tell Claude what you're looking for in the file", "Ask for quotes to make answers verifiable", "Crop screenshots and strip sensitive data first"],
  };

  C["everyday-uses"] = {
    why: `The people who get the most from Claude aren't the ones with the cleverest prompts. They're the ones who've built the habit of asking. This list is a set of starting points for that habit.`,
    deeper: `<p><strong>Start with tasks you already do, not new ones.</strong> The quickest wins come from work you do every week: meeting notes, status updates, tricky emails. You already know what "good" looks like, so you can judge Claude's output instantly and refine your prompts quickly.</p>
<p><strong>Use Claude as a second brain, not just a writer.</strong> Some of the most valuable uses produce no final text at all. Asking "what am I missing?", "what would a skeptic say?", or "what questions will they ask?" improves your own thinking before a meeting or decision.</p>
<p><strong>Keep your winners.</strong> When a prompt works well, save it. A personal note of ten reliable prompts beats remembering how you phrased something three weeks ago. The Prompt Library on this site is a good starting collection.</p>`,
    takeaways: ["Build the habit on tasks you already do every week", "Use Claude to sharpen your thinking, not only to write", "Let Claude interview you when you're unsure what to ask", "Save prompts that work"],
  };

  C["safety-privacy"] = {
    why: `Trust in AI at work is earned by the person using it. Knowing how to check output and protect data is what lets you use Claude on things that actually matter.`,
    deeper: `<p><strong>Match your checking to the stakes.</strong> A brainstorm needs no fact-checking; a figure going into a board paper needs a source. A quick way to decide: ask yourself what happens if this is wrong and nobody notices. The worse the answer, the more you verify.</p>
<p><strong>Why "say if you're not sure" works.</strong> Claude tends to be helpful by default, which can nudge it toward answering even when it's uncertain. Explicitly permitting "I don't know" changes that balance. You'll get fewer answers, but far more of them will be right.</p>
<p><strong>Refusals are usually about missing context.</strong> A request like "how do lock picks work?" can look very different coming from a locksmith trainee than from an anonymous user. Explaining your situation is legitimate and often all that's needed. If a request is refused and you think it's reasonable, context is the first thing to add.</p>`,
    takeaways: ["Scale your fact-checking to the stakes", "Invite Claude to say when it's unsure", "Keep secrets and unnecessary personal data out of chats", "You remain responsible for what you use"],
  };

  // ---------- Practitioner ----------
  C["prompting-fundamentals"] = {
    why: `Prompting is just communication. These six principles are the same things a good manager does when delegating, which is why they work so reliably.`,
    deeper: `<p><strong>Modern Claude models follow instructions precisely.</strong> Earlier AI models often needed coaxing or repeated emphasis. Current models do what you ask, quite literally. That's powerful, but it means vague instructions get literal interpretations. If you want an ambitious, fully featured result, say so. Claude won't assume you wanted more than you asked for.</p>
<p><strong>Explaining "why" generalizes.</strong> A rule like "never use ellipses" covers one case. "This will be read by text-to-speech, which can't pronounce ellipses" lets Claude also avoid emoji, unusual symbols and anything else that won't read aloud well. Reasons travel further than rules.</p>
<p><strong>Examples are powerful, so use them carefully.</strong> Claude pays close attention to examples, and it will copy their length, tone and structure. If all your examples are two sentences long, expect two-sentence answers. Vary them deliberately, and label them clearly as examples.</p>
<p><strong>You don't need to shout.</strong> Capital letters and "CRITICAL: YOU MUST" were a workaround for older models. On current models they tend to cause over-application, where Claude applies the rule too rigidly. A calm, clear instruction works better.</p>`,
    takeaways: ["Be explicit about what you want, including how ambitious", "Give reasons, not just rules", "Use varied examples and label them as examples", "Structure long prompts with tags", "Describe the output you want positively and calmly"],
  };

  C["advanced-prompting"] = {
    why: `Harder tasks fail in predictable ways: rushed reasoning, lost details in long documents, and confident guesses. Each technique in this lesson targets one of those failures.`,
    deeper: `<p><strong>Chaining trades speed for control.</strong> A single mega-prompt asks Claude to extract, analyze, write and critique all at once, and you can't see where it went wrong. Splitting the work into steps lets you inspect and correct each stage. It's the same reason good teams review a plan before the build.</p>
<p><strong>The quote-first pattern is a grounding technique.</strong> When Claude extracts relevant passages before answering, its answer is anchored in real text rather than its general knowledge. This matters most with long or dense documents where the relevant sentence is easy to miss.</p>
<p><strong>Self-review works because checking is easier than creating.</strong> A second pass with a specific checklist ("did I meet all five requirements? are the numbers consistent?") catches errors the first pass made while focused on producing text. It's especially effective for code, calculations and anything with explicit requirements.</p>
<p><strong>Thinking isn't free, so use it where it pays.</strong> Extended thinking makes answers slower and uses more of your allowance. It pays off on multi-step reasoning, planning, tricky analysis and debugging. For a quick rewrite, it adds delay with little benefit.</p>`,
    takeaways: ["Chain multi-stage work so you can inspect each step", "Put documents first and ask for quotes before answers", "Ask Claude to review its work against explicit criteria", "Turn on deeper thinking for hard problems, not simple ones"],
  };

  C["prompt-teardown"] = {
    why: `Principles are easier to apply once you've seen them used. This lesson takes real, ordinary prompts and improves them step by step, with the reasoning behind each change.`,
    takeaways: ["Most weak prompts are missing audience, purpose or format", "Adding a reason often fixes several problems at once", "Examples and templates remove ambiguity about shape", "The best prompts read like a clear brief to a colleague"],
  };

  C["projects"] = {
    why: `If you've ever pasted the same background into three chats in one week, you need a Project. It turns repeated context into standing context.`,
    deeper: `<p><strong>Project instructions are a system prompt you control.</strong> They're read at the start of every chat in the Project. That makes them the right place for anything that should always be true: voice, audience, rules, and what to do when unsure. Keep one-off task details out of them.</p>
<p><strong>Quality of knowledge beats quantity.</strong> It's tempting to upload everything. But ten outdated drafts next to the current version force Claude to guess which one is right. Curate: current documents, clearly named, with outdated material removed.</p>
<p><strong>Write instructions for the edge cases.</strong> Claude will handle normal requests fine. The instructions that earn their place are the ones that cover the awkward cases: "if a customer asks about pricing, only quote the 2026 price list", "if you're unsure a product exists, ask".</p>`,
    takeaways: ["Use a Project when you repeat the same context", "Put always-true rules in instructions, not one-off tasks", "Curate knowledge files and remove outdated ones", "Share Projects so a team works from one source"],
  };

  C["artifacts"] = {
    why: `Artifacts turn Claude from something that describes things into something that builds them. For many people, a working tool is the moment AI stops feeling like a novelty.`,
    deeper: `<p><strong>Describe the user, not just the feature.</strong> "A calculator" gets a generic calculator. "A pricing calculator my sales team uses on live calls, so it needs big numbers and one-click presets" gets something shaped around how it's actually used.</p>
<p><strong>Test like a skeptical user.</strong> Artifacts can look finished and still break on empty inputs, negative numbers or small screens. Click everything and try to break it. Then report exactly what happened, and Claude can fix it precisely.</p>
<p><strong>Iterate in layers.</strong> Get it working, then get it right, then make it look good. Asking for everything at once tends to produce a polished-looking tool with hidden bugs.</p>`,
    takeaways: ["Describe who uses the artifact and how", "Test edge cases and report specific failures", "Build function first, polish last", "Artifacts can include AI features of their own"],
  };

  C["research"] = {
    why: `Claude's built-in knowledge stops at its training cutoff. Search and Research connect it to current information and let you check where each claim came from.`,
    deeper: `<p><strong>Research is only as good as the brief.</strong> A vague request produces a broad, shallow report. A good brief states the decision you're trying to make, the scope (region, time frame, company size), the structure you want, and which sources to trust.</p>
<p><strong>Ask it to flag uncertainty.</strong> "Flag anything you couldn't verify" produces a report that tells you where the soft spots are, which is exactly where you should spend your own checking time.</p>
<p><strong>Use Research for breadth, then chat for depth.</strong> A research report is a great map of a topic. Follow up in the same chat to go deeper on the two or three findings that matter most to your decision.</p>`,
    takeaways: ["Use web search for current facts, Research for multi-source reports", "Write a brief with scope, structure and trusted sources", "Ask Claude to flag what it couldn't verify", "Open and check the key citations"],
  };

  C["connectors"] = {
    why: `The biggest limit on Claude's usefulness is usually that it can't see your real information. Connectors remove that limit, safely and with your permission.`,
    deeper: `<p><strong>Connectors change the kind of question you can ask.</strong> Without them, you ask Claude to help with information you copy in. With them, you ask about your world directly: "what did the client agree to last month?" Claude searches your email and documents and answers with sources.</p>
<p><strong>Enable only what the task needs.</strong> Each active connector adds tools Claude has to choose from. A focused set makes answers faster and more accurate, and limits what Claude can reach if something goes wrong.</p>
<p><strong>Approvals are your safety net, so read them.</strong> Before sending an email or creating an event, Claude shows you what it's about to do. It's easy to click through on autopilot. The few seconds spent reading is what makes it safe to give Claude real access.</p>`,
    takeaways: ["Connectors let Claude read and act on your real data", "Most are built on the open MCP standard", "Enable the few connectors each task needs", "Always read action approvals before confirming"],
  };

  C["personalize"] = {
    why: `Personalization is a one-time investment that improves every future answer. A few sentences about you removes a layer of guessing from every chat.`,
    deeper: `<p><strong>Tell Claude your level, not just your job.</strong> "I'm a product manager" helps. "I'm technical enough to read code but I don't write it" helps far more, because it tells Claude which explanations to skip and which to include.</p>
<p><strong>Preferences, memory and styles do different jobs.</strong> Preferences are who you are and how you like answers. Memory is context Claude picks up from past conversations. Styles are how the writing sounds. Using all three well means less repeating yourself.</p>
<p><strong>Review what Claude remembers.</strong> Memory is only helpful if it's accurate. Glance at it occasionally and remove anything outdated, especially after a role or project change.</p>`,
    takeaways: ["Write profile preferences once: role, expertise, answer style", "Invite Claude to push back on your assumptions", "Use styles for voice and tone", "Review and prune memory from time to time"],
  };

  C["common-mistakes"] = {
    why: `Almost every disappointing answer traces back to a small number of causes. Once you can spot them, fixing a bad response takes seconds instead of starting over.`,
    deeper: `<p><strong>Diagnose before you rephrase.</strong> When an answer misses, most people reword the same request and try again. It's faster to ask what information was missing. Usually it's one of: audience, purpose, format, examples, or source material.</p>
<p><strong>Ask Claude why it answered that way.</strong> "What assumptions did you make about my audience?" often reveals the exact gap in your prompt. It turns a frustrating miss into a quick fix.</p>
<p><strong>Long chats degrade gradually.</strong> There's rarely a single moment where a conversation breaks. Instructions from early on get less attention as the chat grows, and topics blur together. If quality slips, a fresh chat with a short summary usually restores it.</p>`,
    takeaways: ["Diagnose what was missing before rephrasing", "Ask Claude what it assumed", "Start fresh when long chats drift", "Have Claude write or improve the prompt for you"],
  };

  // ---------- New lesson bodies (added to the course in app.js via ACADEMY.extraLessons) ----------
  ACADEMY.extraLessons = ACADEMY.extraLessons || [];

  ACADEMY.extraLessons.push({
    level: "foundations",
    after: null, // first lesson in the level
    lesson: {
      id: "how-claude-works",
      title: "How Claude works, in plain English",
      minutes: 9,
      summary: "Tokens, context windows, training and prediction: the mental model that explains Claude's strengths and quirks.",
      body: `
<p>You can drive a car without understanding engines, but knowing roughly how one works explains why it needs fuel and why it overheats. The same goes for Claude.</p>

<h2>Claude predicts text</h2>
<p>Claude is a large language model. It was trained on a very large amount of text, and then trained further to be helpful, honest and careful. When you send a message, it generates a reply piece by piece, each time choosing what should come next given everything before it.</p>
<p>That simple mechanism produces remarkable abilities: reasoning, writing, coding, analysis. It also explains the main weakness. Claude produces the most plausible continuation, and a plausible-sounding answer isn't always a true one. Fluency is not proof.</p>

<h2>Tokens: how Claude reads</h2>
<p>Claude doesn't read letters or whole words. It reads <strong>tokens</strong>, chunks of text that are often a short word or part of a longer one. A rough rule for English is that 100 tokens is about 75 words. Tokens matter because limits and pricing are measured in them, and because they explain small oddities. Counting letters in a word is surprisingly awkward when you don't see individual letters.</p>

<h2>The context window: Claude's working memory</h2>
<p>Everything Claude considers when it answers must fit into its <strong>context window</strong>: your messages, its replies, files you've shared, instructions, and tool results. Current flagship models have very large windows, enough for hundreds of pages. But the window is still finite, and a very long, cluttered conversation makes it harder for Claude to focus on what matters now.</p>
${table(["What you notice", "What's happening"], [
  ["Long chats get less sharp", "Old, irrelevant content competes for attention in the context window"],
  ["Claude forgets yesterday's chat", "A new chat starts with an empty context unless memory or a Project adds some"],
  ["It doesn't know recent news", "Its training data has a cutoff; search adds current information"],
  ["It's confidently wrong sometimes", "It generates plausible text; checking catches errors"],
  ["More context gives better answers", "Every detail you add narrows down what a good reply looks like"],
])}

<h2>Thinking before answering</h2>
<p>Modern Claude models can reason before they reply: working through a problem step by step, checking options, and catching their own mistakes. This <strong>extended thinking</strong> improves results on hard problems. The model decides how much thinking a task needs, and you can often raise or lower the effort.</p>

<h2>Tools extend what Claude can do</h2>
<p>On its own, Claude can only read and write text. With tools, it can search the web, run code, read your files, or use your apps. Tools are how Claude checks facts, does exact calculations, and takes actions. You'll see them throughout this course.</p>
${note("The one-line summary", "Claude is a very capable text predictor with a finite working memory, a knowledge cutoff, and optional tools. Nearly every tip in this course follows from that sentence.")}
`,
    },
  });

  ACADEMY.extraLessons.push({
    level: "practitioner",
    after: "advanced-prompting",
    lesson: {
      id: "prompt-teardown",
      title: "Prompt teardowns: five prompts, rebuilt",
      minutes: 14,
      summary: "Real, everyday prompts improved step by step, with commentary on why each change helps.",
      body: `
<p>Each teardown shows an ordinary prompt, what goes wrong with it, and a rebuilt version. The commentary explains the reasoning, because the reasoning is what you'll reuse.</p>

<h2>1. The status update</h2>
${compare("Write a project update.", "Write this week's update on the website redesign for our leadership team (5 senior managers, skim-readers). Lead with whether we're on track for the 14 November launch. Then 3 bullets: progress, risks, decisions needed. Under 150 words. Notes: <em>[paste]</em>")}
<p><strong>Commentary:</strong> The original gives Claude nothing about audience, so it writes for everyone and no one. Naming leadership as skim-readers changes the whole shape: the answer comes first, detail is short, and "decisions needed" appears because that's what leaders act on. The notes supply facts, so Claude isn't inventing progress.</p>

<h2>2. The customer complaint</h2>
${compare("Reply to this angry customer.", "Reply to this customer on behalf of our support team. They're right that the delivery was late; the courier lost the parcel. Acknowledge that clearly, don't blame the courier by name, offer a full refund or free express reshipping (their choice), and keep it under 120 words. Warm, human, no corporate phrases like \"we apologize for any inconvenience\".")}
<p><strong>Commentary:</strong> The rebuilt prompt settles the three things Claude can't know: whether the customer is right, what remedy you can offer, and what tone your brand uses. Banning a specific stock phrase works better than "don't sound corporate", because it's concrete.</p>

<h2>3. Summarizing a long report</h2>
${compare("Summarize this report.", "<code>&lt;report&gt;</code>...<code>&lt;/report&gt;</code><br>I'm deciding whether to renew this vendor. Summarize only what's relevant to that decision: performance against SLA, cost trend, and any risks. For each point, quote the sentence it's based on. Finish with a one-line recommendation.")}
<p><strong>Commentary:</strong> "Summarize" asks for a smaller version of everything. Stating the decision turns the summary into a filter: Claude keeps what matters for renewal and drops the rest. Quotes make it checkable, and placing the document first with the question after improves accuracy on long material.</p>

<h2>4. Brainstorming</h2>
${compare("Give me ideas for a team offsite.", "Give me 15 ideas for a one-day offsite for a remote team of 12 engineers who rarely meet. Budget about £100 per person, central London, mixed fitness levels, some non-drinkers. Goal: build trust across two teams that recently merged. Mix low-key and ambitious options. Then pick your top 3 and explain why.")}
<p><strong>Commentary:</strong> Constraints make brainstorms better, not worse. Budget, location, fitness and drinking narrow the space to ideas you could actually use. The stated goal (trust after a merge) lets Claude judge ideas, and asking for a top three with reasons gives you a recommendation, not just a list.</p>

<h2>5. A reusable instruction</h2>
${compare("You are a helpful assistant. Be concise. NEVER make things up!!!", "You help our sales team answer product questions during customer calls, so answers need to be readable in a few seconds: lead with the direct answer in one sentence, then up to 3 short supporting bullets. Only use facts from the product catalogue in project knowledge. If the catalogue doesn't cover a question, say \"Not in the catalogue\" so the rep knows to follow up, rather than guessing.")}
<p><strong>Commentary:</strong> "Be concise" and "never make things up" are right in spirit but give Claude no way to act on them. The rebuilt version explains the situation (live calls), which justifies the format, and gives an exact fallback phrase for missing information. Notice there's no shouting; the reason does the work.</p>

${pro("The pattern behind all five", "Every rebuilt prompt answers the same questions: who is this for, what decision or action does it support, what should the output look like, and what should Claude do when it's unsure. Ask yourself those four questions before any important prompt.")}
`,
    },
  });
})();
