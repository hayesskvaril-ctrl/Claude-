/* Authoring helpers for lesson content. Loaded before every content-*.js file. */
window.ACADEMY = { levels: [], prompts: [], glossary: [], sheets: [], paths: [] };

(function () {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Tiny highlighter: comments, strings, numbers and a few keywords.
  function highlight(src, lang) {
    if (["text", "md", "markdown", "prompt"].includes(lang)) return esc(src);
    const commentRe = lang === "python" || lang === "bash" || lang === "yaml" || lang === "toml" ? /#.*$/ : /\/\/.*$/;
    return src.split("\n").map((line) => {
      let comment = "";
      const m = line.match(commentRe);
      // Skip "#" inside strings or shebang-like URLs for a simple, predictable result.
      if (m && !/["'][^"']*$/.test(line.slice(0, m.index))) {
        comment = line.slice(m.index);
        line = line.slice(0, m.index);
      }
      // One pass over the raw line: strings, numbers and keywords become spans; everything else is escaped.
      const TOKEN = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d[\d_]*)\b|\b(import|from|const|let|await|async|def|return|for|in|if|else|elif|while|with|as|new|function|class|true|false|True|False|None|null|try|except|catch|break)\b/g;
      let out = "", last = 0, m2;
      while ((m2 = TOKEN.exec(line))) {
        out += esc(line.slice(last, m2.index));
        const cls = m2[1] ? "tok-s" : m2[2] ? "tok-n" : "tok-k";
        out += `<span class="${cls}">${esc(m2[0])}</span>`;
        last = TOKEN.lastIndex;
      }
      out += esc(line.slice(last));
      return out + (comment ? `<span class="tok-c">${esc(comment)}</span>` : "");
    }).join("\n");
  }

  window.H = {
    esc,
    code(lang, src, label) {
      const clean = src.replace(/^\n/, "").replace(/\s+$/, "");
      return `<div class="code"><div class="code-head"><span>${esc(label || lang)}</span><button class="copy-btn" type="button">Copy</button></div><pre data-raw="${encodeURIComponent(clean)}"><code>${highlight(clean, lang)}</code></pre></div>`;
    },
    tip: (title, body) => `<div class="callout tip"><strong>${title}</strong><p>${body}</p></div>`,
    warn: (title, body) => `<div class="callout warn"><strong>${title}</strong><p>${body}</p></div>`,
    pro: (title, body) => `<div class="callout pro"><strong>${title}</strong><p>${body}</p></div>`,
    note: (title, body) => `<div class="callout"><strong>${title}</strong><p>${body}</p></div>`,
    compare: (bad, good, badLabel = "Weak", goodLabel = "Strong") =>
      `<div class="compare"><div class="bad-ex"><span class="lbl">${badLabel}</span><p>${bad}</p></div><div class="good-ex"><span class="lbl">${goodLabel}</span><p>${good}</p></div></div>`,
    table: (head, rows) =>
      `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,
    steps: (items) => `<ol class="steps">${items.map((i) => `<li>${i}</li>`).join("")}</ol>`,
    exercise: (title, body) => `<div class="exercise"><h3>Try it: ${title}</h3>${body}</div>`,
  };
})();
