# Claude Academy

A self-paced training website for Claude, from your first chat to production agents on the API.

## What's inside

| Level | For | Covers |
|---|---|---|
| 1. Foundations | Complete beginners | What Claude is, where to use it, first conversations, files and images, everyday uses, accuracy and privacy |
| 2. Practitioner | Regular users | Prompting fundamentals and advanced techniques, Projects, artifacts, Research, connectors, memory and styles, common mistakes |
| 3. Builder | Developers | Coding in chat, Claude Code setup and workflow, CLAUDE.md, permissions, skills, hooks, MCP, subagents, headless mode and CI |
| 4. Architect | AI product engineers | API quickstart, Messages API, thinking and effort, tool use, structured outputs, documents and citations, caching and cost, agent design, evals, production |

Plus a prompt library, cheat sheets, a glossary, learning paths by role, a quiz for each level, full-text search, progress tracking (stored in your browser) and light/dark themes.

## Run it

It's a static site with no build step and no dependencies.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly, or deploy the folder to any static host (GitHub Pages, Netlify, Vercel, S3).

## Project layout

```
index.html                 page shell
css/style.css              all styles and theme tokens
js/helpers.js              authoring helpers (code blocks, callouts, tables)
js/content-foundations.js  Level 1 lessons + quiz
js/content-practitioner.js Level 2 lessons + quiz
js/content-builder.js      Level 3 lessons + quiz
js/content-architect.js    Level 4 lessons + quiz
js/content-reference.js    prompt library, cheat sheets, glossary, learning paths
js/app.js                  routing, navigation, search, progress, quizzes
```

## Adding a lesson

Add an object to the `lessons` array in the right `content-*.js` file:

```js
{
  id: "my-lesson",            // used in the URL: #my-lesson
  title: "My lesson",
  minutes: 8,
  summary: "One sentence shown under the title and in search.",
  body: `<p>HTML content.</p>${code("python", `print("hi")`)}`,
}
```

Helpers available in content files: `code`, `tip`, `warn`, `pro`, `note`, `compare`, `table`, `steps`, `exercise`.

Model names, parameters and product features change often. Review the Architect and Builder levels against the official docs when new models ship.
