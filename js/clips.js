/* Animated explainer clips: a tiny canvas "video" engine plus the clip definitions.
   Every clip is a pure function draw(ctx, t) over a fixed 1280x720 stage, so the same
   code powers the in-page player and the MP4 export (scripts/export-clips.mjs). */
(function () {
  const W = 1280, H = 720;
  const COL = {
    bg: "#000000", fg: "#ffffff", dim: "#8b9099", faint: "#3a3d44", line: "#24272c",
    panel: "#0b0c0f", panel2: "#14171c", acc: "#9cc3ff", ok: "#5fd38d", bad: "#ff7a7a", warm: "#e6c07b",
  };
  const FONT = 'Barlow, "Segoe UI", system-ui, sans-serif';
  const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';

  // ---------- Timing helpers ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lerp = (a, b, p) => a + (b - a) * p;
  // Visible window [a, b] with fade in and fade out.
  const env = (t, a, b, f = 0.6) => Math.min(seg(t, a, a + f), 1 - seg(t, b - f, b));

  // ---------- Drawing helpers ----------
  function text(ctx, s, x, y, o = {}) {
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    ctx.fillStyle = o.color || COL.fg;
    ctx.font = `${o.weight || 500} ${Math.max(16, o.size || 28)}px ${o.mono ? MONO : FONT}`;
    ctx.textAlign = o.align || "left";
    ctx.textBaseline = o.base || "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = (o.spacing || 0) + "px";
    ctx.fillText(s, x, y);
    ctx.restore();
  }
  const cap = (ctx, s, x, y, o = {}) => text(ctx, s.toUpperCase(), x, y, { weight: 600, spacing: 3, size: 18, ...o });
  function measure(ctx, s, size, weight = 500, mono = false) {
    ctx.save();
    ctx.font = `${weight} ${size}px ${mono ? MONO : FONT}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    const w = ctx.measureText(s).width;
    ctx.restore();
    return w;
  }
  function path(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function box(ctx, x, y, w, h, o = {}) {
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    path(ctx, x, y, w, h, o.r ?? 8);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 2; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); }
    ctx.restore();
  }
  function line(ctx, x1, y1, x2, y2, o = {}) {
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    ctx.strokeStyle = o.color || COL.faint;
    ctx.lineWidth = o.lw || 2;
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }
  // Arrow that grows from (x1,y1) to (x2,y2) as p goes 0 -> 1, with a glowing packet at its head.
  function arrow(ctx, x1, y1, x2, y2, p, o = {}) {
    if (p <= 0) return;
    const x = lerp(x1, x2, p), y = lerp(y1, y2, p);
    line(ctx, x1, y1, x, y, { color: o.color || COL.fg, lw: o.lw || 2.5 });
    const ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.fillStyle = o.color || COL.fg;
    if (p < 1) {
      ctx.shadowColor = o.color || COL.fg; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.translate(x2, y2); ctx.rotate(ang);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, -8); ctx.lineTo(-16, 8); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function meter(ctx, x, y, w, h, v, o = {}) {
    box(ctx, x, y, w, h, { stroke: COL.faint, r: 4 });
    const vert = h > w;
    if (vert) box(ctx, x + 4, y + h - 4 - (h - 8) * v, w - 8, (h - 8) * v, { fill: o.color || COL.fg, r: 2 });
    else box(ctx, x + 4, y + 4, (w - 8) * v, h - 8, { fill: o.color || COL.fg, r: 2 });
  }
  // Wraps text into lines that fit maxW.
  function wrap(ctx, s, maxW, size, weight = 500, mono = false) {
    const words = s.split(" "), lines = [];
    let cur = "";
    words.forEach((w) => {
      const test = cur ? cur + " " + w : w;
      if (measure(ctx, test, size, weight, mono) > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function chapter(ctx, t, captions) {
    let label = captions[0][1];
    captions.forEach(([t0, l]) => { if (t >= t0) label = l; });
    line(ctx, 56, 56, 80, 56, { color: COL.fg, lw: 2 });
    cap(ctx, label, 92, 57, { size: 17, color: COL.dim, spacing: 4 });
  }

  // ---------- Clip definitions ----------
  const CLIPS = {};

  CLIPS["prompt-to-answer"] = {
    title: "From prompt to answer",
    blurb: "How your message becomes tokens, fills the context window, and turns into a reply one token at a time.",
    duration: 26, poster: 10.5, lessons: ["how-claude-works"],
    captions: [
      [0, "Tokens", "Your message is split into tokens: small chunks of text."],
      [6.2, "Context window", "Everything Claude considers has to fit in its context window: instructions, files, history and your message."],
      [13.2, "Generation", "Claude writes its reply one token at a time, picking the best next piece at every step."],
      [21, "The takeaway", "So the quality of what goes in shapes the quality of what comes out."],
    ],
    draw(ctx, t) {
      // Scene A: tokenization
      const a = env(t, 0, 6.6);
      if (a > 0) {
        ctx.save(); ctx.globalAlpha = a;
        const toks = ["Sum", "mar", "ize", " this", " report", " for", " the", " board"];
        const p = ease(seg(t, 1.4, 4.2)), size = 50;
        const widths = toks.map((s) => measure(ctx, s, size));
        const pad = p * 12, gap = p * 18;
        const total = widths.reduce((s, w) => s + w + pad * 2, 0) + gap * (toks.length - 1);
        let x = (W - total) / 2;
        toks.forEach((s, i) => {
          const w = widths[i] + pad * 2;
          box(ctx, x, 290, w, 84, { stroke: COL.fg, alpha: p, r: 8, fill: i % 2 ? "rgba(156,195,255,0.10)" : "rgba(255,255,255,0.05)" });
          text(ctx, s, x + pad, 333, { size, weight: 500, alpha: seg(t, 0.2, 1) });
          x += w + gap;
        });
        cap(ctx, `${toks.length} tokens`, W / 2, 440, { align: "center", size: 22, color: COL.dim, alpha: seg(t, 4.2, 5), spacing: 6 });
        ctx.restore();
      }

      // Scene B: the context window fills up
      const b = env(t, 6.2, 13.6);
      if (b > 0) {
        ctx.save(); ctx.globalAlpha = b;
        const X = 200, Y = 120, Wd = 880, Hd = 500;
        box(ctx, X, Y, Wd, Hd, { stroke: COL.faint, r: 12 });
        cap(ctx, "Context window", X + 28, Y + 36, { size: 18, color: COL.dim });
        const blocks = [
          ["System instructions", "Role, rules and tone", 6.8, 0.1],
          ["File · report.pdf", "42 pages of quarterly results", 7.7, 0.46],
          ["Earlier messages", "Previous turns in this chat", 8.6, 0.1],
          ["Your message", "Summarize this report for the board", 9.8, 0.04],
        ];
        let fill = 0;
        blocks.forEach(([h, sub, t0, amt], i) => {
          const p = ease(seg(t, t0, t0 + 0.8));
          fill += amt * p;
          if (p <= 0) return;
          const by = Y + 70 + i * 100, you = i === 3;
          ctx.save(); ctx.globalAlpha *= p;
          const bx = X + 28 - (1 - p) * 60;
          box(ctx, bx, by, Wd - 190, 82, { fill: you ? COL.panel2 : COL.panel, stroke: you ? COL.fg : COL.line, r: 8 });
          cap(ctx, h, bx + 24, by + 28, { size: 15, color: you ? COL.acc : COL.dim });
          text(ctx, sub, bx + 24, by + 57, { size: 25 });
          ctx.restore();
        });
        meter(ctx, X + Wd - 110, Y + 70, 64, 382, fill, { color: COL.acc });
        text(ctx, Math.round(fill * 100) + "%", X + Wd - 78, Y + 36, { size: 22, align: "center", weight: 600, mono: true });
        ctx.restore();
      }

      // Scene C: generating the reply token by token
      const c = env(t, 13.2, 21.4);
      if (c > 0) {
        ctx.save(); ctx.globalAlpha = c;
        box(ctx, 80, 170, 300, 380, { stroke: COL.faint, r: 12 });
        cap(ctx, "Context", 104, 204, { size: 15, color: COL.dim });
        [0.1, 0.46, 0.1, 0.04].forEach((h, i) => box(ctx, 104, 232 + i * 76, 252, 58, { fill: i === 3 ? COL.panel2 : COL.panel, stroke: i === 3 ? COL.fg : COL.line, r: 6 }));
        arrow(ctx, 400, 360, 470, 360, 1, { color: COL.dim });
        box(ctx, 490, 170, 710, 380, { stroke: COL.faint, r: 12 });
        cap(ctx, "Reply", 514, 204, { size: 15, color: COL.dim });
        const out = ["Revenue", " grew", " 12%,", " but", " margins", " fell."];
        const cands = [
          [["Revenue", 0.62], ["The", 0.21], ["Overall", 0.09]],
          [[" grew", 0.71], [" rose", 0.18], [" fell", 0.04]],
          [[" 12%,", 0.66], [" strongly,", 0.14], [" slightly,", 0.08]],
          [[" but", 0.58], [" and", 0.27], [" while", 0.09]],
          [[" margins", 0.64], [" costs", 0.19], [" profit", 0.1]],
          [[" fell.", 0.55], [" shrank.", 0.25], [" dipped.", 0.12]],
        ];
        const step = 1.15, start = 13.8;
        const k = clamp(Math.floor((t - start) / step), 0, out.length - 1);
        const local = t < start ? 0 : clamp((t - start - k * step) / step);
        const shown = t < start ? 0 : k + (local > 0.72 ? 1 : 0);
        let x = 514;
        for (let i = 0; i < shown; i++) {
          const newest = i === shown - 1 && local < 1 && t < start + out.length * step;
          text(ctx, out[i], x, 262, { size: 38, color: newest ? COL.acc : COL.fg });
          x += measure(ctx, out[i], 38);
        }
        if (t >= start && t < start + out.length * step) {
          cap(ctx, "Choosing next token", 514, 330, { size: 14, color: COL.dim });
          cands[k].forEach(([tok, pr], i) => {
            const y = 372 + i * 52, chosen = i === 0 && local > 0.5;
            const grow = ease(clamp(local / 0.45));
            text(ctx, JSON.stringify(tok), 514, y, { size: 22, mono: true, color: chosen ? COL.fg : COL.dim });
            box(ctx, 780, y - 12, 300 * pr * grow, 24, { fill: chosen ? COL.acc : COL.faint, r: 3 });
            text(ctx, Math.round(pr * 100) + "%", 1100, y, { size: 20, mono: true, color: chosen ? COL.fg : COL.dim });
          });
        }
        ctx.restore();
      }

      // Scene D: the takeaway
      const d = seg(t, 21, 22);
      if (d > 0) {
        cap(ctx, "Better context in", W / 2, 310, { align: "center", size: 60, weight: 600, spacing: 8, alpha: d, color: COL.fg });
        line(ctx, W / 2 - 60, 362, W / 2 + 60, 362, { color: COL.dim, alpha: seg(t, 21.5, 22.3) });
        cap(ctx, "Better answer out", W / 2, 414, { align: "center", size: 60, weight: 600, spacing: 8, alpha: seg(t, 21.8, 22.8), color: COL.acc });
      }
      chapter(ctx, t, this.captions);
    },
  };

  CLIPS["context-drift"] = {
    title: "Why long chats drift",
    blurb: "How old, unrelated messages crowd a conversation, and why a fresh chat with a summary restores focus.",
    duration: 22, poster: 11, lessons: ["first-conversation", "common-mistakes"],
    captions: [
      [0, "One long chat", "Every message stays in the conversation, so a long chat keeps growing."],
      [6, "Diluted attention", "Old, unrelated content competes for attention with what you're asking now."],
      [13, "Fresh chat", "A new chat with a short summary puts the focus back where it belongs."],
      [18, "Rule of thumb", "Rule of thumb: one topic per chat."],
    ],
    draw(ctx, t) {
      const dimAll = 1 - 0.75 * seg(t, 18, 18.8);
      ctx.save(); ctx.globalAlpha = dimAll;
      const X = 400, Y = 96, Wd = 480, Hd = 560;
      const topics = ["Marketing plan", "Marketing plan", "Budget table", "Budget table", "Holiday rota", "Marketing plan", "Email to Sam", "Holiday rota", "Budget table", "Email to Sam", "Marketing plan", "Spreadsheet formula"];
      const oldA = 1 - seg(t, 12.4, 13);
      const shown = clamp(Math.floor((t - 0.6) / 0.9) + 1, 0, topics.length);
      let focus;
      if (oldA > 0) {
        ctx.save(); ctx.globalAlpha *= oldA;
        box(ctx, X, Y, Wd, Hd, { stroke: COL.faint, r: 12 });
        cap(ctx, "One long chat", X + 24, Y + 32, { size: 15, color: COL.dim });
        const instA = Math.max(0.22, 1 - shown * 0.065);
        box(ctx, X + 24, Y + 56, Wd - 48, 34, { stroke: COL.acc, r: 6, alpha: instA * seg(t, 0.1, 0.6) });
        text(ctx, "Instruction: use British spelling", X + 40, Y + 73, { size: 17, color: COL.acc, alpha: instA * seg(t, 0.1, 0.6) });
        for (let i = 0; i < shown; i++) {
          const user = i % 2 === 0, age = shown - 1 - i, latest = i === topics.length - 1;
          const a = Math.max(0.16, 1 - age * 0.085) * seg(t, 0.6 + i * 0.9, 1.0 + i * 0.9);
          const w = user ? 250 : 330, bx = user ? X + Wd - 24 - w : X + 24, by = Y + 104 + i * 37;
          box(ctx, bx, by, w, 30, { fill: user ? null : COL.panel2, stroke: latest ? COL.fg : user ? COL.faint : null, r: 6, alpha: latest ? 1 : a });
          text(ctx, topics[i], bx + 14, by + 15, { size: 16, color: latest ? COL.fg : COL.dim, alpha: latest ? 1 : a });
        }
        focus = Math.max(0.2, 1 - shown * 0.066);
        ctx.restore();
      }
      const newA = seg(t, 13, 13.6);
      if (newA > 0) {
        ctx.save(); ctx.globalAlpha *= newA;
        box(ctx, X, Y, Wd, Hd, { stroke: COL.fg, r: 12 });
        cap(ctx, "New chat", X + 24, Y + 32, { size: 15, color: COL.fg });
        const sA = seg(t, 13.6, 14.2), qA = seg(t, 14.4, 15), rA = seg(t, 15.2, 15.8);
        box(ctx, X + 24, Y + 60, Wd - 48, 70, { stroke: COL.acc, r: 8, alpha: sA });
        cap(ctx, "Summary", X + 40, Y + 82, { size: 13, color: COL.acc, alpha: sA });
        text(ctx, "Sales sheet context · British spelling", X + 40, Y + 108, { size: 18, alpha: sA });
        box(ctx, X + Wd - 274, Y + 150, 250, 30, { stroke: COL.fg, r: 6, alpha: qA });
        text(ctx, "Spreadsheet formula", X + Wd - 260, Y + 165, { size: 16, alpha: qA });
        box(ctx, X + 24, Y + 192, 330, 30, { fill: COL.panel2, r: 6, alpha: rA });
        text(ctx, "Answer, fully focused", X + 38, Y + 207, { size: 16, color: COL.dim, alpha: rA });
        focus = lerp(focus ?? 0.2, 0.95, ease(seg(t, 14.4, 15.4)));
        ctx.restore();
      }
      // Side readouts
      cap(ctx, "Messages", 120, 250, { size: 15, color: COL.dim });
      text(ctx, String(t < 13 ? shown : 3), 120, 300, { size: 64, weight: 600, mono: true });
      cap(ctx, "Topics mixed in", 120, 380, { size: 15, color: COL.dim });
      text(ctx, String(t < 13 ? new Set(topics.slice(0, shown)).size : 1), 120, 430, { size: 64, weight: 600, mono: true });
      cap(ctx, "Focus on latest ask", 950, 250, { size: 15, color: COL.dim });
      meter(ctx, 950, 280, 220, 34, focus, { color: focus > 0.6 ? COL.ok : focus > 0.35 ? COL.warm : COL.bad });
      text(ctx, Math.round(focus * 100) + "%", 950, 350, { size: 40, weight: 600, mono: true });
      ctx.restore();
      const endA = seg(t, 18.4, 19.2);
      if (endA > 0) cap(ctx, "One topic per chat", W / 2, H / 2, { align: "center", size: 64, weight: 600, spacing: 10, alpha: endA });
      chapter(ctx, t, this.captions);
    },
  };

  CLIPS["prompt-anatomy"] = {
    title: "Anatomy of a strong prompt",
    blurb: "Watch a vague request turn into a clear brief, and see how each piece of context changes the answer.",
    duration: 24, poster: 15.5, lessons: ["prompting-fundamentals", "prompt-teardown"],
    captions: [
      [0, "Vague prompt", "A short prompt leaves Claude guessing, so it plays safe and goes generic."],
      [4, "Add context", "Each piece of context removes a guess: who it's for, what happened, why it matters."],
      [12.6, "Shape the output", "Then say what the output should look like: length, tone, format."],
      [18, "The brief", "Brief Claude the way you'd brief a smart new colleague."],
    ],
    draw(ctx, t) {
      const X = 70, Y = 100, Wd = 660, Hd = 500;
      box(ctx, X, Y, Wd, Hd, { stroke: COL.faint, r: 12 });
      cap(ctx, "Your prompt", X + 28, Y + 36, { size: 15, color: COL.dim });
      text(ctx, "Write an email.", X + 28, Y + 88, { size: 34, weight: 600, alpha: seg(t, 0.2, 0.8) });
      const parts = [
        ["Audience", "My team of 8 people", 4.2],
        ["Context", "Thursday 2pm meeting moves to Friday 10am", 6.4],
        ["Why", "The client call overran", 8.6],
        ["Ask", "Reply if Friday doesn't work", 10.8],
        ["Format", "Friendly, under 100 words", 13.0],
      ];
      let n = 0;
      parts.forEach(([tag, s, t0], i) => {
        const p = ease(seg(t, t0, t0 + 0.7));
        n += p;
        if (p <= 0) return;
        const y = Y + 150 + i * 66, x = X + 28 - (1 - p) * 40;
        ctx.save(); ctx.globalAlpha *= p;
        const tw = measure(ctx, tag.toUpperCase(), 16, 600) + 3 * tag.length + 24;
        box(ctx, x, y - 17, 136, 34, { stroke: i === 4 ? COL.acc : COL.fg, r: 4 });
        cap(ctx, tag, x + 68, y + 1, { size: 16, align: "center", color: i === 4 ? COL.acc : COL.fg });
        text(ctx, s, x + 156, y, { size: 22 });
        ctx.restore();
      });
      // Output side
      const q = 0.16 + 0.168 * n;
      cap(ctx, "How specific the answer can be", 790, 128, { size: 14, color: COL.dim });
      meter(ctx, 790, 150, 420, 32, q, { color: q > 0.7 ? COL.ok : q > 0.4 ? COL.warm : COL.bad });
      box(ctx, 790, 214, 420, 386, { fill: COL.panel, stroke: COL.line, r: 12 });
      cap(ctx, "Claude's draft", 814, 248, { size: 14, color: COL.dim });
      const generic = ["Hi team,", "I wanted to reach out", "about the meeting.", "Please let me know", "your thoughts!"];
      const specific = ["Hi all,", "Thursday's 2pm planning", "meeting is moving to", "Friday at 10am, as the", "client call ran over.", "Reply if Friday doesn't", "work for you. Thanks!"];
      const sw = seg(t, 13.8, 14.8);
      generic.forEach((l, i) => text(ctx, l, 814, 296 + i * 38, { size: 23, color: COL.dim, alpha: 1 - sw }));
      specific.forEach((l, i) => text(ctx, l, 814, 296 + i * 38, { size: 23, alpha: sw }));
      const endA = seg(t, 18, 18.8);
      if (endA > 0) cap(ctx, "Brief it like a smart new colleague", W / 2, 660, { align: "center", size: 26, spacing: 6, alpha: endA });
      chapter(ctx, t, this.captions);
    },
  };

  CLIPS["agentic-loop"] = {
    title: "The agentic coding loop",
    blurb: "Explore, plan, code, verify, commit: one realistic Claude Code session, including a failed test and the fix.",
    duration: 28, poster: 16.5, lessons: ["agentic-workflow", "feature-walkthrough"],
    captions: [
      [0, "Explore", "Explore: Claude reads the relevant code first, without changing anything."],
      [5, "Plan", "Plan: you review a short plan before any code is written."],
      [10, "Code", "Code: Claude implements the plan across several files."],
      [15, "Verify", "Verify: tests catch two problems. Claude fixes them and runs the checks again."],
      [24, "Commit", "Commit: only once everything passes."],
    ],
    draw(ctx, t) {
      const names = ["Explore", "Plan", "Code", "Verify", "Commit"];
      const xs = [160, 400, 640, 880, 1120], ny = 200, nw = 190, nh = 80;
      const stages = [[0, 0], [5, 1], [10, 2], [15, 3], [19, 2], [21, 3], [24, 4]];
      let si = 0; stages.forEach(([t0], i) => { if (t >= t0) si = i; });
      const active = stages[si][1];
      const maxReached = Math.max(...stages.filter(([t0]) => t >= t0).map(([, n]) => n));
      for (let i = 0; i < 4; i++) line(ctx, xs[i] + nw / 2, ny, xs[i + 1] - nw / 2, ny, { color: i < maxReached ? COL.fg : COL.faint });
      // Loop-back arc from Verify to Code
      const fixA = env(t, 18.8, 21.2, 0.4);
      ctx.save();
      ctx.strokeStyle = fixA > 0 ? COL.bad : COL.faint; ctx.globalAlpha = fixA > 0 ? 1 : 0.6; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(xs[3], ny + nh / 2); ctx.bezierCurveTo(xs[3], ny + 110, xs[2], ny + 110, xs[2], ny + nh / 2); ctx.stroke();
      ctx.restore();
      cap(ctx, "Fix", 760, ny + 102, { align: "center", size: 14, color: fixA > 0 ? COL.bad : COL.faint });
      names.forEach((nm, i) => {
        const on = i === active, done = i < maxReached || (i === maxReached && !on);
        const pulse = on ? 0.5 + 0.5 * Math.sin(t * 5) : 0;
        if (on) box(ctx, xs[i] - nw / 2 - 6, ny - nh / 2 - 6, nw + 12, nh + 12, { stroke: COL.fg, r: 10, alpha: 0.2 + 0.3 * pulse });
        box(ctx, xs[i] - nw / 2, ny - nh / 2, nw, nh, { fill: on ? COL.fg : COL.bg, stroke: on || done ? COL.fg : COL.faint, r: 6 });
        cap(ctx, nm, xs[i], ny + 1, { align: "center", size: 20, spacing: 4, color: on ? COL.bg : done ? COL.fg : COL.dim });
      });
      // Terminal
      const TX = 120, TY = 350, TW = 1040, TH = 300;
      box(ctx, TX, TY, TW, TH, { fill: COL.panel, stroke: COL.line, r: 10 });
      [COL.faint, COL.faint, COL.faint].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(TX + 24 + i * 20, TY + 22, 6, 0, 7); ctx.fill(); });
      text(ctx, "claude · ~/app", TX + TW / 2, TY + 22, { size: 15, mono: true, color: COL.dim, align: "center" });
      const logs = [
        ["> Read src/auth/login.ts", "> Read src/auth/session.ts", "> Read src/db/user.ts", "Login uses signed session tokens; mail goes through lib/mailer."],
        ["Plan", "1. Add password_resets table (hashed token, expiry)", "2. POST /auth/forgot sends a single-use link", "3. Reset form, then invalidate old sessions", "4. Tests: expiry, reuse, rate limit"],
        ["Edit src/db/schema.ts           +18", "Edit src/auth/reset.ts          +64", "Edit src/routes/auth.ts         +22", "Add  tests/auth/reset.test.ts   +71"],
        ["$ pnpm test", "✕ reset token can be reused", "✕ expired token is accepted", "16 passed, 2 failed"],
        ["Fix: mark token as used; compare expiry in UTC", "Edit src/auth/reset.ts  +4 −1"],
        ["$ pnpm test", "✓ 18 passed", "$ pnpm check", "✓ no type or lint errors"],
        ['$ git commit -m "feat: password reset flow"', "5 files changed, 179 insertions", "Pull request opened: #128"],
      ];
      const t0 = stages[si][0];
      logs[si].forEach((l, i) => {
        const a = seg(t, t0 + 0.2 + i * 0.55, t0 + 0.5 + i * 0.55);
        const color = l.startsWith("✕") ? COL.bad : l.startsWith("✓") ? COL.ok : l.startsWith("$") || l.startsWith(">") ? COL.dim : COL.fg;
        text(ctx, l, TX + 32, TY + 72 + i * 44, { size: 22, mono: true, color, alpha: a });
      });
      chapter(ctx, t, this.captions);
    },
  };

  CLIPS["tool-use"] = {
    title: "How tool use works",
    blurb: "The full round trip between your app, Claude and your tool, from question to tool_use to final answer.",
    duration: 26, poster: 16, lessons: ["tool-use", "build-mcp-server"],
    captions: [
      [0, "Request", "Your app sends the conversation plus the tools Claude may use."],
      [4, "tool_use", "Claude replies with a tool_use request instead of an answer."],
      [8, "Your code runs", "Your code runs the tool. Claude never touches your systems directly."],
      [14, "tool_result", "You send the result back as a tool_result."],
      [18, "Answer", "Claude uses the result to write the final answer."],
      [22, "Who does what", "Claude decides. Your code executes."],
    ],
    draw(ctx, t) {
      const lanes = [["Claude API", 200], ["Your app", 640], ["Your tool", 1080]];
      const msgs = [
        [1, 0, 180, 0.8, "messages + tools", null],
        [0, 1, 265, 4.2, "tool_use · get_order_status", 'stop_reason: "tool_use"'],
        [1, 2, 350, 8.2, 'get_order_status("ORD-1234")', null],
        [2, 1, 435, 10.8, '{ status: "shipped" }', null],
        [1, 0, 520, 14.2, "tool_result", null],
        [0, 1, 605, 18.2, '"It shipped. Arrives Oct 3."', 'stop_reason: "end_turn"'],
      ];
      const dimA = 1 - 0.7 * seg(t, 22, 22.8);
      ctx.save(); ctx.globalAlpha = dimA;
      let recv = -1;
      msgs.forEach(([, to, , t0]) => { if (t >= t0 + 1) recv = to; });
      lanes.forEach(([nm, x], i) => {
        line(ctx, x, 132, x, 668, { color: COL.faint, dash: [4, 8] });
        box(ctx, x - 130, 72, 260, 58, { fill: i === recv ? COL.fg : COL.bg, stroke: COL.fg, r: 6 });
        cap(ctx, nm, x, 102, { align: "center", size: 18, spacing: 4, color: i === recv ? COL.bg : COL.fg });
      });
      msgs.forEach(([from, to, y, t0, label, chip]) => {
        const x1 = lanes[from][1], x2 = lanes[to][1];
        const p = ease(seg(t, t0, t0 + 1));
        const color = from === 0 ? COL.acc : COL.fg;
        arrow(ctx, x1 + (x2 > x1 ? 8 : -8), y, x2 + (x2 > x1 ? -8 : 8), y, p, { color });
        const la = seg(t, t0 + 0.5, t0 + 1.1);
        text(ctx, label, (x1 + x2) / 2, y - 22, { size: 20, mono: true, align: "center", alpha: la, color });
        if (chip) text(ctx, chip, (x1 + x2) / 2, y + 26, { size: 17, mono: true, align: "center", alpha: la, color: COL.dim });
      });
      ctx.restore();
      const endA = seg(t, 22.2, 23);
      if (endA > 0) {
        cap(ctx, "Claude decides.", W / 2, 320, { align: "center", size: 58, weight: 600, spacing: 8, alpha: endA, color: COL.acc });
        cap(ctx, "Your code executes.", W / 2, 400, { align: "center", size: 58, weight: 600, spacing: 8, alpha: seg(t, 22.8, 23.6) });
      }
      chapter(ctx, t, this.captions);
    },
  };

  CLIPS["prompt-caching"] = {
    title: "Prompt caching in one minute",
    blurb: "Why a stable prefix makes repeat requests faster and cheaper, and how one changing timestamp breaks it.",
    duration: 24, poster: 10.5, lessons: ["caching-cost"],
    captions: [
      [0, "First request", "The first request processes the whole prompt and caches the stable prefix."],
      [7.6, "Cache hit", "Later requests with the same prefix read it from cache: faster and much cheaper."],
      [12.6, "Cache miss", "Change anything in the prefix, even a timestamp, and everything after it is processed again."],
      [18.6, "The rule", "Put stable content first and variable content last."],
    ],
    draw(ctx, t) {
      const X = 110, BW = 800, BH = 56;
      const segs = [["Tools", 0.16], ["System", 0.2], ["Reference docs", 0.46], ["Question", 0.18]];
      const xsOf = () => { let x = X; return segs.map(([, f]) => { const r = [x, BW * f]; x += BW * f; return r; }); };
      const pos = xsOf();
      function bar(y, rowT, o) {
        const a = seg(t, rowT, rowT + 0.5);
        if (a <= 0) return;
        ctx.save(); ctx.globalAlpha *= a;
        cap(ctx, o.label, X, y - 52, { size: 15, color: COL.dim });
        pos.forEach(([x, w], i) => {
          box(ctx, x + 2, y - BH / 2, w - 4, BH, { stroke: COL.faint, r: 4 });
          // processing sweep
          const sw = o.sweep(i);
          if (sw > 0) box(ctx, x + 4, y - BH / 2 + 2, (w - 8) * sw, BH - 4, { fill: o.fillColor(i), r: 3 });
          const lbl = i === 3 && o.q ? o.q : segs[i][0];
          cap(ctx, lbl, x + 14, y + 1, { size: 13, spacing: 2, color: sw > 0.5 && o.fillColor(i) !== COL.panel2 ? COL.bg : COL.dim });
        });
        if (o.tag) o.tag();
        ctx.restore();
      }
      const lin = (a, b) => (i0, i1) => (i) => {
        // sweep across segments i0..i1 between times a..b, proportional to width
        if (i < i0 || i > i1) return 0;
        const total = pos.slice(i0, i1 + 1).reduce((s, [, w]) => s + w, 0);
        const before = pos.slice(i0, i).reduce((s, [, w]) => s + w, 0);
        const done = seg(t, a, b) * total;
        return clamp((done - before) / pos[i][1]);
      };
      // Row 1
      const s1 = lin(1, 5)(0, 3);
      bar(190, 0.3, {
        label: "Request 1", sweep: s1, fillColor: (i) => (i < 3 && t > 5.4 ? COL.acc : COL.panel2),
        tag: () => {
          const a = seg(t, 5.4, 6.2);
          if (a > 0) cap(ctx, "· Prefix cached", X + 150, 138, { size: 15, color: COL.acc, alpha: a });
          text(ctx, "52,000 tokens processed", 950, 172, { size: 20, mono: true, alpha: seg(t, 5, 5.6) });
          text(ctx, "4.1 s", 950, 206, { size: 20, mono: true, color: COL.dim, alpha: seg(t, 5, 5.6) });
        },
      });
      // Row 2
      const s2q = lin(8.6, 9.6)(3, 3);
      bar(340, 7.6, {
        label: "Request 2", q: "Question 2",
        sweep: (i) => (i < 3 ? ease(seg(t, 8.1, 8.4)) : s2q(i)), fillColor: (i) => (i < 3 ? COL.acc : COL.panel2),
        tag: () => {
          const a = seg(t, 8.2, 8.8);
          if (a > 0) cap(ctx, "· Cache read", X + 150, 288, { size: 15, color: COL.acc, alpha: a });
          text(ctx, "7,800 new · 44,200 cached", 950, 322, { size: 20, mono: true, color: COL.ok, alpha: seg(t, 9.8, 10.4) });
          text(ctx, "0.9 s", 950, 356, { size: 20, mono: true, color: COL.ok, alpha: seg(t, 9.8, 10.4) });
        },
      });
      // Row 3
      const s3 = lin(13.8, 17.2)(1, 3);
      bar(490, 12.6, {
        label: "Request 3", q: "Question 3",
        sweep: (i) => (i === 0 ? ease(seg(t, 13.1, 13.4)) : s3(i)), fillColor: (i) => (i === 0 ? COL.acc : COL.panel2),
        tag: () => {
          const a = seg(t, 13.2, 13.8), flash = 0.6 + 0.4 * Math.sin(t * 8);
          if (a > 0) {
            box(ctx, pos[1][0] + 6, 490 + 36, pos[1][1] - 12, 30, { stroke: COL.bad, r: 4, alpha: a * flash });
            text(ctx, "12:04:07", pos[1][0] + pos[1][1] / 2, 490 + 52, { size: 17, mono: true, color: COL.bad, align: "center", alpha: a });
            cap(ctx, "· Cache miss", X + 150, 438, { size: 15, color: COL.bad, alpha: a });
          }
          text(ctx, "Timestamp changed the prefix", 950, 472, { size: 20, color: COL.bad, alpha: seg(t, 17.3, 17.9) });
          text(ctx, "3.3 s", 950, 506, { size: 20, mono: true, color: COL.dim, alpha: seg(t, 17.3, 17.9) });
        },
      });
      const endA = seg(t, 18.6, 19.4);
      if (endA > 0) cap(ctx, "Stable content first · variable content last", W / 2, 640, { align: "center", size: 28, spacing: 6, alpha: endA });
      chapter(ctx, t, this.captions);
    },
  };

  CLIPS["subagents"] = {
    title: "Subagents keep context clean",
    blurb: "How delegating reading-heavy work to subagents keeps the main agent's context focused on the real task.",
    duration: 22, poster: 11, lessons: ["subagents", "context-engineering"],
    captions: [
      [0, "Main agent", "The main agent keeps its context for the actual work."],
      [4, "Delegate", "It hands reading-heavy side tasks to subagents, each with its own context window."],
      [8, "Heavy reading", "Subagents do the heavy reading in their own space."],
      [14, "Summaries", "Only short summaries come back, so the main context stays clean."],
      [18, "The result", "Less clutter in the main context means sharper decisions."],
    ],
    draw(ctx, t) {
      const MX = 80, MY = 110, MW = 420, MH = 500;
      const subs = [["Search code", ["src/pay/charge.ts", "src/pay/refund.ts", "src/pay/webhook.ts", "lib/http.ts", "src/pay/retry.ts", "src/api/checkout.ts"], 0.82],
        ["Read logs", ["09:14 POST /charge 504", "09:14 timeout 30000ms", "09:15 retry 1/3", "09:15 POST /charge 504", "09:16 retry 2/3", "09:16 gateway slow"], 0.7],
        ["Review tests", ["charge.test.ts ✓", "refund.test.ts ✓", "webhook.test.ts ✓", "no timeout test", "no retry test", "fixtures ok"], 0.76]];
      const endDim = 1 - 0.75 * seg(t, 18, 18.8);
      // Main panel
      box(ctx, MX, MY, MW, MH, { stroke: COL.fg, r: 12 });
      cap(ctx, "Main agent", MX + 24, MY + 34, { size: 16 });
      text(ctx, "Task: fix the payments bug", MX + 24, MY + 76, { size: 22 });
      box(ctx, MX + 24, MY + 106, MW - 48, 40, { fill: COL.panel2, r: 6 });
      text(ctx, "Task + CLAUDE.md", MX + 40, MY + 126, { size: 17, color: COL.dim });
      const sums = ["3 call sites, one without timeout handling", "Gateway times out at 30 s under load", "No tests cover timeouts or retries"];
      let used = 0.08;
      sums.forEach((s, i) => {
        const arrive = 14.2 + i * 0.8 + 1;
        const a = seg(t, arrive, arrive + 0.3);
        used += 0.03 * a;
        if (a > 0) {
          box(ctx, MX + 24, MY + 160 + i * 56, MW - 48, 44, { stroke: COL.acc, r: 6, alpha: a });
          text(ctx, s, MX + 38, MY + 182 + i * 56, { size: 15, alpha: a });
        }
      });
      cap(ctx, "Context used", MX + 24, MY + MH - 70, { size: 13, color: COL.dim });
      meter(ctx, MX + 24, MY + MH - 50, MW - 130, 28, used, { color: COL.ok });
      text(ctx, Math.round(used * 100) + "%", MX + MW - 70, MY + MH - 36, { size: 22, mono: true, weight: 600 });
      // Subagents
      ctx.save(); ctx.globalAlpha = endDim;
      subs.forEach(([nm, lines, full], i) => {
        const SX = 720, SY = 110 + i * 175, SW = 480, SH = 150;
        const a = seg(t, 4.2 + i * 0.6, 4.8 + i * 0.6);
        if (a <= 0) return;
        const lp = ease(seg(t, 4.2 + i * 0.6, 5.0 + i * 0.6));
        line(ctx, MX + MW, MY + 250, lerp(MX + MW, SX, lp), lerp(MY + 250, SY + SH / 2, lp), { color: COL.faint, dash: [5, 6] });
        ctx.save(); ctx.globalAlpha *= a;
        box(ctx, SX, SY, SW, SH, { stroke: COL.faint, r: 10 });
        cap(ctx, "Subagent · " + nm, SX + 20, SY + 28, { size: 14, color: COL.dim });
        const rp = seg(t, 8 + i * 0.3, 13.5);
        if (rp > 0) {
          const off = Math.floor(t * 2.5 + i) % lines.length;
          for (let k = 0; k < 3; k++) text(ctx, lines[(off + k) % lines.length], SX + 20, SY + 62 + k * 24, { size: 15, mono: true, color: COL.dim, alpha: t < 13.8 ? 1 : 1 - seg(t, 13.8, 14.2) });
        }
        meter(ctx, SX + SW - 46, SY + 20, 26, SH - 40, full * rp, { color: COL.warm });
        ctx.restore();
        // Summary packet travels back
        const pt = seg(t, 14.2 + i * 0.8, 15.2 + i * 0.8);
        if (pt > 0 && pt < 1) {
          const px = lerp(SX, MX + MW - 10, ease(pt)), py = lerp(SY + SH / 2, MY + 182 + i * 56, ease(pt));
          box(ctx, px - 50, py - 14, 100, 28, { fill: COL.acc, r: 4 });
          cap(ctx, "Summary", px, py + 1, { align: "center", size: 12, color: COL.bg, spacing: 2 });
        }
      });
      ctx.restore();
      const endA = seg(t, 18.4, 19.2);
      if (endA > 0) {
        cap(ctx, "Main context", 960, 270, { align: "center", size: 18, color: COL.dim, alpha: endA });
        text(ctx, "17%", 960, 330, { align: "center", size: 72, weight: 600, mono: true, color: COL.ok, alpha: endA });
        cap(ctx, "If it read everything itself", 960, 430, { align: "center", size: 18, color: COL.dim, alpha: seg(t, 19, 19.8) });
        text(ctx, "85%", 960, 490, { align: "center", size: 72, weight: 600, mono: true, color: COL.bad, alpha: seg(t, 19, 19.8) });
      }
      chapter(ctx, t, this.captions);
    },
  };

  // Title card used at the start of exported video files.
  function titleCard(ctx, def, p, scale = 1) {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
    const a = Math.min(seg(p, 0, 0.25), 1 - seg(p, 0.8, 1));
    cap(ctx, "Claude Academy", W / 2, 300, { align: "center", size: 18, color: COL.dim, spacing: 8, alpha: a });
    cap(ctx, def.title, W / 2, 370, { align: "center", size: 54, weight: 600, spacing: 6, alpha: a });
    line(ctx, W / 2 - 40, 430, W / 2 + 40, 430, { color: COL.dim, alpha: a });
  }

  // ---------- Player ----------
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HOLD = 1.5; // seconds held on the last frame before looping
  let players = [];

  function captionAt(def, t) {
    let c = def.captions[0][2];
    def.captions.forEach(([t0, , s]) => { if (t >= t0) c = s; });
    return c;
  }
  function renderFrame(ctx, def, t, burnCaptions, scale = 1) {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, W, H);
    def.draw(ctx, Math.min(t, def.duration));
    if (burnCaptions) {
      const s = captionAt(def, t);
      const lines = wrap(ctx, s, 1000, 26);
      const h = lines.length * 36 + 24, y = H - h - 18;
      box(ctx, W / 2 - 540, y, 1080, h, { fill: "rgba(0,0,0,0.78)", r: 6 });
      lines.forEach((l, i) => text(ctx, l, W / 2, y + 30 + i * 36, { size: 26, align: "center" }));
    }
  }

  class Player {
    constructor(fig) {
      this.fig = fig;
      this.def = CLIPS[fig.dataset.clip];
      this.canvas = fig.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.t = this.def.poster;
      this.playing = false;
      this.userPaused = false;
      this.started = false;
      this.raf = 0;
      this.progress = fig.querySelector(".clip-progress");
      this.fill = fig.querySelector(".clip-progress span");
      this.time = fig.querySelector(".clip-time");
      this.caption = fig.querySelector(".clip-caption");
      this.toggleBtn = fig.querySelector(".clip-toggle");
      this.bigBtn = fig.querySelector(".clip-big-play");
      this.toggleBtn.addEventListener("click", () => this.toggle());
      this.bigBtn.addEventListener("click", () => { this.userPaused = false; if (!this.started) this.t = 0; this.play(); });
      this.progress.addEventListener("pointerdown", (e) => this.scrub(e));
      this.progress.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          this.seek(this.t + (e.key === "ArrowRight" ? 2 : -2));
        }
      });
      this.io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!this.userPaused && !reduceMotion()) { if (!this.started) this.t = 0; this.play(); }
        } else this.pause();
      }, { threshold: [0, 0.5] });
      this.io.observe(fig);
      this.draw();
    }
    draw() {
      renderFrame(this.ctx, this.def, this.t, false);
      const d = this.def.duration;
      this.fill.style.width = `${(Math.min(this.t, d) / d) * 100}%`;
      this.progress.setAttribute("aria-valuenow", Math.round(Math.min(this.t, d)));
      this.time.textContent = `${fmt(Math.min(this.t, d))} / ${fmt(d)}`;
      const c = captionAt(this.def, this.t);
      if (this.caption.textContent !== c) this.caption.textContent = c;
    }
    play() {
      if (this.playing) return;
      this.playing = true; this.started = true;
      this.fig.classList.add("is-playing");
      this.toggleBtn.setAttribute("aria-label", "Pause clip");
      let last = performance.now();
      const tick = (now) => {
        this.t += Math.min(0.1, (now - last) / 1000); last = now;
        if (this.t > this.def.duration + HOLD) this.t = 0;
        this.draw();
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    pause() {
      if (!this.playing) return;
      this.playing = false;
      cancelAnimationFrame(this.raf);
      this.fig.classList.remove("is-playing");
      this.toggleBtn.setAttribute("aria-label", "Play clip");
    }
    toggle() {
      if (this.playing) { this.userPaused = true; this.pause(); }
      else { this.userPaused = false; if (!this.started) this.t = 0; this.play(); }
    }
    seek(t) { this.t = clamp(t, 0, this.def.duration); this.started = true; this.draw(); }
    scrub(e) {
      const r = this.progress.getBoundingClientRect();
      const move = (ev) => this.seek(((ev.clientX - r.left) / r.width) * this.def.duration);
      move(e);
      const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
      addEventListener("pointermove", move); addEventListener("pointerup", up);
    }
    destroy() { this.pause(); this.io.disconnect(); }
  }

  // ---------- Hero scene: starfield, Earth's limb and satellite trains ----------
  let hero = null;
  function mountHero(canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, stars = [], raf = 0;
    const rand = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
    function resize() {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      stars = Array.from({ length: Math.round((w * h) / 2600) }, () => ({ x: rand() * w, y: rand() * h * 0.8, r: rand() * 1.2 + 0.2, p: rand() * 6 }));
    }
    function frame(time) {
      const s = time / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
      stars.forEach((st) => {
        ctx.globalAlpha = 0.35 + 0.35 * Math.sin(s * 0.8 + st.p);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
      });
      ctx.globalAlpha = 1;
      // Earth's limb
      const R = Math.max(w, 900) * 1.25, cx = w * 0.62, cy = h * 0.78 + R;
      const g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R);
      g.addColorStop(0, "#000"); g.addColorStop(0.93, "#03060c"); g.addColorStop(1, "#0b1a33");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.save();
      ctx.shadowColor = "rgba(120,170,255,0.9)"; ctx.shadowBlur = 40;
      ctx.strokeStyle = "rgba(150,195,255,0.55)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, R + 1, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.shadowColor = "rgba(90,140,255,0.6)"; ctx.shadowBlur = 90;
      ctx.strokeStyle = "rgba(90,140,255,0.12)"; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(cx, cy, R + 4, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.restore();
      // Satellite trains: rows of evenly spaced points drifting along gentle arcs
      [[0.18, 0.012, 22, 16], [0.34, 0.008, 16, 18], [0.5, 0.015, 26, 13]].forEach(([yf, speed, n, gap], k) => {
        const period = w + n * gap + 200;
        const head = ((s * speed * 1000 + k * 700) % period) - n * gap;
        for (let i = 0; i < n; i++) {
          const x = head + i * gap;
          if (x < -10 || x > w + 10) continue;
          const y = h * yf + Math.pow((x - w / 2) / w, 2) * h * 0.25 - x * 0.06;
          ctx.globalAlpha = 0.9 - (i / n) * 0.5;
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
    }
    const loop = (time) => { frame(time); raf = requestAnimationFrame(loop); };
    resize();
    const ro = new ResizeObserver(() => { resize(); frame(performance.now()); });
    ro.observe(canvas);
    if (reduceMotion()) frame(0); else raf = requestAnimationFrame(loop);
    return { destroy() { cancelAnimationFrame(raf); ro.disconnect(); } };
  }

  // ---------- Public API ----------
  window.Clips = {
    defs: CLIPS,
    W, H, renderFrame, captionAt, titleCard,
    forLesson(id) { return Object.keys(CLIPS).find((k) => CLIPS[k].lessons.includes(id)); },
    markup(id, { heading = true } = {}) {
      const d = CLIPS[id];
      return `<figure class="clip" data-clip="${id}">
        <div class="clip-stage">
          <canvas width="${W}" height="${H}" role="img" aria-label="Animated clip: ${window.H.esc(d.title)}. Transcript below."></canvas>
          <button class="clip-big-play" type="button" aria-label="Play ${window.H.esc(d.title)}"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
        </div>
        <div class="clip-controls">
          <button class="clip-toggle" type="button" aria-label="Play clip"><svg class="i-play" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><svg class="i-pause" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg></button>
          <div class="clip-progress" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="${d.duration}" aria-valuenow="0"><span></span></div>
          <span class="clip-time num">0:00 / ${fmt(d.duration)}</span>
        </div>
        <figcaption>
          ${heading ? `<span class="clip-title">${window.H.esc(d.title)}</span>` : ""}
          <span class="clip-caption">${window.H.esc(d.captions[0][2])}</span>
          <details class="clip-transcript"><summary>Transcript</summary><ol>${d.captions.map(([, l, s]) => `<li><strong>${window.H.esc(l)}.</strong> ${window.H.esc(s)}</li>`).join("")}</ol></details>
        </figcaption>
      </figure>`;
    },
    // Static poster frame for thumbnails.
    poster(canvas, id) {
      const ctx = canvas.getContext("2d");
      renderFrame(ctx, CLIPS[id], CLIPS[id].poster, false);
    },
    mount(root) {
      root.querySelectorAll("figure.clip[data-clip]").forEach((fig) => players.push(new Player(fig)));
      root.querySelectorAll("canvas[data-poster]").forEach((c) => Clips.poster(c, c.dataset.poster));
      const heroCanvas = root.querySelector("canvas.hero-canvas");
      if (heroCanvas) hero = mountHero(heroCanvas);
    },
    unmountAll() {
      players.forEach((p) => p.destroy());
      players = [];
      if (hero) { hero.destroy(); hero = null; }
    },
  };
  // Redraw posters and paused players once web fonts arrive.
  if (document.fonts) document.fonts.ready.then(() => {
    players.forEach((p) => p.draw());
    document.querySelectorAll("canvas[data-poster]").forEach((c) => Clips.poster(c, c.dataset.poster));
  });
})();
