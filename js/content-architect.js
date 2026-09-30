/* Level 4 — Architect: building products and agents on the Claude API. */
(function () {
  const { code, tip, warn, pro, note, compare, table, steps, exercise } = H;

  ACADEMY.levels.push({
    id: "architect",
    n: 4,
    name: "Architect",
    color: "--l4",
    tagline: "Build on the Claude API. Tool use, structured outputs, caching, agents, evals and production operations.",
    audience: "Engineers shipping Claude-powered products",
    lessons: [
      {
        id: "api-quickstart",
        title: "API quickstart",
        minutes: 10,
        summary: "Get a key, install the SDK, and make your first request in Python or TypeScript.",
        body: `
${steps([
  "Create an account in the Claude Console and add billing.",
  "Create an API key and store it as an environment variable. Never commit it.",
  "Install the official SDK for your language.",
  "Send a message.",
])}
${code("bash", `
export ANTHROPIC_API_KEY="sk-ant-..."
pip install anthropic          # Python
npm install @anthropic-ai/sdk  # TypeScript / JavaScript
`, "Terminal")}
${code("python", `
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from the environment

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": "Explain recursion in two sentences."}],
)

for block in response.content:
    if block.type == "text":
        print(block.text)
`, "hello.py")}
${code("typescript", `
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const response = await client.messages.create({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  messages: [{ role: "user", content: "Explain recursion in two sentences." }],
});

for (const block of response.content) {
  if (block.type === "text") console.log(block.text);
}
`, "hello.ts")}
<p>Official SDKs also exist for Java, Go, Ruby, C# and PHP. Everything goes through one endpoint: <code>POST /v1/messages</code>.</p>
${table(["Model ID", "Use"], [
  ["<code>claude-fable-5-1</code>", "Most capable; hardest reasoning and long-horizon agents"],
  ["<code>claude-opus-5-5</code>", "Default choice for complex work and coding"],
  ["<code>claude-sonnet-5-5</code>", "Fast, capable, lower cost"],
  ["<code>claude-haiku-4-5</code>", "Fastest and cheapest; high volume, sub-agents"],
])}
${tip("Use exact model IDs", "Copy model IDs exactly from the docs. Query <code>client.models.list()</code> to discover models, context windows and capabilities at runtime.")}
`,
      },
      {
        id: "messages-anatomy",
        title: "Anatomy of the Messages API",
        minutes: 12,
        summary: "System prompts, conversation turns, content blocks, stop reasons, usage, and streaming.",
        body: `
<h2>The request</h2>
${table(["Field", "Purpose"], [
  ["<code>model</code>", "Which Claude model to use"],
  ["<code>max_tokens</code>", "Hard cap on output length. Don't set it too low or answers get cut off"],
  ["<code>system</code>", "Instructions, role and rules that apply to the whole conversation"],
  ["<code>messages</code>", "Alternating <code>user</code> / <code>assistant</code> turns. The API is stateless, so send the full history each time"],
  ["<code>tools</code>", "Functions Claude may call"],
  ["<code>thinking</code>, <code>output_config</code>", "Reasoning mode, effort level and structured output format"],
])}
<h2>The response</h2>
<ul>
  <li><code>content</code>: a list of blocks (<code>text</code>, <code>thinking</code>, <code>tool_use</code>…). Check each block's <code>type</code>.</li>
  <li><code>stop_reason</code>: why it stopped. <code>end_turn</code>, <code>max_tokens</code> (truncated), <code>tool_use</code> (wants to call a tool), <code>pause_turn</code>, or <code>refusal</code>.</li>
  <li><code>usage</code>: input, output and cache token counts. This is what you pay for.</li>
</ul>
<h2>Multi-turn conversations</h2>
${code("python", `
messages = []

def chat(user_text):
    messages.append({"role": "user", "content": user_text})
    response = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=16000,
        system="You are a concise tutor for high-school chemistry.",
        messages=messages,
    )
    # Append the full content, not just the text, so nothing is lost
    messages.append({"role": "assistant", "content": response.content})
    return "".join(b.text for b in response.content if b.type == "text")
`)}
<h2>Streaming</h2>
<p>Stream long responses so users see output immediately and requests don't hit HTTP timeouts.</p>
${code("python", `
with client.messages.stream(
    model="claude-opus-5-5",
    max_tokens=64000,
    messages=[{"role": "user", "content": "Write a short story about a lighthouse."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()  # full message with usage
`)}
${warn("No prefill on current models", "Older guides suggest prefilling the start of the assistant's reply to force a format. Current models reject that. Use structured outputs or clear instructions instead.")}
`,
      },
      {
        id: "thinking-effort",
        title: "Thinking and effort",
        minutes: 8,
        summary: "Control how much Claude reasons, and trade cost and latency against quality.",
        body: `
<p>Current Claude models use <strong>adaptive thinking</strong>: the model decides when and how much to reason. You steer it with the <strong>effort</strong> parameter.</p>
${code("python", `
response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},  # show a readable summary
    output_config={"effort": "high"},  # low | medium | high | xhigh | max
    messages=[{"role": "user", "content": "Design a rate limiter for a multi-region API."}],
)
`)}
${table(["Effort", "Good for"], [
  ["<code>low</code>", "Chat, classification, simple extraction, sub-agents"],
  ["<code>medium</code>", "Everyday work; a cost-saving step down when quality holds"],
  ["<code>high</code>", "Intelligence-sensitive tasks"],
  ["<code>xhigh</code>", "Most coding and agentic work"],
  ["<code>max</code>", "When correctness matters more than cost"],
])}
${note("Defaults differ by model", "Claude Opus 5.5 defaults to <code>medium</code> effort; most other current models default to <code>high</code>. Set it explicitly so behavior doesn't change when you switch models.")}
${warn("Outdated pattern", "<code>budget_tokens</code> (a fixed thinking budget) is deprecated and rejected by the newest models. Use adaptive thinking plus effort.")}
${pro("Measure, don't guess", "Try the most capable model at a lower effort before building a multi-model cascade. It's often as good and simpler. Judge cost per completed task, not per request.")}
`,
      },
      {
        id: "tool-use",
        title: "Tool use (function calling)",
        minutes: 15,
        summary: "Let Claude call your functions: define tools, run the loop, handle errors and parallel calls.",
        body: `
<p>Tool use lets Claude ask your code to do things: look up an order, query a database, send an email. You describe tools with a name, a description and a JSON schema. Claude decides when to call them; your code executes them and sends back the results.</p>
<h2>The loop</h2>
${steps([
  "You send messages plus tool definitions.",
  "Claude replies with <code>stop_reason: \"tool_use\"</code> and one or more <code>tool_use</code> blocks.",
  "You run each tool and reply with <code>tool_result</code> blocks, all in a single user message.",
  "Repeat until <code>stop_reason</code> is <code>end_turn</code>.",
])}
${code("python", `
import json
import anthropic

client = anthropic.Anthropic()

tools = [{
    "name": "get_order_status",
    "description": "Look up the shipping status of a customer order by its ID. "
                   "Use when the user asks where their order is.",
    "input_schema": {
        "type": "object",
        "properties": {"order_id": {"type": "string", "description": "e.g. ORD-1234"}},
        "required": ["order_id"],
        "additionalProperties": False,
    },
    "strict": True,  # guarantees inputs match the schema
}]

def get_order_status(order_id):
    return {"order_id": order_id, "status": "shipped", "eta": "2026-10-03"}

messages = [{"role": "user", "content": "Where is order ORD-1234?"}]

while True:
    response = client.messages.create(
        model="claude-opus-5-5", max_tokens=16000, tools=tools, messages=messages,
    )
    messages.append({"role": "assistant", "content": response.content})
    if response.stop_reason != "tool_use":
        break

    results = []
    for block in response.content:
        if block.type == "tool_use":
            try:
                output = get_order_status(**block.input)
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                "content": json.dumps(output)})
            except Exception as e:
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                "content": str(e), "is_error": True})
    messages.append({"role": "user", "content": results})  # all results, one message

print(response.content[-1].text)
`, "tool_loop.py")}
<h2>Or let the SDK run the loop</h2>
${code("python", `
from anthropic import beta_tool

@beta_tool
def get_order_status(order_id: str) -> str:
    """Look up the shipping status of a customer order.

    Args:
        order_id: The order ID, e.g. ORD-1234.
    """
    return '{"status": "shipped", "eta": "2026-10-03"}'

runner = client.beta.messages.tool_runner(
    model="claude-opus-5-5",
    max_tokens=16000,
    tools=[get_order_status],
    messages=[{"role": "user", "content": "Where is order ORD-1234?"}],
)
for message in runner:
    print(message)
`, "Tool Runner")}
<h2>Tool design tips</h2>
<ul>
  <li><strong>Descriptions are prompts.</strong> Explain what the tool does, when to use it, and what each parameter means.</li>
  <li><strong>Fewer, better tools.</strong> One well-designed tool beats five overlapping ones.</li>
  <li><strong>Return useful errors</strong> with <code>is_error: true</code> so Claude can recover.</li>
  <li><strong>Return compact results.</strong> Huge tool outputs eat context.</li>
</ul>
${note("Anthropic-hosted tools", "Web search, web fetch and code execution run on Anthropic's servers. Declare them in <code>tools</code> and results come back in the same response, with no loop code needed.")}
`,
      },
      {
        id: "structured-outputs",
        title: "Structured outputs",
        minutes: 8,
        summary: "Get guaranteed, schema-valid JSON for extraction, classification and data pipelines.",
        body: `
<p>When code will consume Claude's answer, use structured outputs. The response is guaranteed to match your schema, so no fragile parsing is needed.</p>
${code("python", `
from pydantic import BaseModel

class Lead(BaseModel):
    name: str
    email: str
    company_size: int
    interested_in: list[str]

response = client.messages.parse(
    model="claude-opus-5-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": "Extract the lead: Priya Shah (priya@acme.io), "
               "120-person team, asking about SSO and audit logs."}],
    output_format=Lead,
)
lead = response.parsed_output  # a validated Lead instance
print(lead.interested_in)
`, "Python with Pydantic")}
${code("python", `
response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": "Classify: 'The app crashes on login'"}],
    output_config={
        "format": {
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "category": {"type": "string", "enum": ["bug", "feature", "question"]},
                    "severity": {"type": "string", "enum": ["low", "medium", "high"]},
                },
                "required": ["category", "severity"],
                "additionalProperties": False,
            },
        }
    },
)
`, "Raw JSON schema")}
${tip("Two flavors", "Use <code>output_config.format</code> to shape the final answer, and <code>strict: true</code> on a tool to guarantee its input arguments.")}
`,
      },
      {
        id: "context-files",
        title: "Documents, images, citations and files",
        minutes: 9,
        summary: "Send PDFs and images, get citations back, and reuse uploads with the Files API.",
        body: `
${code("python", `
import base64

pdf_data = base64.standard_b64encode(open("report.pdf", "rb").read()).decode()

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    messages=[{
        "role": "user",
        "content": [
            {"type": "document",
             "source": {"type": "base64", "media_type": "application/pdf", "data": pdf_data},
             "citations": {"enabled": True}},
            {"type": "text", "text": "What were Q3 revenue and margin? Cite the pages."},
        ],
    }],
)
`, "PDF with citations")}
<ul>
  <li><strong>Images:</strong> send <code>{"type": "image", "source": {...}}</code> blocks. Claude reads charts, screenshots, handwriting and diagrams.</li>
  <li><strong>Citations:</strong> answers come back split into text blocks, each pointing to the exact passage (page or character range) it relied on.</li>
  <li><strong>Files API:</strong> upload once with <code>client.files.upload(...)</code>, then reference the <code>file_id</code> in many requests.</li>
  <li><strong>Context windows:</strong> current Opus, Sonnet and Fable models accept up to 1M tokens, which is enough for large codebases or hundreds of pages.</li>
</ul>
${tip("Documents first", "As in chat: long documents at the top, your question at the end.")}
`,
      },
      {
        id: "caching-cost",
        title: "Prompt caching, batches and cost control",
        minutes: 11,
        summary: "Cut cost and latency dramatically by reusing prompt prefixes and batching offline work.",
        body: `
<h2>Prompt caching</h2>
<p>If many requests share a long prefix (a system prompt, tool definitions, a big document), cache it. Cached reads cost a fraction of normal input tokens and are faster.</p>
${code("python", `
response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    system=[{
        "type": "text",
        "text": LONG_STABLE_INSTRUCTIONS_AND_DOCS,
        "cache_control": {"type": "ephemeral"},  # cache everything up to here
    }],
    messages=[{"role": "user", "content": user_question}],
)
print(response.usage.cache_read_input_tokens)  # > 0 on cache hits
`)}
${warn("Caching is a prefix match", "Any change in the prefix, even a timestamp in the system prompt, unsorted JSON, or a different tool list, invalidates everything after it. Stable content goes first; variable content goes last. Verify with <code>cache_read_input_tokens</code>.")}
<h2>Message Batches</h2>
<p>For work that doesn't need an instant answer (nightly classification, evals, bulk summarization), the Batches API processes large volumes asynchronously at about half the price. Results can arrive in any order, so match them by <code>custom_id</code>.</p>
<h2>The cost-control checklist</h2>
${table(["Lever", "Effect"], [
  ["Prompt caching", "Big savings on repeated prefixes. Do this first"],
  ["Trim input", "Send only relevant context; keep tool results compact"],
  ["Batches", "About 50% off for non-urgent work"],
  ["Effort", "Lower effort for simple routes"],
  ["Model choice", "Smaller models for high-volume, simple tasks"],
  ["Count tokens", "<code>messages.count_tokens</code> before sending huge prompts"],
])}
`,
      },
      {
        id: "agents",
        title: "Designing agents",
        minutes: 14,
        summary: "When to build an agent, the four ways to build one, and the design principles that make agents reliable.",
        body: `
<h2>Start with the simplest thing that works</h2>
${table(["Tier", "What it is", "Example"], [
  ["Single call", "One request, one response", "Summarize, classify, extract"],
  ["Workflow", "Your code orchestrates fixed steps, some calling Claude", "Extract, then validate, then draft, then review"],
  ["Agent", "Claude decides the steps and tools in a loop", "\"Investigate this bug and open a PR\""],
])}
<p>Build an agent only when the task is hard to specify in advance, valuable enough to justify cost and latency, something Claude can do well, and where errors can be caught (tests, review, rollback).</p>

<h2>Four ways to build an agent</h2>
${table(["Approach", "You write", "Best when"], [
  ["<strong>Manual loop</strong> on the Messages API", "The whole tool loop", "You want full control"],
  ["<strong>Tool Runner</strong> (SDK helper)", "Just the tool functions", "Custom-tool agents without loop boilerplate"],
  ["<strong>Claude Agent SDK</strong>", "A prompt and options", "You want Claude Code's harness (files, bash, search, subagents, hooks) in your own app"],
  ["<strong>Managed Agents</strong>", "Agent config and your tool results", "Anthropic hosts the loop and a sandboxed workspace per session; long-running, scheduled or persistent agents"],
])}

<h2>Design principles</h2>
<ul>
  <li><strong>Give the full task up front.</strong> Goal, constraints, definition of done, and how to verify.</li>
  <li><strong>Tools are the interface.</strong> Invest in clear names, descriptions, and helpful error messages.</li>
  <li><strong>Manage context.</strong> Use compaction for long sessions, clear stale tool results, and give the agent a memory file or progress notes.</li>
  <li><strong>Delegate.</strong> Sub-agents handle reading-heavy side quests and return summaries.</li>
  <li><strong>Verify.</strong> Tests, checks and graders beat hoping the output is right.</li>
  <li><strong>Guardrails.</strong> Least-privilege tools, human approval for irreversible actions, sandboxes, budgets and turn limits.</li>
</ul>
${warn("Prompt injection", "Anything an agent reads (web pages, emails, documents, tool output) can contain malicious instructions. Treat tool results as data, not commands. Restrict what an agent can do after reading untrusted content, and require confirmation for sensitive actions.")}
`,
      },
      {
        id: "evals",
        title: "Evals: measuring quality",
        minutes: 10,
        summary: "Build a test set, grade outputs, and improve prompts with evidence instead of vibes.",
        body: `
<p>An <strong>eval</strong> is a set of realistic inputs plus a way to score outputs. It's how you know whether a prompt change, model switch or effort setting actually helped.</p>
${steps([
  "<strong>Define success.</strong> Specific and measurable: \"Correct category on 95% of tickets\", \"Never gives a refund policy that isn't in the docs\".",
  "<strong>Collect cases.</strong> 50 to 200 real examples, including edge cases and past failures. Real traffic beats synthetic.",
  "<strong>Pick grading.</strong> Exact match or code checks where possible; an LLM judge with a clear rubric for open-ended output; human review to calibrate the judge.",
  "<strong>Run and record.</strong> Save scores, cost and latency per version.",
  "<strong>Iterate.</strong> Change one thing at a time. Keep a held-out test set so you don't overfit.",
])}
${code("python", `
JUDGE_RUBRIC = """Score the support reply 1-5 on each:
- accuracy: every factual claim is supported by <policy>
- resolution: it resolves the customer's actual question
- tone: warm, concise, no blame
Return JSON: {"accuracy": n, "resolution": n, "tone": n, "notes": "..."}"""

def judge(policy, question, reply):
    response = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=2000,
        system=JUDGE_RUBRIC,
        messages=[{"role": "user", "content":
            f"<policy>{policy}</policy>\\n<question>{question}</question>\\n<reply>{reply}</reply>"}],
    )
    return response.content[-1].text
`, "LLM-as-judge sketch")}
${pro("Evals are the moat", "Teams that ship great AI products aren't the ones with clever prompts. They're the ones that can prove a change is better within an hour.")}
`,
      },
      {
        id: "production",
        title: "Production readiness",
        minutes: 11,
        summary: "Errors and retries, refusals and fallbacks, rate limits, security, monitoring and model upgrades.",
        body: `
<h2>Errors and retries</h2>
<ul>
  <li>The SDKs retry connection errors, 408, 409, 429 and 5xx responses automatically (2 retries by default).</li>
  <li>Handle specific errors separately. Rate limits and overloads are retryable; bad requests (400) are bugs to fix.</li>
  <li>Always check <code>stop_reason</code>. <code>max_tokens</code> means truncated; <code>refusal</code> means the model declined.</li>
</ul>
${code("python", `
try:
    response = client.messages.create(...)
except anthropic.RateLimitError:
    ...  # back off, queue, or shed load
except anthropic.BadRequestError as e:
    ...  # a bug in the request: log and fix
except anthropic.APIStatusError as e:
    ...  # other API errors: e.status_code
except anthropic.APIConnectionError:
    ...  # network problems
`)}
<h2>Refusals and fallbacks</h2>
<p>Safety classifiers can decline some requests, returning <code>stop_reason: "refusal"</code>. Show users a helpful message, and consider the API's server-side fallback option, which retries a refused request on another model automatically.</p>
<h2>Security checklist</h2>
${table(["Area", "Practice"], [
  ["Keys", "Store in a secrets manager; separate keys per environment; rotate"],
  ["Input", "Treat user and tool content as untrusted; wrap it in clearly labeled tags"],
  ["Output", "Validate before executing or rendering. Never <code>eval</code> model output"],
  ["Actions", "Least privilege; human approval for money, deletion, external messages"],
  ["Data", "Only send what's needed; review retention settings for your organization"],
])}
<h2>Operating in production</h2>
<ul>
  <li>Log requests, responses, token usage, latency and stop reasons.</li>
  <li>Set spend limits and alerts in the Console.</li>
  <li>Pin model IDs; upgrade deliberately by running your evals on the new model first.</li>
  <li>Read the migration notes for each new model: parameters and defaults change between generations.</li>
</ul>
${note("Where to go next", "The official Claude developer docs, the Anthropic cookbook on GitHub, the Claude Code docs, and Anthropic's courses and engineering blog.")}
`,
      },
    ],
    quiz: [
      { q: "A multi-hour agent keeps losing track after compaction. What helps most?", options: ["A longer system prompt", "An external progress file the agent updates and re-reads", "Raising temperature", "Removing all tools"], answer: 1, why: "External memory survives compaction and new sessions." },
      { q: "The API is stateless. How do you have a multi-turn conversation?", options: ["Pass a conversation_id", "Send the full message history with each request", "The API remembers automatically", "Use a system prompt"], answer: 1, why: "Every request includes the whole conversation so far." },
      { q: "Claude returns two tool_use blocks in one response. How do you send results back?", options: ["Two separate user messages", "Both tool_result blocks in one user message", "Only the first result", "As a system prompt"], answer: 1, why: "All results go in one message; splitting them discourages parallel tool calls." },
      { q: "Your cache hit rate is zero. What's a likely culprit?", options: ["The model is too small", "A timestamp in the system prompt changes every request", "max_tokens is too high", "Streaming is on"], answer: 1, why: "Caching is a prefix match. Any change to the prefix invalidates it." },
      { q: "What replaced fixed thinking budgets (budget_tokens) on current models?", options: ["temperature", "Adaptive thinking plus the effort parameter", "top_k", "Prefill"], answer: 1, why: "Adaptive thinking decides how much to reason; effort steers depth and spend." },
      { q: "You need guaranteed schema-valid JSON for a pipeline. What do you use?", options: ["Ask nicely for JSON", "Structured outputs (output_config.format or messages.parse)", "Assistant prefill", "A higher temperature"], answer: 1, why: "Structured outputs guarantee the schema." },
      { q: "Which approach gives you Claude Code's full harness as a library?", options: ["Tool Runner", "Claude Agent SDK", "Batches API", "Files API"], answer: 1, why: "The Agent SDK packages Claude Code's loop, tools and context management." },
    ],
  });
})();
