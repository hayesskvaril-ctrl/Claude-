/* Claude Academy — router, navigation, progress, search, quizzes. No dependencies. */
(function () {
  const { levels, prompts, glossary, sheets, paths } = ACADEMY;
  const esc = H.esc;
  const $ = (sel, root = document) => root.querySelector(sel);
  const main = $("#main");

  // ---------- Storage (fails soft: private windows, blocked storage) ----------
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ } },
  };
  let done = new Set(store.get("ca-done", []));
  let quizScores = store.get("ca-quiz", {});
  const saveDone = () => store.set("ca-done", [...done]);

  // ---------- Index ----------
  // Slot the deep-dive lessons from commentary-*.js into their levels.
  (ACADEMY.extraLessons || []).forEach(({ level, after, lesson }) => {
    const list = levels.find((l) => l.id === level).lessons;
    const at = after ? list.findIndex((l) => l.id === after) + 1 : 0;
    list.splice(at, 0, lesson);
  });
  const commentary = ACADEMY.commentary || {};
  const levelIntro = ACADEMY.levelIntro || {};
  const lessons = [];
  levels.forEach((lvl) => lvl.lessons.forEach((l, i) => lessons.push({ ...l, ...commentary[l.id], level: lvl, index: i })));
  const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]));
  const levelById = Object.fromEntries(levels.map((l) => [l.id, l]));
  const lc = (lvl) => `style="--lc: var(${lvl.color})"`;
  const stripTags = (html) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ");

  // ---------- Theme ----------
  const themeBtn = $("#themeBtn");
  const savedTheme = store.get("ca-theme", null);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("ca-theme", next);
  });

  // ---------- Sidebar ----------
  const collapsed = new Set(store.get("ca-collapsed", ["practitioner", "builder", "architect"]));
  function renderNav(currentId) {
    // Always show the level that holds the current page.
    const owner = lessonById[currentId]?.level.id || currentId.replace(/^(level|quiz)-/, "");
    if (levelById[owner]) collapsed.delete(owner);
    $("#courseNav").innerHTML = levels.map((lvl) => {
      const count = lvl.lessons.filter((l) => done.has(l.id)).length;
      return `<div class="nav-level ${collapsed.has(lvl.id) ? "collapsed" : ""}" ${lc(lvl)} data-level="${lvl.id}">
        <button type="button" aria-expanded="${!collapsed.has(lvl.id)}"><span class="lvl-dot"></span>${lvl.n}. ${lvl.name}<span class="lvl-count num">${count}/${lvl.lessons.length}</span><span class="chev">▾</span></button>
        <ul>
          <li><a href="#level-${lvl.id}" class="${currentId === "level-" + lvl.id ? "current" : ""}"><span class="tick"></span>Overview</a></li>
          ${lvl.lessons.map((l) => `<li><a href="#${l.id}" class="${currentId === l.id ? "current" : ""}"><span class="tick">${done.has(l.id) ? "✓" : ""}</span>${esc(l.title)}</a></li>`).join("")}
          <li><a href="#quiz-${lvl.id}" class="${currentId === "quiz-" + lvl.id ? "current" : ""}"><span class="tick">${quizScores[lvl.id] != null ? "✓" : ""}</span>Level quiz</a></li>
        </ul>
      </div>`;
    }).join("");
    const total = lessons.length;
    $("#progressText").textContent = `${done.size} / ${total} lessons`;
    $("#progressFill").style.width = `${(done.size / total) * 100}%`;
  }
  $("#courseNav").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-level > button");
    if (!btn) return;
    const id = btn.parentElement.dataset.level;
    collapsed.has(id) ? collapsed.delete(id) : collapsed.add(id);
    store.set("ca-collapsed", [...collapsed]);
    btn.parentElement.classList.toggle("collapsed");
    btn.setAttribute("aria-expanded", !collapsed.has(id));
  });

  const sidebar = $("#sidebar"), scrim = $("#scrim"), menuBtn = $("#menuBtn");
  function setMenu(open) {
    sidebar.classList.toggle("open", open);
    scrim.hidden = !open;
    menuBtn.setAttribute("aria-expanded", open);
  }
  menuBtn.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
  scrim.addEventListener("click", () => setMenu(false));

  $("#resetBtn").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    if (btn.dataset.confirm !== "1") {
      btn.dataset.confirm = "1";
      btn.textContent = "Click again to reset all progress";
      setTimeout(() => { btn.dataset.confirm = ""; btn.textContent = "Reset progress"; }, 4000);
      return;
    }
    done = new Set(); quizScores = {};
    saveDone(); store.set("ca-quiz", quizScores);
    btn.dataset.confirm = ""; btn.textContent = "Progress reset";
    route();
  });

  // ---------- Views ----------
  function viewHome() {
    const next = lessons.find((l) => !done.has(l.id));
    const rungs = levels.map((lvl) => {
      const count = lvl.lessons.filter((l) => done.has(l.id)).length;
      const mins = lvl.lessons.reduce((s, l) => s + l.minutes, 0);
      return `<a class="rung" href="#level-${lvl.id}" ${lc(lvl)}>
        <span class="lv">Level ${lvl.n}</span>
        <h3>${lvl.name}</h3>
        <p>${lvl.tagline}</p>
        <div class="meta"><span>${lvl.lessons.length} lessons · ${mins} min</span><span class="num">${count}/${lvl.lessons.length}</span></div>
        <div class="mini-bar"><span style="width:${(count / lvl.lessons.length) * 100}%"></span></div>
      </a>`;
    }).join("");
    const quickWins = ["first-conversation", "prompting-fundamentals", "claude-code-intro", "tool-use", "agentic-workflow", "projects"]
      .map((id) => lessonById[id]).map((l) => `<a class="tile" href="#${l.id}" ${lc(l.level)}><span class="tag">${l.level.name} · ${l.minutes} min</span><h3>${esc(l.title)}</h3><p>${esc(l.summary)}</p></a>`).join("");
    return `<div class="wide">
      <section class="hero">
        <span class="eyebrow">Free, self-paced Claude training</span>
        <h1>Get brilliant at Claude.</h1>
        <p class="lede">Everything in one place, from your very first question to shipping agents on the API. Plain-English lessons with expert commentary, copy-ready prompts and code, and quizzes to check you've got it.</p>
        <div class="btn-row">
          <a class="btn btn-light" href="#${next ? next.id : "prompts"}">${done.size ? "Continue: " + esc(next ? next.title : "Prompt library") : "Start learning"} →</a>
          <a class="btn btn-outline-light" href="#paths">Find your path</a>
        </div>
        <div class="hero-stats">
          <div><strong class="num">${lessons.length}</strong><span>lessons</span></div>
          <div><strong class="num">4</strong><span>levels</span></div>
          <div><strong class="num">${levels.reduce((s, l) => s + l.quiz.length, 0)}</strong><span>quiz questions</span></div>
          <div><strong class="num">${prompts.length}</strong><span>ready-made prompts</span></div>
        </div>
      </section>
      <h2 class="section-h">The four levels</h2>
      <p class="section-sub">Each level builds on the one before it. Skip ahead if you already know the basics.</p>
      <div class="ladder">${rungs}</div>
      <h2 class="section-h">Most popular lessons</h2>
      <p class="section-sub">Short on time? These give the biggest improvement fastest.</p>
      <div class="grid-3">${quickWins}</div>
      <section class="band-section">
      <h2 class="section-h">Keep these open while you work</h2>
      <p class="section-sub">Quick reference for when you just need the answer.</p>
      <div class="grid-3">
        <a class="tile" href="#prompts"><span class="tag">${prompts.length} templates</span><h3>Prompt library</h3><p>Copy-ready prompts for writing, analysis, coding and building.</p></a>
        <a class="tile" href="#cheatsheets"><span class="tag">${sheets.length} sheets</span><h3>Cheat sheets</h3><p>Claude Code commands, API parameters, stop reasons, model choice.</p></a>
        <a class="tile" href="#glossary"><span class="tag">${glossary.length} terms</span><h3>Glossary</h3><p>Every term from token to prompt injection, in plain English.</p></a>
      </div>
      </section>
    </div>`;
  }

  function viewLevel(lvl) {
    const mins = lvl.lessons.reduce((s, l) => s + l.minutes, 0);
    return `<div class="wrap" ${lc(lvl)}>
      <div class="crumbs"><a href="#home">Home</a> / <span>Level ${lvl.n}</span></div>
      <header class="lesson-head">
        <h1>Level ${lvl.n}: ${lvl.name}</h1>
        <p class="summary">${lvl.tagline}</p>
        <div class="chips"><span class="chip level">For: ${lvl.audience}</span><span class="chip">${lvl.lessons.length} lessons</span><span class="chip">~${mins} min</span><span class="chip">Quiz: ${lvl.quiz.length} questions</span></div>
      </header>
      ${levelIntro[lvl.id] ? `<section class="level-intro">
        <div class="prose">${levelIntro[lvl.id].intro}</div>
        <div class="outcomes"><h2>By the end of this level you'll be able to</h2><ul>${levelIntro[lvl.id].outcomes.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>
      </section>` : ""}
      <h2 class="section-h">Lessons</h2>
      <div class="grid-2">
        ${lvl.lessons.map((l, i) => `<a class="tile" href="#${l.id}" ${lc(lvl)}><span class="tag">Lesson ${i + 1} · ${l.minutes} min ${done.has(l.id) ? "· ✓ done" : ""}</span><h3>${esc(l.title)}</h3><p>${esc(l.summary)}</p></a>`).join("")}
        <a class="tile" href="#quiz-${lvl.id}" ${lc(lvl)}><span class="tag">Check yourself ${quizScores[lvl.id] != null ? "· best " + quizScores[lvl.id] + "/" + lvl.quiz.length : ""}</span><h3>Level ${lvl.n} quiz</h3><p>${lvl.quiz.length} questions with explanations.</p></a>
      </div>
    </div>`;
  }

  function viewLesson(l) {
    const lvl = l.level;
    const pos = lessons.indexOf(l);
    const prev = lessons[pos - 1], next = lessons[pos + 1];
    const isLastOfLevel = l.index === lvl.lessons.length - 1;
    const nextLink = isLastOfLevel
      ? `<a class="next" href="#quiz-${lvl.id}"><small>Next</small>Level ${lvl.n} quiz →</a>`
      : next ? `<a class="next" href="#${next.id}"><small>Next</small>${esc(next.title)} →</a>` : "";
    return `<article class="wrap" ${lc(lvl)}>
      <div class="crumbs"><a href="#home">Home</a> / <a href="#level-${lvl.id}">Level ${lvl.n}: ${lvl.name}</a> / <span>Lesson ${l.index + 1}</span></div>
      <header class="lesson-head">
        <h1>${esc(l.title)}</h1>
        <p class="summary">${esc(l.summary)}</p>
        <div class="chips"><span class="chip level">${lvl.name}</span><span class="chip">${l.minutes} min read</span><span class="chip">Lesson ${l.index + 1} of ${lvl.lessons.length}</span></div>
      </header>
      ${l.why ? `<aside class="why-box"><span class="why-label">Why this matters</span><p>${l.why}</p></aside>` : ""}
      <div class="prose">${l.body}</div>
      ${l.deeper ? `<section class="deeper prose"><span class="why-label">Going deeper</span><h2>Expert commentary</h2>${l.deeper}</section>` : ""}
      ${l.takeaways ? `<section class="takeaways"><h2>Key takeaways</h2><ul>${l.takeaways.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}
      <footer class="lesson-foot">
        <button type="button" class="btn btn-ghost done-toggle ${done.has(l.id) ? "is-done" : ""}" id="doneBtn" data-id="${l.id}">${done.has(l.id) ? "✓ Completed" : "Mark lesson complete"}</button>
        <nav class="pager" aria-label="Lesson navigation">
          ${prev ? `<a href="#${prev.id}"><small>Previous</small>← ${esc(prev.title)}</a>` : "<span></span>"}
          ${nextLink}
        </nav>
      </footer>
    </article>`;
  }

  function viewQuiz(lvl) {
    const nextLvl = levels[levels.indexOf(lvl) + 1];
    return `<div class="wrap" ${lc(lvl)}>
      <div class="crumbs"><a href="#home">Home</a> / <a href="#level-${lvl.id}">Level ${lvl.n}: ${lvl.name}</a> / <span>Quiz</span></div>
      <header class="lesson-head">
        <h1>Level ${lvl.n} quiz</h1>
        <p class="summary">Answer all ${lvl.quiz.length} questions, then check your score. Explanations appear after checking.</p>
      </header>
      <form class="quiz" id="quizForm" data-level="${lvl.id}">
        ${lvl.quiz.map((q, qi) => `<fieldset class="q" id="q${qi}" style="border-style:solid">
          <legend class="sr-only">Question ${qi + 1}</legend>
          <h3>${qi + 1}. ${esc(q.q)}</h3>
          ${q.options.map((o, oi) => `<label><input type="radio" name="q${qi}" id="q${qi}o${oi}" value="${oi}"><span>${esc(o)}</span></label>`).join("")}
          <div class="why" hidden>${esc(q.why)}</div>
        </fieldset>`).join("")}
        <div class="btn-row"><button class="btn btn-primary" type="submit">Check answers</button><span class="score" id="scoreOut" aria-live="polite"></span></div>
      </form>
      <footer class="lesson-foot">
        <nav class="pager">
          <a href="#level-${lvl.id}"><small>Back</small>← Level ${lvl.n} overview</a>
          ${nextLvl ? `<a class="next" href="#level-${nextLvl.id}"><small>Up next</small>Level ${nextLvl.n}: ${nextLvl.name} →</a>` : `<a class="next" href="#prompts"><small>You finished the course</small>Prompt library →</a>`}
        </nav>
      </footer>
    </div>`;
  }

  function viewPrompts(filter = "All") {
    const cats = ["All", ...new Set(prompts.map((p) => p.cat))];
    const list = prompts.filter((p) => filter === "All" || p.cat === filter);
    return `<div class="wide">
      <div class="crumbs"><a href="#home">Home</a> / <span>Prompt library</span></div>
      <header class="lesson-head">
        <h1>Prompt library</h1>
        <p class="summary">Copy a template and replace the <code>{{PLACEHOLDERS}}</code>. Every one uses the techniques from the course.</p>
      </header>
      <div class="filters" role="group" aria-label="Filter prompts">${cats.map((c) => `<button type="button" class="filter" data-cat="${c}" aria-pressed="${c === filter}">${c}</button>`).join("")}</div>
      <div class="grid-2" id="promptGrid">
        ${list.map((p) => `<article class="prompt-card" id="p-${slug(p.title)}">
          <header><h3>${esc(p.title)}</h3><span class="chip">${p.cat}</span></header>
          <p>${esc(p.use)}</p>
          <pre data-raw="${encodeURIComponent(p.text)}">${esc(p.text)}</pre>
          <div><button type="button" class="copy-btn">Copy prompt</button></div>
        </article>`).join("")}
      </div>
    </div>`;
  }

  function viewSheets() {
    return `<div class="wide">
      <div class="crumbs"><a href="#home">Home</a> / <span>Cheat sheets</span></div>
      <header class="lesson-head"><h1>Cheat sheets</h1><p class="summary">The commands, parameters and rules you'll reach for most.</p></header>
      <div class="grid-2">
        ${sheets.map((s) => `<section class="sheet"><h3>${esc(s.title)}</h3><div class="overflow"><table>${s.rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table></div></section>`).join("")}
      </div>
    </div>`;
  }

  function viewGlossary() {
    const sorted = [...glossary].sort((a, b) => a[0].localeCompare(b[0]));
    let letter = "", rows = "";
    sorted.forEach(([term, def]) => {
      const L = term[0].toUpperCase();
      if (L !== letter) { letter = L; rows += `<div class="gloss-letter">${L}</div>`; }
      rows += `<dt id="g-${slug(term)}">${esc(term)}</dt><dd>${esc(def)}</dd>`;
    });
    return `<div class="wrap">
      <div class="crumbs"><a href="#home">Home</a> / <span>Glossary</span></div>
      <header class="lesson-head"><h1>Glossary</h1><p class="summary">${glossary.length} terms, in plain English.</p></header>
      <dl class="gloss">${rows}</dl>
    </div>`;
  }

  function viewPaths() {
    return `<div class="wide">
      <div class="crumbs"><a href="#home">Home</a> / <span>Learning paths</span></div>
      <header class="lesson-head"><h1>Learning paths by role</h1><p class="summary">Don't need everything? Follow the shortest route to what matters for your job.</p></header>
      <div class="grid-3">
        ${paths.map((p) => `<section class="path-card" style="--pc: var(${p.lc})"><h3>${esc(p.title)}</h3><ol>${p.steps.map((id) => { const l = lessonById[id]; return `<li><a href="#${id}">${esc(l.title)}</a> ${done.has(id) ? "✓" : ""}</li>`; }).join("")}</ol></section>`).join("")}
      </div>
    </div>`;
  }

  function viewNotFound() {
    return `<div class="wrap"><h1>Page not found</h1><p>That page doesn't exist. <a href="#home">Go to the home page</a>.</p></div>`;
  }

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // ---------- Router ----------
  let promptFilter = "All";
  function route() {
    const id = decodeURIComponent(location.hash.slice(1)) || "home";
    let html, navId = id;
    if (id === "home") html = viewHome();
    else if (id.startsWith("level-") && levelById[id.slice(6)]) html = viewLevel(levelById[id.slice(6)]);
    else if (id.startsWith("quiz-") && levelById[id.slice(5)]) html = viewQuiz(levelById[id.slice(5)]);
    else if (lessonById[id]) html = viewLesson(lessonById[id]);
    else if (id === "prompts") html = viewPrompts(promptFilter);
    else if (id === "cheatsheets") html = viewSheets();
    else if (id === "glossary") html = viewGlossary();
    else if (id === "paths") html = viewPaths();
    else html = viewNotFound();
    main.innerHTML = html;
    renderNav(navId);
    setMenu(false);
    const title = main.querySelector("h1");
    document.title = id === "home" || !title ? "Claude Academy" : `${title.textContent} · Claude Academy`;
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    const cur = $("#courseNav a.current");
    if (cur) cur.scrollIntoView({ block: "nearest" });
    else sidebar.scrollTop = 0;
  }
  window.addEventListener("hashchange", route);

  // ---------- Delegated interactions ----------
  main.addEventListener("click", (e) => {
    const copy = e.target.closest(".copy-btn");
    if (copy) {
      const pre = copy.closest(".code, .prompt-card").querySelector("pre");
      const text = decodeURIComponent(pre.dataset.raw);
      const label = copy.textContent;
      const ok = () => { copy.textContent = "Copied"; setTimeout(() => (copy.textContent = label), 1500); };
      const fallback = () => {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
        copy.textContent = "Selected. Press Ctrl+C";
        setTimeout(() => (copy.textContent = label), 2500);
      };
      try { navigator.clipboard.writeText(text).then(ok, fallback); } catch { fallback(); }
      return;
    }
    const doneBtn = e.target.closest("#doneBtn");
    if (doneBtn) {
      const id = doneBtn.dataset.id;
      done.has(id) ? done.delete(id) : done.add(id);
      saveDone();
      doneBtn.classList.toggle("is-done", done.has(id));
      doneBtn.textContent = done.has(id) ? "✓ Completed" : "Mark lesson complete";
      renderNav(id);
      return;
    }
    const filter = e.target.closest(".filter");
    if (filter) {
      promptFilter = filter.dataset.cat;
      main.innerHTML = viewPrompts(promptFilter);
    }
  });

  main.addEventListener("submit", (e) => {
    if (e.target.id !== "quizForm") return;
    e.preventDefault();
    const lvl = levelById[e.target.dataset.level];
    let score = 0, unanswered = 0;
    lvl.quiz.forEach((q, qi) => {
      const box = $("#q" + qi);
      const picked = box.querySelector("input:checked");
      box.classList.remove("right", "wrong");
      box.querySelectorAll("label").forEach((lab, oi) => lab.classList.toggle("correct-opt", oi === q.answer));
      if (!picked) { unanswered++; box.classList.add("wrong"); }
      else if (+picked.value === q.answer) { score++; box.classList.add("right"); }
      else box.classList.add("wrong");
      box.querySelector(".why").hidden = false;
    });
    const best = Math.max(score, quizScores[lvl.id] ?? 0);
    quizScores[lvl.id] = best;
    store.set("ca-quiz", quizScores);
    const pct = score / lvl.quiz.length;
    $("#scoreOut").textContent = `${score} / ${lvl.quiz.length}` + (unanswered ? ` (${unanswered} unanswered)` : "") + (pct === 1 ? ". Perfect!" : pct >= 0.8 ? ". Great work." : ". Review the highlighted answers.");
    renderNav("quiz-" + lvl.id);
  });

  // ---------- Search ----------
  const searchIndex = [
    ...lessons.map((l) => ({ href: "#" + l.id, title: l.title, sub: `Lesson · ${l.level.name}`, text: (l.title + " " + l.summary + " " + stripTags(l.body + (l.deeper || "") + (l.why || ""))).toLowerCase() })),
    ...prompts.map((p) => ({ href: "#prompts", title: p.title, sub: `Prompt · ${p.cat}`, text: (p.title + " " + p.use + " " + p.text).toLowerCase() })),
    ...glossary.map(([t, d]) => ({ href: "#glossary", title: t, sub: "Glossary", text: (t + " " + d).toLowerCase() })),
    ...sheets.map((s) => ({ href: "#cheatsheets", title: s.title, sub: "Cheat sheet", text: (s.title + " " + s.rows.flat().join(" ")).toLowerCase() })),
  ];
  const input = $("#searchInput"), results = $("#searchResults");
  let active = -1;
  function runSearch() {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.hidden = true; return; }
    const words = q.split(/\s+/);
    const hits = searchIndex
      .map((item) => {
        if (!words.every((w) => item.text.includes(w))) return null;
        const t = item.title.toLowerCase();
        return { item, score: words.reduce((s, w) => s + (t.includes(w) ? 10 : 0) + (item.text.split(w).length - 1), 0) };
      })
      .filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 10);
    active = -1;
    results.innerHTML = hits.length
      ? hits.map((h) => `<a href="${h.item.href}">${esc(h.item.title)}<small>${esc(h.item.sub)}</small></a>`).join("")
      : `<div class="search-empty">No matches for "${esc(q)}". Try a shorter or different word.</div>`;
    results.hidden = false;
  }
  input.addEventListener("input", runSearch);
  input.addEventListener("focus", runSearch);
  input.addEventListener("keydown", (e) => {
    const links = [...results.querySelectorAll("a")];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!links.length) return;
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
      links.forEach((a, i) => a.classList.toggle("active", i === active));
    } else if (e.key === "Enter" && links.length) {
      location.hash = links[Math.max(active, 0)].getAttribute("href");
      closeSearch();
    } else if (e.key === "Escape") closeSearch();
  });
  function closeSearch() { results.hidden = true; input.value = ""; input.blur(); }
  window.addEventListener("hashchange", () => { results.hidden = true; });
  results.addEventListener("click", (e) => { if (e.target.closest("a")) closeSearch(); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".search")) results.hidden = true; });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });

  route();
})();
