/* Math 104 study site. One data bundle (data.js) -> many views. Progress lives in localStorage. */
(() => {
'use strict';
const D = window.M104;
const REFERENCE = window.M104Reference;
const PROOF_PATHS = window.M104ProofLab;
const PROOF_SOURCES = window.M104ProofSources;
const sourceNoteIds = [...new Set(PROOF_SOURCES.routes.map(row => row.theorem))];
for (const [id, steps] of Object.entries(REFERENCE.steps)) {
  if (D.items[id] && !D.items[id].proof_skeleton?.length) D.items[id].proof_skeleton = steps;
}
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = s => esc(s).replace(/&lt;(\/?)(em|strong|br)\s*\/?&gt;/g, '<$1$2>');
const view = $('#view');
const ITEMS = D.items, CLS = {}; D.classes.forEach(c => CLS[c.n] = c);
const Q = {}; D.questions.forEach(q => Q[q.id] = q);
const LEVELS = ['recall', 'explain', 'apply', 'compare'];
const LEVEL_DESC = { recall: 'state it exactly', explain: 'say why', apply: 'use it on an object', compare: 'tell two notions apart' };
const REL = {
  prerequisite: { label: 'needed to state', color: '#8b919b' }, used_in: { label: 'used to prove', color: '#2f5d8a' },
  special_case_of: { label: 'special case of', color: '#2e7d4f' }, generalizes: { label: 'generalizes', color: '#2e7d4f' },
  equivalent: { label: 'equivalent to', color: '#6b3fa0' }, contrasts: { label: 'contrasts with', color: '#b3412f' },
  counterexample_for: { label: 'counterexample for', color: '#9a6a12' },
};

/* ---------- storage ---------- */
const KEY = 'm104.v1';
const blank = () => ({ mode: 'review', tier: 1, q: {}, proof: {}, explain: {}, log: [], theme: 'auto', projector: false });
let S;
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = blank(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: session only */ } };
const pad = n => String(n).padStart(2, '0');
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const dayNum = (iso = todayISO()) => Math.round(Date.parse(iso + 'T00:00:00Z') / 864e5);
const TODAY = dayNum();

/* ---------- helpers over the data ---------- */
const shortLabel = it => (it.label || '').split(';').filter(p => !/^\s*(Rudin|Ross|cf\.)\b/.test(p)).join(';').trim();
const iname = it => `${it.kind} ${it.num}` + (shortLabel(it) ? ` (${shortLabel(it)})` : '');
const ilink = (id, text) => { const it = ITEMS[id]; if (!it) return esc(id); return `<a href="#/learn/${it.cls}/${id}">${esc(text || iname(it))}</a>`; };
const covered = () => D.classes.filter(c => c.date <= todayISO()).map(c => c.n);
const latestCovered = () => { const c = covered(); return c.length ? c[c.length - 1] : 1; };
const qOfClass = n => D.questions.filter(q => q.cls === n);
const qOfItem = id => D.questions.filter(q => (q.refs || []).includes(id));
function qm(id) {
  const st = S.q[id]; if (!st) return 0;
  if (st.last === 0) return 0.15;
  let m = Math.min(1, 0.4 + st.ivl / 30);
  const over = TODAY - st.due; if (over > 0) m *= Math.max(0.5, 1 - over / 60);
  return m;
}
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const classM = n => mean(qOfClass(n).map(q => qm(q.id)));
const itemM = id => { const qs = qOfItem(id); return qs.length ? mean(qs.map(q => qm(q.id))) : null; };
const heatColor = m => m == null ? 'transparent' : `color-mix(in srgb, var(--good) ${Math.round(8 + m * 72)}%, var(--panel))`;
const dueList = () => D.questions.filter(q => S.q[q.id] && S.q[q.id].due <= TODAY);
const inEdges = id => D.relations.filter(r => r.to === id);
const outEdges = id => D.relations.filter(r => r.from === id);
function texPlain(s) {
  const sym = { R: 'ℝ', Q: 'ℚ', N: 'ℕ', Z: 'ℤ', C: 'ℂ' };
  return String(s || '').replace(/\\mathbb\{(\w)\}/g, (m, a) => sym[a] || a).replace(/\\(varepsilon|epsilon)/g, 'ε').replace(/\\delta/g, 'δ')
    .replace(/\\alpha/g, 'α').replace(/\\infty/g, '∞').replace(/\\to/g, '→').replace(/\\le(q)?\b/g, '≤').replace(/\\ge(q)?\b/g, '≥')
    .replace(/\\[()[\]]/g, '').replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
}
function shuffle(a, seed) {
  a = a.slice(); let s = seed || Math.floor(Math.random() * 1e9);
  const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const pick = a => a[Math.floor(Math.random() * a.length)];
function typeset(el) {
  if (window.renderMathInElement) renderMathInElement(el, {
    delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }], throwOnError: false,
  });
}
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const srcTag = (official, text) => `<div class="src ${official ? 'official' : 'authored'}">${esc(text)}</div>`;

/* ---------- spaced repetition ---------- */
function grade(qid, g) {           // g: 0 again, 1 hard, 2 good, 3 easy
  const st = S.q[qid] || { ivl: 0, ease: 2.5, reps: 0, lapses: 0, due: TODAY, last: null };
  if (g === 0) { st.reps = 0; st.lapses++; st.ivl = 0; st.ease = Math.max(1.3, st.ease - 0.2); }
  else if (g === 1) { st.ivl = Math.max(1, Math.round(st.ivl * 1.2)); st.ease = Math.max(1.3, st.ease - 0.15); st.reps++; }
  else if (g === 2) { st.ivl = st.reps === 0 ? 1 : st.reps === 1 ? 3 : Math.round(st.ivl * st.ease); st.reps++; }
  else { st.ivl = st.reps === 0 ? 3 : Math.round(Math.max(st.ivl, 1) * st.ease * 1.3); st.ease = Math.min(3, st.ease + 0.15); st.reps++; }
  st.due = TODAY + st.ivl; st.last = g; st.seen = (st.seen || 0) + 1;
  S.q[qid] = st; S.log.push({ t: Date.now(), q: qid, g }); if (S.log.length > 5000) S.log.splice(0, S.log.length - 5000);
  save();
}
const nextIvl = (qid, g) => { const st = S.q[qid] || { ivl: 0, ease: 2.5, reps: 0 };
  if (g === 0) return 'today'; const e = st.ease;
  const v = g === 1 ? Math.max(1, Math.round(st.ivl * 1.2)) : g === 2 ? (st.reps === 0 ? 1 : st.reps === 1 ? 3 : Math.round(st.ivl * e)) : (st.reps === 0 ? 3 : Math.round(Math.max(st.ivl, 1) * e * 1.3));
  return v + 'd'; };

/* ---------- shell ---------- */
function applyTheme() {
  if (S.theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', S.theme);
  document.body.classList.toggle('projector', !!S.projector);
}
function setMode(m) { S.mode = m; save(); $$('.mode button').forEach(b => b.classList.toggle('on', b.dataset.mode === m)); session = null; render(); }
$$('.mode button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
function footer() {
  $('#foot').innerHTML = `<div class="spread"><span>Independent Math 104 study notes. Class and theorem numbers identify the course and textbook references. <a href="https://github.com/bear1271/math-104-notes">Source and licensing</a>.</span>
    <span class="row"><button class="btn sm ghost" id="projBtn">${S.projector ? 'Normal size' : 'Projector size'}</button>
    <button class="btn sm ghost" id="themeBtn">Theme: ${S.theme}</button></span></div>`;
  $('#themeBtn').onclick = () => { S.theme = { auto: 'light', light: 'dark', dark: 'auto' }[S.theme]; save(); applyTheme(); footer(); };
  $('#projBtn').onclick = () => { S.projector = !S.projector; save(); applyTheme(); footer(); };
}
let cleanup = null;
function render() {
  if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
  const parts = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const v = parts[0] || '';
  $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.v === v));
  view.className = ''; view.innerHTML = '';
  (ROUTES[v] || home)(parts.slice(1));
  typeset(view);
  footer();
}

/* ---------- home ---------- */
function home() {
  const cov = covered(), due = dueList().length;
  const seen = Object.keys(S.q).length, total = D.questions.length;
  const fin = D.events.find(e => e.date >= todayISO());
  const daysTo = fin ? dayNum(fin.date) - TODAY : null;
  const overall = mean(cov.flatMap(n => qOfClass(n).map(q => qm(q.id))));
  const weakest = cov.slice().sort((a, b) => classM(a) - classM(b))[0];
  const teach = S.mode === 'teach';
  view.innerHTML = `
  <div class="hero">
    <div class="panel">
      <h1>Real analysis, from several angles</h1>
      <p class="muted">${D.classes.length} classes of the official handout, each seen as a layered lecture, a question bank, proof skeletons to rebuild,
      a dependency map, side-by-side comparisons, course-long threads, a counterexample museum and parameter labs.</p>
      <div class="stats">
        <div><div class="stat">${cov.length}<span class="muted" style="font-size:1rem">/${D.classes.length}</span></div><div class="stat-l">classes covered by today</div></div>
        <div><div class="stat">${due}</div><div class="stat-l">questions due</div></div>
        <div><div class="stat">${Math.round(overall * 100)}%</div><div class="stat-l">mastery, covered classes</div></div>
        ${daysTo != null ? `<div><div class="stat">${daysTo}</div><div class="stat-l">days to: ${esc(fin.name)}</div></div>` : ''}
      </div>
      <div class="row" style="margin-top:.8rem">
        ${teach ? `<a class="btn primary" href="#/learn/${latestCovered()}">Continue with Class ${latestCovered()}</a>
                   <a class="btn" href="#/practice/class/${latestCovered()}">Questions for Class ${latestCovered()}</a>`
                : `<a class="btn primary" href="#/practice">Start review${due ? ` (${due} due)` : ''}</a>
                   ${weakest ? `<a class="btn" href="#/learn/${weakest}">Weakest: Class ${weakest}</a>` : ''}`}
      </div>
      <p class="small muted" style="margin-top:.8rem">${teach
        ? '<strong>Teach mode</strong>: course order, with predict-before-reveal pauses. Good for a first pass or for presenting (try Projector size, keys <span class="kbd">j</span>/<span class="kbd">k</span> and <span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span>).'
        : '<strong>Review mode</strong>: ordered by what you know least — due questions first, then the weakest covered classes.'}
        Seen ${seen} of ${total} questions.</p>
    </div>
    <div class="panel">
      <div class="spread"><h3>Mastery by class</h3><a class="small" href="#/progress">details</a></div>
      ${heatGrid()}
      <p class="tiny muted" style="margin-top:.5rem">Dashed = not yet reached in the syllabus schedule. Colour = share of the class's questions you currently retain.</p>
    </div>
  </div>
  <div class="grid g3">
    ${entry('learn', 'Layered lecture', 'One line → statement and intuition → proof idea, skeleton and pitfalls. Drill down only where needed.')}
    ${entry('practice', 'Retrieval practice', `${total} questions at four levels: recall, explain, apply, compare. Spaced repetition; a miss links back to the source item.`)}
    ${entry('proof', 'Proof lab', 'Rebuild a proof from shuffled steps, fill a missing step, or knock out a hypothesis and meet the counterexample.')}
    ${entry('map', 'Dependency map', 'Every recorded relation between definitions and theorems. Tasks: find the missing link, trace a theorem back to the axioms.')}
    ${entry('compare', 'Side by side', 'Easily confused notions in parallel columns. Predict the difference first, then reveal row by row.')}
    ${entry('threads', 'Threads', 'Completeness, compactness, uniformity: how each pillar is passed from Class 1 to Class 32.')}
    ${entry('museum', 'Counterexample museum', 'One exhibit per false statement it refutes. Cover the label and name the door it closes.')}
    ${entry('labs', 'Parameter labs', 'Drag ε, n, partitions and degrees: watch convergence, continuity, integrals and approximation happen.')}
    ${entry('progress', 'Progress', 'Mastery per class and level, weakest items, export and import of your progress.')}
  </div>`;
}
const entry = (v, t, d) => `<a class="panel entry" href="#/${v}"><h3>${esc(t)}</h3><p>${esc(d)}</p></a>`;
function heatGrid() {
  const cov = new Set(covered());
  return `<div class="heat">${D.classes.map(c => {
    const m = qOfClass(c.n).length ? classM(c.n) : null;
    return `<a href="#/learn/${c.n}" class="${cov.has(c.n) ? '' : 'future'}" style="background:${heatColor(m)}" title="Class ${c.n}: ${esc(texPlain(c.title))} — ${m == null ? 'no questions' : Math.round(m * 100) + '%'}">${c.n}</a>`;
  }).join('')}</div>`;
}

/* ---------- learn: layered lecture ---------- */
const depth = {}; let depthClass = null; const revealed = new Set();
function learn([n, focus]) {
  n = +n || (S.mode === 'teach' ? latestCovered() : (covered().slice().sort((a, b) => classM(a) - classM(b))[0] || 1));
  const c = CLS[n]; if (!c) return learn([1]);
  if (depthClass !== n) { Object.keys(depth).forEach(k => delete depth[k]); depthClass = n; }
  if (focus && ITEMS[focus]) depth[focus] = Math.max(depth[focus] || 0, 3);
  const teach = S.mode === 'teach';
  const weeks = {}; D.classes.forEach(x => (weeks[x.week] = weeks[x.week] || []).push(x));
  const cov = new Set(covered());
  view.innerHTML = `<div class="layout">
    <aside class="side">${Object.entries(weeks).map(([w, cs]) => `<div class="wk">Week ${w}</div>` + cs.map(x => {
      const m = qOfClass(x.n).length ? classM(x.n) : null;
      return `<a href="#/learn/${x.n}" class="${x.n === n ? 'on' : ''}" style="${cov.has(x.n) ? '' : 'opacity:.6'}"><span class="n">${x.n}</span><span>${x.title_html}</span>
        <span class="m" style="background:${m == null ? 'var(--line)' : heatColor(Math.max(m, .05))}"></span></a>`;
    }).join('')).join('')}</aside>
    <section>
      <div class="classhead">
        <div class="spread"><span class="muted small">Class ${n} · Week ${c.week} · ${esc(c.date)} ${cov.has(n) ? '' : '· <em>upcoming</em>'}</span>
          <span class="row"><span class="small muted">Depth</span><span class="tiers">${[1, 2, 3].map(t => `<button data-t="${t}" class="${S.tier === t ? 'on' : ''}" title="${['', 'One line each', 'Statement + intuition', 'Everything'][t]}">${['', 'One line', 'Paragraph', 'Full'][t]}</button>`).join('')}</span></span></div>
        <h1>${c.title_html}</h1>
        ${c.big_idea ? `<p class="big">${rich(c.big_idea)}</p>` : ''}
        ${c.overview && S.tier >= 2 ? `<p>${rich(c.overview)}</p>` : ''}
        <p class="small muted">${c.reading}</p>
        ${teach && c.hook ? predictBox('hook-' + n, c.hook) : ''}
      </div>
      <div id="items">${c.items.map(id => itemCard(id)).join('')}</div>
      <div class="panel" style="margin-top:1rem">
        <a class="small" href="#/homework">Homework references</a>
        ${c.exam_links.length ? srcTag(false, 'On past exams') + `<ul class="small ex-list">${c.exam_links.map(e => `<li><strong>${esc(e.exam)}</strong> — ${rich(e.note)} ${(e.refs || []).map(r => ilink(r, ITEMS[r] ? `${ITEMS[r].kind} ${ITEMS[r].num}` : r)).join(', ')}</li>`).join('')}</ul>` : ''}
        <div class="row" style="margin-top:.8rem"><a class="btn primary" href="#/practice/class/${n}">Practice Class ${n} (${qOfClass(n).length})</a>
          ${n > 1 ? `<a class="btn" href="#/learn/${n - 1}">← Class ${n - 1}</a>` : ''}${n < D.classes.length ? `<a class="btn" href="#/learn/${n + 1}">Class ${n + 1} →</a>` : ''}</div>
      </div>
    </section></div>`;
  $$('.tiers button', view).forEach(b => b.onclick = () => { S.tier = +b.dataset.t; save(); Object.keys(depth).forEach(k => delete depth[k]); render(); });
  wireLearn();
  if (focus) setTimeout(() => { const el = document.getElementById('it-' + focus); if (el) { el.classList.add('focus'); el.scrollIntoView({ block: 'start' }); } }, 30);
  const onKey = e => {
    if (e.target.closest('textarea,input')) return;
    const cards = $$('.item', view); if (!cards.length) return;
    let i = cards.findIndex(x => x.classList.contains('focus'));
    if (e.key === 'j' || e.key === 'k') {
      i = Math.max(0, Math.min(cards.length - 1, i + (e.key === 'j' ? 1 : -1)));
      cards.forEach(x => x.classList.remove('focus')); cards[i].classList.add('focus'); cards[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
    } else if ('123'.includes(e.key) && i >= 0) { setDepth(cards[i].dataset.id, +e.key); }
  };
  document.addEventListener('keydown', onKey); cleanup = () => document.removeEventListener('keydown', onKey);
}
function predictBox(key, p) {
  const open = revealed.has(key);
  return `<div class="predict" data-key="${esc(key)}"><div class="q">${rich(p.prompt)}</div>
    ${open ? `<div class="reveal">${rich(p.reveal)}</div>` : `<div class="row" style="margin-top:.5rem"><span class="small muted">Commit to a guess (say it or jot it), then</span><button class="btn sm primary" data-reveal>Reveal</button></div>`}</div>`;
}
function itemCard(id) {
  const it = ITEMS[id], d = depth[id] || S.tier, m = qOfItem(id).some(q => S.q[q.id]) ? itemM(id) : null;
  return `<article class="item" id="it-${id}" data-id="${id}">
    <div class="item-h" data-toggle><span class="lbl k-${it.kind}">${esc(it.kind)} ${esc(it.num)}</span>
      <span class="gist">${it.gist ? rich(it.gist) : `<span class="muted">${esc(shortLabel(it))}</span>`}</span>
      ${m != null && S.mode === 'review' ? `<span class="chip" title="retention of questions about this item" style="background:${heatColor(m)}">${Math.round(m * 100)}%</span>` : ''}
      <span class="depth">${'●'.repeat(d)}${'○'.repeat(3 - d)}</span></div>
    ${d >= 2 ? `<div class="item-b">${itemBody(it, d)}</div>` : ''}</article>`;
}
function itemBody(it, d) {
  const teach = S.mode === 'teach', key = 'pred-' + it.id;
  let out = '';
  if (teach && it.predict && !revealed.has(key)) return predictBox(key, it.predict);
  if (it.predict && teach) out += predictBox(key, it.predict);
  out += srcTag(false, `Study statement · ${it.kind} ${it.num}${it.label ? ' · ' + it.label : ''}`) + `<div class="stmt">${it.statement}</div>`;
  if (it.intuition) out += srcTag(false, 'Intuition') + `<p>${rich(it.intuition)}</p>`;
  if (d < 3) return out;
  if (it.proof) out += srcTag(true, 'Handout · proof idea') + `<div class="stmt">${it.proof}</div>`;
  if (it.hypotheses && it.hypotheses.length) {
    const nec = {}; (it.necessity || []).forEach(x => nec[x.drop] = x);
    out += srcTag(false, 'Hypotheses → conclusion') + `<div class="hyps">${it.hypotheses.map((hy, i) => `<div class="hyp">${rich(hy)}${nec[i] ? `<div class="small muted">Drop it: ${rich(nec[i].counterexample)}</div>` : ''}</div>`).join('')}</div>`
      + (it.conclusion ? `<p>⇒ ${rich(it.conclusion)}</p>` : '');
  }
  if (it.proof_skeleton && it.proof_skeleton.length) out += srcTag(false, 'Proof skeleton') + `<ol class="skel">${it.proof_skeleton.map(s => `<li>${rich(s.step)}${s.why ? `<div class="why">${rich(s.why)}${(s.uses || []).length ? ' · ' + s.uses.map(u => ilink(u, ITEMS[u] ? `${ITEMS[u].kind[0]}${ITEMS[u].num}` : u)).join(', ') : ''}</div>` : ''}</li>`).join('')}</ol>`;
  if (it.examples && it.examples.length) out += srcTag(false, 'Examples') + `<ul class="ex-list">${it.examples.map(x => `<li>${rich(x)}</li>`).join('')}</ul>`;
  if (it.nonexamples && it.nonexamples.length) out += srcTag(false, 'Near misses') + `<ul class="ex-list">${it.nonexamples.map(x => `<li>${rich(x)}</li>`).join('')}</ul>`;
  if (it.pitfalls && it.pitfalls.length) out += srcTag(false, 'Pitfalls') + `<ul class="ex-list">${it.pitfalls.map(x => `<li>${rich(x)}</li>`).join('')}</ul>`;
  const ins = inEdges(it.id), outs = outEdges(it.id);
  if (ins.length || outs.length) {
    const fmt = (r, other, dir) => `<li>${dir === 'in' ? '' : esc(REL[r.type].label) + ' '}${ilink(other)}${dir === 'in' ? ' — ' + esc(REL[r.type].label) + ' this' : ''}
      <span class="tiny muted" title="${r.evidence === 'source_stated' ? 'stated in the handout' : 'inferred from the structure of the argument'}">${r.evidence === 'source_stated' ? '● handout' : '○ inferred'}</span>${r.note ? `<div class="small muted">${rich(r.note)}</div>` : ''}</li>`;
    out += srcTag(false, 'Connections') + `<ul class="ex-list small">${ins.map(r => fmt(r, r.from, 'in')).join('')}${outs.map(r => fmt(r, r.to, 'out')).join('')}</ul>`;
  }
  const extraProof = REFERENCE.proofs.find(p => p.ref === it.id);
  if (extraProof) out += '<p class="small">' + referenceResultLink(extraProof.title) + ' · full proof in Theorem Index</p>';
  const nq = qOfItem(it.id).length;
  out += `<div class="row links" style="margin-top:.6rem">
    ${nq ? `<a class="btn sm" href="#/practice/item/${it.id}">Practice (${nq})</a>` : ''}
    ${it.proof_skeleton && it.proof_skeleton.length ? `<a class="btn sm" href="#/proof/${it.id}">Proof lab</a>` : ''}
    ${['Definition', 'Theorem', 'Corollary'].includes(it.kind) ? `<a class="btn sm" href="#/explain/${it.id}">Explain it in your words</a>` : ''}
    <a class="btn sm" href="#/map/focus/${it.id}">On the map</a></div>`;
  return out;
}
function setDepth(id, dd) {
  depth[id] = dd; const el = document.getElementById('it-' + id); if (!el) return;
  const nw = h(itemCard(id)); nw.classList.toggle('focus', el.classList.contains('focus')); el.replaceWith(nw); typeset(nw); wireLearn(nw);
}
function wireLearn(root = view) {
  $$('[data-toggle]', root).forEach(x => x.onclick = () => { const id = x.parentElement.dataset.id; setDepth(id, ((depth[id] || S.tier) % 3) + 1); });
  $$('[data-reveal]', root).forEach(b => b.onclick = e => {
    e.stopPropagation(); const box = b.closest('.predict'); revealed.add(box.dataset.key);
    const card = b.closest('.item'); if (card) setDepth(card.dataset.id, Math.max(depth[card.dataset.id] || S.tier, 2)); else render();
  });
}

/* ---------- practice: retrieval + spaced repetition ---------- */
let session = null;
const PF = { levels: new Set(LEVELS), scope: 'covered' };
function buildQueue(args) {
  const [kind, val] = args; let pool, label;
  if (kind === 'class') { pool = qOfClass(+val); label = `Class ${val}`; }
  else if (kind === 'item') { pool = qOfItem(val); label = ITEMS[val] ? iname(ITEMS[val]) : val; }
  else if (kind === 'weak') { pool = D.questions.filter(q => S.q[q.id] && covered().includes(q.cls)).sort((a, b) => qm(a.id) - qm(b.id)).slice(0, 15); label = 'Weakest seen questions'; }
  else { const cov = new Set(covered()); pool = PF.scope === 'all' ? D.questions : D.questions.filter(q => cov.has(q.cls)); label = PF.scope === 'all' ? 'All classes' : 'Covered classes'; }
  pool = pool.filter(q => PF.levels.has(q.level));
  let queue;
  if (kind === 'class' || kind === 'item' || kind === 'weak' || S.mode === 'teach') {
    queue = kind === 'weak' ? pool : (S.mode === 'teach' ? pool : [...pool.filter(q => !S.q[q.id] || S.q[q.id].due <= TODAY), ...pool.filter(q => S.q[q.id] && S.q[q.id].due > TODAY)]);
  } else {
    const due = pool.filter(q => S.q[q.id] && S.q[q.id].due <= TODAY).sort((a, b) => S.q[a.id].due - S.q[b.id].due);
    const order = [...new Set(pool.map(q => q.cls))].sort((a, b) => classM(a) - classM(b) || a - b);
    const fresh = []; const byC = {}; pool.filter(q => !S.q[q.id]).forEach(q => (byC[q.cls] = byC[q.cls] || []).push(q));
    // weakest classes first; within a class rotate the levels so one session mixes recall with apply
    order.forEach(cn => { const qs = byC[cn] || []; const byL = LEVELS.map(l => qs.filter(q => q.level === l));
      for (let k = 0; byL.some(x => x.length); k++) { const L = byL[k % 4]; if (L.length) fresh.push(L.shift()); } });
    queue = [...due.slice(0, 30), ...fresh.slice(0, Math.max(5, 20 - due.length))];
  }
  return { key: args.join('/') + '|' + S.mode + '|' + [...PF.levels].join() + PF.scope, label, queue: queue.map(q => q.id), i: 0, results: [], requeued: new Set() };
}
function practice(args) {
  const key = args.join('/') + '|' + S.mode + '|' + [...PF.levels].join() + PF.scope;
  if (!session || session.key !== key) session = buildQueue(args);
  const s = session, qid = s.queue[s.i];
  const scopeChips = !args.length ? `<button class="chip ${PF.scope === 'covered' ? 'on' : ''}" data-scope="covered">Covered so far</button><button class="chip ${PF.scope === 'all' ? 'on' : ''}" data-scope="all">All classes</button><span class="muted small">·</span>` : `<a class="chip" href="#/practice">← all practice</a>`;
  view.innerHTML = `<div class="qcard">
    <div class="filters">${scopeChips}${LEVELS.map(l => `<button class="chip ${PF.levels.has(l) ? 'on' : ''}" data-level="${l}" title="${LEVEL_DESC[l]}">${l}</button>`).join('')}
      <span class="muted small" style="margin-left:auto">${esc(s.label)} · ${S.mode === 'teach' ? 'course order' : 'weakest first'}</span></div>
    <div class="progressline"><span>${Math.min(s.i, s.queue.length)}/${s.queue.length}</span><div class="bar"><i style="width:${s.queue.length ? 100 * s.i / s.queue.length : 0}%"></i></div>
      <span>${s.results.filter(r => r.g > 0).length} ✓ · ${s.results.filter(r => r.g === 0).length} ✗</span></div>
    <div id="qarea"></div></div>`;
  $$('[data-level]', view).forEach(b => b.onclick = () => { const l = b.dataset.level; if (PF.levels.has(l) && PF.levels.size > 1) PF.levels.delete(l); else PF.levels.add(l); render(); });
  $$('[data-scope]', view).forEach(b => b.onclick = () => { PF.scope = b.dataset.scope; render(); });
  const area = $('#qarea');
  if (!qid) { area.appendChild(h(sessionSummary(s, args))); $('#again', area) && ($('#again', area).onclick = () => { session = null; render(); }); return; }
  area.appendChild(renderQuestion(Q[qid], g => {
    s.results.push({ q: qid, g }); grade(qid, g);
    if (g === 0 && !s.requeued.has(qid)) { s.requeued.add(qid); s.queue.splice(Math.min(s.queue.length, s.i + 4), 0, qid); }
    s.i++; render();
  }));
}
function sessionSummary(s, args) {
  if (!s.queue.length) return `<div class="panel empty"><h2>Nothing to review here</h2><p>No questions match these filters${S.mode === 'review' ? ' — everything is scheduled for later' : ''}.</p>
    <div class="row" style="justify-content:center"><a class="btn primary" href="#/practice/weak">Extra practice: weakest seen</a><a class="btn" href="#/practice/class/${latestCovered()}">Class ${latestCovered()}</a></div></div>`;
  const miss = s.results.filter(r => r.g === 0).map(r => Q[r.q]);
  const refs = [...new Set(miss.flatMap(q => q.refs || []))];
  const byL = LEVELS.map(l => { const rs = s.results.filter(r => Q[r.q].level === l); return rs.length ? `${l}: ${rs.filter(r => r.g > 0).length}/${rs.length}` : null; }).filter(Boolean);
  return `<div class="panel"><h2>Session done</h2><p>${s.results.filter(r => r.g > 0).length} of ${s.results.length} answers recalled. ${byL.join(' · ')}</p>
    ${refs.length ? `<h3>Go back to</h3><ul class="ex-list">${refs.map(r => `<li>${ilink(r)}${ITEMS[r] && ITEMS[r].gist ? ` — <span class="muted">${rich(ITEMS[r].gist)}</span>` : ''}</li>`).join('')}</ul>` : '<p class="ok">No misses.</p>'}
    <div class="row"><button class="btn primary" id="again">New session</button><a class="btn" href="#/progress">Progress</a></div></div>`;
}
function renderQuestion(q, done) {
  const el = h(`<div class="panel">
    <div class="qmeta"><span class="chip">Class ${q.cls}</span><span class="chip" title="${LEVEL_DESC[q.level]}">${q.level}</span><span class="chip">${{ mcq: 'multiple choice', tf: 'true / false', cloze: 'fill in', open: 'open answer' }[q.format]}</span>
      ${S.q[q.id] ? `<span class="chip">seen ${S.q[q.id].seen || 1}×</span>` : '<span class="chip on">new</span>'}</div>
    <div class="qprompt">${q.format === 'cloze' ? clozeHTML(q.prompt) : rich(q.prompt)}</div>
    <div class="qbody"></div><div class="qafter"></div></div>`);
  const body = $('.qbody', el), after = $('.qafter', el);
  const back = () => `<div class="small" style="margin-top:.6rem">Source: ${(q.refs || []).map(r => ilink(r)).join(' · ')}</div>`;
  const gradeRow = (opts) => {
    after.insertAdjacentHTML('beforeend', `<div class="grades">${opts.map(([g, t]) => `<button class="btn ${g === 2 ? 'primary' : ''}" data-g="${g}">${t}<small>${nextIvl(q.id, g)}</small></button>`).join('')}</div>`);
    $$('[data-g]', after).forEach(b => b.onclick = () => done(+b.dataset.g));
  };
  const showExpl = ok => {
    after.insertAdjacentHTML('beforeend', `<div class="panel ${ok ? 'box-ok' : 'box-no'}" style="margin-top:.8rem;box-shadow:none"><strong class="${ok ? 'ok' : 'no'}">${ok ? 'Correct.' : 'Not quite.'}</strong> ${rich(q.explanation || '')}${back()}</div>`);
    typeset(after);
  };
  if (q.format === 'mcq' || q.format === 'tf') {
    const choices = q.format === 'tf' ? ['True', 'False'] : q.choices;
    const correct = q.format === 'tf' ? (q.answer ? 0 : 1) : q.answer;
    // authored order: explanations may refer to choices by position or letter
    const order = choices.map((_, i) => i);
    body.innerHTML = `<div class="choices">${order.map((i, k) => `<button class="choice" data-i="${i}"><span class="muted">${q.format === 'tf' ? '' : String.fromCharCode(65 + k) + '. '}</span>${rich(choices[i])}</button>`).join('')}</div>`;
    $$('.choice', body).forEach(b => b.onclick = () => {
      const i = +b.dataset.i, ok = i === correct;
      $$('.choice', body).forEach(x => { x.disabled = true; if (+x.dataset.i === correct) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      showExpl(ok);
      if (ok) gradeRow([[1, 'Hard / guessed'], [2, 'Good'], [3, 'Easy']]); else gradeRow([[0, 'Next']]);
    });
    const onKey = e => { if (e.target.closest('textarea,input')) return; const k = e.key.toUpperCase(); const idx = q.format === 'tf' ? { T: 0, F: 1 }[k] : k.charCodeAt(0) - 65;
      const bs = $$('.choice', body); if (idx >= 0 && idx < bs.length && !bs[idx].disabled) bs[idx].click(); };
    document.addEventListener('keydown', onKey); const prev = cleanup; cleanup = () => { document.removeEventListener('keydown', onKey); prev && prev(); };
  } else if (q.format === 'cloze') {
    body.innerHTML = `<div class="row"><button class="btn primary" data-show>Reveal all blanks</button><span class="small muted">or click a blank. Say the missing words first.</span></div>`;
    const finish = () => { $$('.cloze-blank', el).forEach(x => x.classList.add('shown')); body.innerHTML = q.explanation ? `<p class="small muted">${rich(q.explanation)}</p>` : ''; body.insertAdjacentHTML('beforeend', back()); typeset(body); selfGrade(); };
    $$('.cloze-blank', el).forEach(x => x.onclick = () => { x.classList.add('shown'); if ($$('.cloze-blank:not(.shown)', el).length === 0) finish(); });
    $('[data-show]', body).onclick = finish;
  } else {
    body.innerHTML = `<textarea placeholder="Write your answer or proof outline (optional — writing it out is the practice)."></textarea>
      <div class="row" style="margin-top:.5rem"><button class="btn primary" data-show>Show model answer</button></div>`;
    $('[data-show]', body).onclick = () => {
      $('[data-show]', body).remove();
      body.insertAdjacentHTML('beforeend', `<div class="panel" style="margin-top:.6rem;box-shadow:none">${srcTag(false, 'Model answer')}<div class="stmt">${rich(q.answer)}</div>${q.explanation ? `<p class="small muted">${rich(q.explanation)}</p>` : ''}${back()}</div>`);
      typeset(body); selfGrade();
    };
  }
  function selfGrade() { gradeRow([[0, 'Missed'], [1, 'Partly'], [2, 'Got it'], [3, 'Easy']]); }
  return el;
}
function clozeHTML(p) {
  // split on [[...]] before escaping so TeX inside blanks survives
  return p.split(/(\[\[[\s\S]+?\]\])/).map(part => { const m = part.match(/^\[\[([\s\S]+)\]\]$/); return m ? `<span class="cloze-blank">${rich(m[1])}</span>` : rich(part); }).join('');
}

/* ---------- proof lab ---------- */

/* ---------- layered proof practice ---------- */
function proofPathHref(id, tab, route, exercise = '') {
  return `#/proof/${id}/${tab}/${route}${exercise ? '/' + exercise : ''}`;
}
function proofPathProgress(id, routeId) {
  return S.proof[id]?.paths?.[routeId] || {};
}
function proofPathActivity(id, routeId) {
  const proof = S.proof[id] ||= {};
  const paths = proof.paths ||= {};
  return paths[routeId] ||= {};
}
function proofPathCounts(id, route) {
  const progress = proofPathProgress(id, route.id);
  const keys = route.steps.flatMap(s => s.details.map(d => s.id + '/' + d.id));
  return { skeleton: Boolean(progress.skeleton), total: keys.length,
    mastered: keys.filter(key => progress.details?.[key]?.status === 'got-it').length };
}
function layeredProof(it, tab, routeId, stepId, detailId) {
  const routes = PROOF_PATHS[it.id];
  const route = routes.find(path => path.id === routeId) || routes[0];
  const href = (target, exercise) => proofPathHref(it.id, target, route.id, exercise);
  const tabs = [['skeleton', 'Skeleton'], ['details', 'Details'], ['full', 'Reference proof']];
  view.innerHTML = `<div class="spread"><a href="#/proof" class="small">All proofs</a><a class="small" href="#/learn/${it.cls}/${it.id}">Open in Learn</a></div>
    <h1>${rich(iname(it))}</h1>
    <div class="panel">${srcTag(false, 'Study statement')}<div class="stmt">${it.statement}</div></div>
    ${proofConditions(it)}
    <nav class="row proof-actions" aria-label="Proof routes">${routes.map(path => `<a class="btn sm${path === route ? ' primary' : ''}" href="${proofPathHref(it.id, tab, path.id)}"
      ${path === route ? 'aria-current="page"' : ''}>${esc(path.title)}</a>`).join('')}</nav>
    <p class="small muted">${esc(route.scope)} · ${esc(route.source)}</p>
    <nav class="row proof-actions" aria-label="Proof exercises">${tabs.map(([key, label]) => `<a class="btn sm${tab === key ? ' primary' : ''}" href="${href(key)}"
      ${tab === key ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
      ${it.necessity?.length ? `<a class="btn sm" href="#/proof/${it.id}/knock">Hypothesis counterexamples</a>` : ''}<a class="btn sm" href="#/proof/${it.id}/order">Quick Review</a></nav>
    <p class="small muted" id="proof-counts" role="status"></p><section id="lab"></section>`;
  const lab = $('#lab');
  const updateCounts = () => {
    const count = proofPathCounts(it.id, route);
    $('#proof-counts').textContent = `Skeleton · ${count.skeleton ? 'ordered correctly' : 'to practise'} | Details · ${count.mastered}/${count.total} marked Got it`;
  };
  updateCounts();
  if (tab === 'skeleton') {
    drawLayeredOrder(lab, it, route, href, updateCounts);
  } else if (tab === 'details') {
    drawLayeredDetails(lab, it, route, href, updateCounts, stepId + '/' + detailId);
  } else {
    lab.innerHTML = `<ol class="proof-reference">${route.steps.map(step => `<li class="panel">
      <h3>${esc(step.title)}</h3><p>${rich(step.claim)}</p>
      ${step.details.map(d => `<p>${rich(d.answer)}</p>`).join('')}
      <div class="row">${step.details.map(d => `<a class="small" href="${href('details', step.id + '/' + d.id)}">${rich(d.title)}</a>`).join('')}</div>
      </li>`).join('')}</ol>
      <div class="panel"><h3>Where the argument transfers</h3><p>${rich(route.transfer)}</p></div>
      ${it.proof && route.id === 'handout' ? `<details class="proof-reveal"><summary>Original handout proof idea</summary><div class="stmt">${it.proof}</div></details>` : ''}`;
  }
}
function drawLayeredOrder(lab, it, route, href, updateCounts) {
  const ordered = [];
  const byId = new Map(route.steps.map(s => [s.id, s]));
  const shuffled = shuffle(route.steps.map(s => s.id));
  if (shuffled.every((key, i) => key === route.steps[i].id)) shuffled.reverse();
  const draw = () => {
    const card = (key, selected) => {
      const node = byId.get(key);
      return `<button type="button" class="step${selected ? ' placed' : ''}" data-step-id="${esc(key)}"><strong>${esc(node.title)}</strong><br>${rich(node.claim)}</button>`;
    };
    lab.innerHTML = `<p>Order the intermediate claims by their dependencies. Independent lemmas can appear in any order.</p>
      <div class="grid g2"><div><h3>Available steps</h3><div class="steps">${shuffled.filter(key => !ordered.includes(key)).map(key => card(key, false)).join('') || '<p class="muted small">All placed.</p>'}</div></div>
      <div><h3>Your proof order</h3><ol class="proof-order">${ordered.map(key => `<li>${card(key, true)}</li>`).join('')}</ol></div></div>
      <div class="row proof-actions"><button class="btn primary" id="check-proof-order" ${ordered.length < shuffled.length ? 'disabled' : ''}>Check dependencies</button>
      <button class="btn" id="clear-proof-order">Start over</button><a href="${href('full')}">Reference proof</a></div>
      <div id="proof-order-feedback" role="status"></div>`;
    $$('[data-step-id]', lab).forEach(b => b.onclick = () => {
      const key = b.dataset.stepId, index = ordered.indexOf(key);
      if (index < 0) ordered.push(key); else ordered.splice(index, 1);
      draw();
      $$('[data-step-id]', lab).find(button => button.dataset.stepId === key)?.focus();
    });
    $('#clear-proof-order').onclick = () => { ordered.length = 0; draw(); $('#clear-proof-order').focus(); };
    $('#check-proof-order').onclick = () => {
      const pos = new Map(ordered.map((key, index) => [key, index]));
      const failures = route.steps.flatMap(s => s.needs.filter(key => pos.get(key) > pos.get(s.id)).map(key =>
        `<li>${esc(byId.get(key).title)} must come before ${esc(s.title)}.</li>`));
      if (!failures.length) {
        proofPathActivity(it.id, route.id).skeleton = true;
        save();
        updateCounts();
      }
      $('#proof-order-feedback').innerHTML = failures.length
        ? `<p>Check these prerequisites.</p><ul>${failures.join('')}</ul>`
        : `<p class="ok"><strong>All prerequisites are in order.</strong> <a href="${href('details')}">Practise the details</a></p>`;
    };
    typeset(lab);
  };
  draw();
}
function drawLayeredDetails(lab, it, route, href, updateCounts, requested) {
  const progress = proofPathProgress(it.id, route.id);
  const exercises = route.steps.flatMap(step => step.details.map(d => ({ step, d, key: step.id + '/' + d.id })));
  const active = exercises.find(ex => ex.key === requested)
    || exercises.find(ex => progress.details?.[ex.key]?.status !== 'got-it') || exercises[0];
  const { step, d, key } = active;
  const index = exercises.indexOf(active);
  const rated = progress.details?.[key]?.status;
  lab.innerHTML = `<label class="proof-detail-picker">Choose a detail <select id="proof-exercise-picker">
    ${route.steps.map(node => `<optgroup label="${esc(node.title)}">${exercises.filter(ex => ex.step === node).map(ex => `<option value="${esc(ex.key)}" ${ex === active ? 'selected' : ''}>${progress.details?.[ex.key]?.status === 'got-it' ? '✓ ' : ''}${esc(ex.d.title)}</option>`).join('')}</optgroup>`).join('')}
    </select></label>
    <div class="panel proof-detail">
      <h2>${rich(d.title)}</h2><p class="small muted">${esc(step.title)}</p><p>${rich(d.prompt)}</p>
      <label for="proof-attempt" class="small">Write your argument</label><textarea id="proof-attempt" rows="5"></textarea>
      <details class="proof-reveal"><summary>Hint</summary><p>${rich(d.hint)}</p></details>
      <details class="proof-reveal" id="proof-solution"><summary>Reference solution and self-check</summary>
        <p>${rich(d.answer)}</p><p><strong>Self-check</strong> ${rich(d.check)}</p>
        ${d.refs.length ? `<div class="small">${d.refs.map(ref => ilink(ref)).join(' · ')}</div>` : ''}
        <div class="row proof-actions" aria-label="Self-assessment">
          <button class="btn sm" data-rating="got-it" aria-pressed="${rated === 'got-it'}">Got it</button>
          <button class="btn sm" data-rating="again" aria-pressed="${rated === 'again'}">Review again</button>
          <span class="small muted" id="proof-rating-message" role="status">${rated === 'got-it' ? 'Marked Got it' : rated === 'again' ? 'Marked Review again' : ''}</span>
        </div>
      </details>
    </div>
    <div class="spread proof-actions">
      ${index > 0 ? `<a href="${href('details', exercises[index - 1].key)}">Previous detail</a>` : '<span></span>'}
      ${index + 1 < exercises.length ? `<a href="${href('details', exercises[index + 1].key)}">Next detail</a>` : `<a href="${href('full')}">Reference proof</a>`}
    </div>`;
  $('#proof-exercise-picker').onchange = e => { location.hash = href('details', e.target.value); };
  $$('[data-rating]', lab).forEach(button => button.onclick = () => {
    const stored = proofPathActivity(it.id, route.id);
    const records = stored.details ||= {};
    const status = button.dataset.rating;
    records[key] = { status, t: Date.now() };
    save();
    updateCounts();
    $('#proof-rating-message').textContent = status === 'got-it' ? 'Marked Got it' : 'Marked Review again';
    $$('[data-rating]', lab).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $('#proof-exercise-picker').selectedOptions[0].textContent = (status === 'got-it' ? '✓ ' : '') + d.title;
  });
}
function mergeProofProgress(imported) {
  for (const [id, incoming] of Object.entries(imported || {})) {
    if (!incoming || !Object.hasOwn(ITEMS, id)) continue;
    const current = S.proof[id] || {};
    const merged = { ...current, ...incoming };
    if (current.order || incoming.order) merged.order = true;
    merged.paths = { ...current.paths };
    for (const [routeId, path] of Object.entries(incoming.paths || {})) {
      if (!path || !PROOF_PATHS[id]?.some(route => route.id === routeId)) continue;
      const previous = merged.paths[routeId] || {};
      const details = { ...previous.details };
      for (const [key, rating] of Object.entries(path.details || {})) {
        if (rating && (!details[key] || rating.t >= details[key].t)) details[key] = rating;
      }
      merged.paths[routeId] = { skeleton: Boolean(previous.skeleton || path.skeleton), details };
    }
    S.proof[id] = merged;
  }
}


function proofConditions(it) {
  const notes = PROOF_SOURCES.conditions.filter(row => row.theorem === it.id);
  const coveredRefs = new Set(notes.flatMap(row => row.refs));
  const prerequisites = [...new Set(it.proof_skeleton.flatMap(step => step.uses || []))]
    .filter(ref => !coveredRefs.has(ref));
  const hypotheses = it.hypotheses || [];
  if (!notes.length && !prerequisites.length && !hypotheses.length) return '';
  return `<details class="panel reference-entry"><summary><strong>Conditions and prerequisites</strong></summary>
    ${hypotheses.length ? `<h3>Recorded hypotheses</h3><ul>${hypotheses.map(h => `<li>${rich(h)}</li>`).join('')}</ul>` : ''}
    ${notes.length ? `<h3>Where they enter the proof</h3><ul>${notes.map(row => `<li><strong>${esc(row.step)}</strong><div>${rich(row.condition)}</div><div class="small">${row.refs.map(ref => ilink(ref)).join(' · ')}</div></li>`).join('')}</ul>` : ''}
    ${prerequisites.length ? `<p class="small"><strong>Linked prerequisites from the proof skeleton</strong><br>${prerequisites.map(ref => ilink(ref)).join(' · ')}</p>` : ''}
  </details>`;
}

function renderProofSources(id, lab) {
  const routes = PROOF_SOURCES.routes.filter(row => row.theorem === id);
  const readings = PROOF_SOURCES.readings.filter(row => row.theorem === id);
  const sourceLabel = label => label.startsWith('Mathematics in Lean')
    ? `<a href="https://leanprover-community.github.io/mathematics_in_lean/C11_Topology.html#${label.endsWith('11.2.4') ? 'uniformly-continuous-functions' : 'completeness'}">${esc(label)}</a>`
    : rich(label);
  lab.innerHTML = `<h2>Proof routes by source</h2>
    <p class="small muted">Source summaries identify the route and its scope. The reading notes below unpack individual steps.</p>
    ${routes.map(row => `<article class="panel reference-entry"><h3>${sourceLabel(row.source)}</h3><p class="small muted">${rich(row.scope)}</p><p>${rich(row.route)}</p></article>`).join('')}
    <h2 style="margin-top:1rem">Steps to unpack</h2>
    ${readings.map(row => `<details class="panel reference-entry"><summary><strong>${esc(row.title)}</strong><span class="small muted">${rich(row.at)}</span></summary><p>${rich(row.reading)}</p></details>`).join('')}`;
}

function proof([id, tab, routeId, stepId, detailId]) {
  if (Object.hasOwn(PROOF_PATHS, id) && (!tab || ['skeleton', 'details', 'full'].includes(tab))) {
    return layeredProof(ITEMS[id], tab || 'skeleton', routeId, stepId, detailId);
  }
  const list = Object.values(ITEMS).filter(it => it.proof_skeleton && it.proof_skeleton.length >= 2);
  if (!id || !ITEMS[id] || !ITEMS[id].proof_skeleton) {
    const byC = {}; list.forEach(it => (byC[it.cls] = byC[it.cls] || []).push(it));
    view.innerHTML = `<h1>Proof Lab</h1>
      ${Object.entries(byC).map(([c, its]) => `<h3 style="margin-top:1rem">Class ${c} · ${CLS[c].title_html}</h3><div class="pick">${its.map(it => {
        const p = S.proof[it.id] || {}; return `<a href="#/proof/${it.id}"><strong class="k-${it.kind}">${esc(it.kind)} ${esc(it.num)}</strong> ${p.order ? '<span class="ok" title="ordered correctly">✓</span>' : ''}<div>${it.gist ? rich(it.gist) : esc(shortLabel(it))}</div><div class="muted">${Object.hasOwn(PROOF_PATHS, it.id) ? 'Layered proof · ' : ''}${sourceNoteIds.includes(it.id) ? 'Source notes · ' : ''}${it.proof_skeleton.length} steps · ${(it.necessity || []).length} knockouts</div></a>`;
      }).join('')}</div>`).join('')}`;
    return;
  }
  const it = ITEMS[id]; tab = tab || 'order';
  const steps = it.proof_skeleton;
  view.innerHTML = `<div class="spread"><a href="#/proof" class="small">← all proofs</a><a class="small" href="#/learn/${it.cls}/${id}">open in lecture</a></div>
    <h1 class="k-${it.kind}">${esc(iname(it))}</h1>
    <div class="panel">${srcTag(false, 'Study statement')}<div class="stmt">${it.statement}</div></div>
    ${proofConditions(it)}
    <div class="tabs">${[['order', 'Order the steps'], ['gap', 'Fill the gap'], ['knock', 'Knock out a hypothesis'], ['full', 'Full skeleton'], ...(sourceNoteIds.includes(id) ? [['sources', 'Source Notes']] : [])].map(([k, t]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    ${Object.hasOwn(PROOF_PATHS, id) ? `<p class="small"><a href="#/proof/${id}/skeleton">Open Layered Proofs</a></p>` : ''}
    <div id="lab"></div>`;
  $$('[data-tab]', view).forEach(b => b.onclick = () => { location.hash = `#/proof/${id}/${b.dataset.tab}`; });
  const lab = $('#lab');
  if (tab === 'sources' && sourceNoteIds.includes(id)) return renderProofSources(id, lab);
  if (tab === 'order') {
    let order = shuffle(steps.map((_, i) => i)); if (order.every((v, i) => v === i)) order.reverse();
    const placed = [];
    const draw = (checked) => {
      lab.innerHTML = `<p class="muted small">Click the steps in the order the proof needs them. Click a placed step to take it back.</p>
        <div class="grid g2"><div><h3>Shuffled</h3><div class="steps">${order.filter(i => !placed.includes(i)).map(i => `<button class="step" data-i="${i}">${rich(steps[i].step)}</button>`).join('') || '<p class="muted small">All placed.</p>'}</div></div>
        <div><h3>Your proof</h3><div class="steps">${placed.map((i, k) => `<button class="step placed ${checked ? (i === k ? 'right' : 'wrong') : ''}" data-p="${k}"><span class="num">${k + 1}</span>${rich(steps[i].step)}</button>`).join('') || '<p class="muted small">Nothing yet.</p>'}</div>
        <div class="row" style="margin-top:.6rem"><button class="btn primary" id="chk" ${placed.length < steps.length ? 'disabled' : ''}>Check</button><button class="btn" id="rst">Reshuffle</button></div>
        <div id="res"></div></div></div>`;
      $$('[data-i]', lab).forEach(b => b.onclick = () => { placed.push(+b.dataset.i); draw(); });
      $$('[data-p]', lab).forEach(b => b.onclick = () => { if (!checked) { placed.splice(+b.dataset.p, 1); draw(); } });
      $('#rst', lab).onclick = () => proof([id, 'order']);
      $('#chk', lab).onclick = () => {
        draw(true); const ok = placed.every((v, i) => v === i);
        S.proof[id] = Object.assign(S.proof[id] || {}, { order: (S.proof[id] || {}).order || ok, t: Date.now() }); save();
        $('#res', lab).innerHTML = ok ? '<p class="ok"><strong>Correct order.</strong></p>' : `<div class="panel box-no" style="margin-top:.6rem;box-shadow:none"><strong>Not yet.</strong> The intended order, with the reason for each step:<ol class="skel">${steps.map(s => `<li>${rich(s.step)}<div class="why">${rich(s.why || '')}</div></li>`).join('')}</ol></div>`;
        typeset(lab);
      };
      typeset(lab);
    };
    draw();
  } else if (tab === 'gap') {
    const k = Math.floor(Math.random() * steps.length);
    lab.innerHTML = `<p class="muted small">One step is hidden. Write what must happen there, then reveal.</p><ol class="skel">${steps.map((s, i) => i === k
      ? `<li><textarea placeholder="Step ${i + 1}: what goes here?" style="min-height:4rem"></textarea><div class="row" style="margin:.3rem 0"><button class="btn sm primary" id="rv">Reveal</button><button class="btn sm" id="ot">Another gap</button></div><div id="ans"></div></li>`
      : `<li>${rich(s.step)}</li>`).join('')}</ol>`;
    $('#ot', lab).onclick = () => proof([id, 'gap']);
    $('#rv', lab).onclick = () => { const s = steps[k]; $('#ans', lab).innerHTML = `<div class="panel" style="box-shadow:none">${rich(s.step)}<div class="small muted">${rich(s.why || '')}${(s.uses || []).length ? ' · uses ' + s.uses.map(u => ilink(u)).join(', ') : ''}</div></div>`; typeset(lab); };
  } else if (tab === 'knock') {
    const hyps = it.hypotheses || [], nec = {}; (it.necessity || []).forEach(x => nec[x.drop] = x);
    if (!hyps.length) { lab.innerHTML = '<p class="muted">No hypothesis list recorded for this item.</p>'; return; }
    lab.innerHTML = `<p class="muted small">Switch a hypothesis off. Before the reveal, decide: does the conclusion survive?</p>
      <div id="kos">${hyps.map((hy, i) => `<div class="ko" data-i="${i}"><button class="btn sm" data-off="${i}">Switch off</button><div style="flex:1"><div class="hyptext">${rich(hy)}</div><div class="kores"></div></div></div>`).join('')}</div>
      <p>⇒ ${rich(it.conclusion || '')}</p>`;
    $$('[data-off]', lab).forEach(b => b.onclick = () => {
      const i = +b.dataset.off, box = b.closest('.ko'), res = $('.kores', box); box.classList.add('off'); b.remove();
      res.innerHTML = `<div class="row" style="margin-top:.3rem"><span class="small">Without it, the conclusion…</span><button class="btn sm" data-g="hold">still holds</button><button class="btn sm" data-g="fail">can fail</button></div>`;
      $$('[data-g]', res).forEach(g => g.onclick = () => {
        const n = nec[i], guess = g.dataset.g;
        res.innerHTML = n ? `<div class="small" style="margin-top:.3rem"><strong class="${guess === 'fail' ? 'ok' : 'no'}">${guess === 'fail' ? 'Right — it can fail.' : 'It can fail.'}</strong> ${rich(n.counterexample)}${n.fails ? `<div class="muted">${rich(n.fails)}</div>` : ''}</div>`
          : `<div class="small muted" style="margin-top:.3rem">No counterexample is recorded for dropping this one. It may be needed only by this proof technique, or be part of the setting — try to find one yourself, or check the textbook proof.</div>`;
        typeset(res);
      });
    });
  } else {
    lab.innerHTML = `<ol class="skel">${steps.map(s => `<li>${rich(s.step)}<div class="why">${rich(s.why || '')}${(s.uses || []).length ? ' · uses ' + s.uses.map(u => ilink(u)).join(', ') : ''}</div></li>`).join('')}</ol>
      ${it.proof ? srcTag(true, 'Handout proof idea') + `<div class="stmt">${it.proof}</div>` : ''}`;
  }
}

/* ---------- dependency map ---------- */
function mapView(args) {
  view.className = 'wide';
  if (!window.cytoscape) { const s = document.createElement('script'); s.src = 'vendor/cytoscape-3.34.3.min.js'; s.onload = () => render(); document.head.appendChild(s); view.innerHTML = '<p class="muted">Loading map…</p>'; return; }
  const ids = new Set(); D.relations.forEach(r => { ids.add(r.from); ids.add(r.to); });
  Object.values(ITEMS).forEach(it => { if (['Definition', 'Theorem', 'Corollary'].includes(it.kind)) ids.add(it.id); });
  const lane = it => ({ Definition: 0, Theorem: 1, Corollary: 1, Example: 2, Remark: 2 }[it.kind] ?? 2);
  const counts = {}; [...ids].forEach(id => { const it = ITEMS[id]; const k = it.cls + ':' + lane(it); counts[k] = (counts[k] || 0) + 1; });
  const laneH = [0, 1, 2].map(l => Math.max(...D.classes.map(c => counts[c.n + ':' + l] || 0)));
  const laneTop = [0, (laneH[0] + 1) * 44, (laneH[0] + laneH[1] + 2) * 44];
  const pos = {}, used = {};
  D.classes.forEach(c => c.items.forEach(id => { if (!ids.has(id)) return; const it = ITEMS[id], l = lane(it), k = c.n + ':' + l; used[k] = (used[k] || 0);
    pos[id] = { x: (c.n - 1) * 175, y: laneTop[l] + used[k] * 44 }; used[k]++; }));
  const cs = getComputedStyle(document.documentElement), col = v => cs.getPropertyValue(v).trim();
  const kindColor = { Definition: col('--def'), Theorem: col('--thm'), Corollary: col('--thm'), Example: col('--exa'), Remark: col('--rem') };
  const els = [...ids].map(id => { const it = ITEMS[id]; return { data: { id, label: `${it.num} ${texPlain(shortLabel(it) || it.gist || '').slice(0, 26)}`, kind: it.kind, cls: it.cls, c: kindColor[it.kind] }, position: pos[id] }; })
    .concat(D.relations.map((r, i) => ({ data: { id: 'e' + i, source: r.from, target: r.to, type: r.type, ev: r.evidence, c: REL[r.type].color } })));
  view.innerHTML = `<div class="mapwrap"><div id="cy"></div><div class="mapside">
    <div class="tabs" style="margin-top:0">${[['explore', 'Explore'], ['link', 'Missing link'], ['trace', 'Trace back'], ['path', 'Path']].map(([k, t]) => `<button data-m="${k}">${t}</button>`).join('')}</div>
    <div id="mpanel"></div>
    <div class="hr"></div>
    <div class="legend">${Object.entries(REL).map(([k, v]) => `<span><i style="border-color:${v.color}"></i>${v.label}</span>`).join('')}<span><i class="dash" style="border-color:var(--faint)"></i>inferred (not stated in handout)</span></div>
    <p class="tiny muted">Columns are classes 1–32; rows are definitions (top), theorems, examples. Scroll to zoom, drag to pan.</p>
  </div></div>`;
  const cy = cytoscape({
    container: $('#cy'), elements: els, layout: { name: 'preset' }, wheelSensitivity: 0.25, minZoom: 0.08, maxZoom: 2.5,
    style: [
      { selector: 'node', style: { 'background-color': 'data(c)', width: 14, height: 14, label: 'data(label)', 'font-size': 10, color: col('--ink'), 'text-valign': 'center', 'text-halign': 'right', 'text-margin-x': 4, 'text-background-color': col('--panel'), 'text-background-opacity': 0.7, 'text-background-padding': 1 } },
      { selector: 'edge', style: { width: 1.3, 'line-color': 'data(c)', 'target-arrow-color': 'data(c)', 'target-arrow-shape': 'triangle', 'arrow-scale': 0.7, 'curve-style': 'bezier', opacity: 0.55 } },
      { selector: 'edge[ev = "structurally_inferred"]', style: { 'line-style': 'dashed' } },
      { selector: '.dim', style: { opacity: 0.12 } },
      { selector: '.hi', style: { opacity: 1, width: 2.6, 'z-index': 9 } },
      { selector: 'node.hi', style: { width: 20, height: 20, 'font-weight': 700, 'border-width': 3, 'border-color': col('--accent') } },
      { selector: 'node.target', style: { width: 24, height: 24, 'border-width': 4, 'border-color': col('--bad') } },
      { selector: '.gone', style: { display: 'none' } },
    ],
  });
  const ancestorsByLevel = id => { const lv = [[id]], seen = new Set([id]);
    while (true) { const nx = []; lv[lv.length - 1].forEach(x => inEdges(x).filter(r => r.type === 'used_in' || r.type === 'prerequisite').forEach(r => { if (!seen.has(r.from)) { seen.add(r.from); nx.push(r.from); } })); if (!nx.length) break; lv.push(nx); }
    return lv; };
  const clear = () => cy.elements().removeClass('dim hi target gone');
  const focusNode = id => { clear(); const n = cy.getElementById(id); const nb = n.closedNeighborhood(); cy.elements().addClass('dim'); nb.removeClass('dim').addClass('hi'); cy.animate({ fit: { eles: nb, padding: 60 }, duration: 300 }); };
  const panel = $('#mpanel'); let mode = args[0] === 'focus' ? 'explore' : (args[0] || 'explore');
  const info = id => { const it = ITEMS[id];
    panel.innerHTML = `<h3 class="k-${it.kind}">${esc(iname(it))}</h3><p>${rich(it.gist || '')}</p><div class="stmt small">${it.statement}</div>
      <ul class="ex-list small">${inEdges(id).map(r => `<li>${ilink(r.from)} <span class="muted">${esc(REL[r.type].label)} this</span></li>`).join('')}${outEdges(id).map(r => `<li><span class="muted">${esc(REL[r.type].label)}</span> ${ilink(r.to)}</li>`).join('')}</ul>
      <div class="row"><a class="btn sm" href="#/learn/${it.cls}/${id}">Lecture</a>${it.proof_skeleton ? `<a class="btn sm" href="#/proof/${id}">Proof lab</a>` : ''}<button class="btn sm" id="tb">Trace back</button></div>`;
    typeset(panel); $('#tb', panel).onclick = () => setMode('trace', id); };
  function setMode(m, arg) {
    mode = m; $$('[data-m]', view).forEach(b => b.classList.toggle('on', b.dataset.m === m)); clear();
    if (m === 'explore') {
      panel.innerHTML = `<p class="small">Click a node to see its statement and connections. Filter classes:</p>
        <div class="row small"><label>from <input type="number" id="cf" min="1" max="32" value="1" style="width:4rem"></label><label>to <input type="number" id="ct" min="1" max="32" value="32" style="width:4rem"></label>
        <select id="th"><option value="">highlight a thread…</option>${D.threads.map(t => `<option value="${esc(t.id)}">${esc(t.title)}</option>`).join('')}</select></div>`;
      const filt = () => { const a = +$('#cf').value || 1, b = +$('#ct').value || 32; cy.nodes().forEach(n => n.toggleClass('gone', n.data('cls') < a || n.data('cls') > b)); };
      $('#cf').oninput = $('#ct').oninput = filt;
      $('#th').onchange = e => { clear(); const t = D.threads.find(x => x.id === e.target.value); if (!t) return; cy.elements().addClass('dim'); t.steps.forEach(s => cy.getElementById(s.ref).removeClass('dim').addClass('hi'));
        const ref = new Set(t.steps.map(s => s.ref)); cy.edges().filter(ed => ref.has(ed.data('source')) && ref.has(ed.data('target'))).removeClass('dim').addClass('hi'); };
      if (arg) { focusNode(arg); info(arg); }
    } else if (m === 'link') {
      const cov = new Set(covered());
      const cand = D.relations.filter(r => (r.type === 'used_in' || r.type === 'prerequisite') && cov.has(ITEMS[r.to].cls));
      if (!cand.length) { panel.innerHTML = '<p class="muted">No relations yet.</p>'; return; }
      const r = pick(cand), tgt = r.to, preds = new Set(inEdges(tgt).map(x => x.from));
      const pool = [...ids].filter(x => !preds.has(x) && x !== tgt && ITEMS[x].cls <= ITEMS[tgt].cls && ITEMS[x].kind !== 'Remark');
      const opts = shuffle([r.from, ...shuffle(pool).slice(0, 3)]);
      const e = cy.edges().filter(ed => ed.data('source') === r.from && ed.data('target') === tgt); e.addClass('gone');
      cy.elements().addClass('dim'); cy.getElementById(tgt).removeClass('dim').addClass('target'); opts.forEach(o => cy.getElementById(o).removeClass('dim'));
      cy.animate({ fit: { eles: cy.getElementById(tgt).union(cy.collection(opts.map(o => cy.getElementById(o)))), padding: 80 }, duration: 300 });
      panel.innerHTML = `<p class="small muted">One arrow into the red node is hidden.</p><h3>Which of these ${esc(REL[r.type].label === 'used to prove' ? 'is used to prove' : 'is needed to state')}</h3><p>${ilink(tgt)}?</p>
        <div class="choices">${opts.map(o => `<button class="choice" data-o="${o}">${esc(iname(ITEMS[o]))}<div class="small muted">${rich(ITEMS[o].gist || '')}</div></button>`).join('')}</div><div id="lr"></div>`;
      $$('[data-o]', panel).forEach(b => b.onclick = () => {
        $$('[data-o]', panel).forEach(x => { x.disabled = true; if (preds.has(x.dataset.o)) x.classList.add('right'); }); if (!preds.has(b.dataset.o)) b.classList.add('wrong');
        e.removeClass('gone dim').addClass('hi'); cy.getElementById(r.from).addClass('hi');
        $('#lr', panel).innerHTML = `<p class="${preds.has(b.dataset.o) ? 'ok' : 'no'}"><strong>${preds.has(b.dataset.o) ? 'Yes.' : 'No.'}</strong> ${ilink(r.from)} ${esc(REL[r.type].label)} ${ilink(tgt)}. ${rich(r.note || '')} <span class="tiny muted">${r.evidence === 'source_stated' ? '● handout' : '○ inferred'}</span></p><button class="btn primary" id="nx">Next</button>`;
        typeset(panel); $('#nx', panel).onclick = () => setMode('link');
      });
      typeset(panel);
    } else if (m === 'trace') {
      const tgt = arg || pick(Object.values(ITEMS).filter(it => ancestorsByLevel(it.id).length >= 4 && covered().includes(it.cls)).map(it => it.id)) || Object.keys(ITEMS)[0];
      const lv = ancestorsByLevel(tgt); let shown = 1;
      const draw = () => { clear(); cy.elements().addClass('dim'); const on = new Set(lv.slice(0, shown).flat());
        on.forEach(x => cy.getElementById(x).removeClass('dim').addClass('hi')); cy.getElementById(tgt).addClass('target');
        cy.edges().filter(ed => on.has(ed.data('source')) && on.has(ed.data('target')) && ['used_in', 'prerequisite'].includes(ed.data('type'))).removeClass('dim').addClass('hi');
        cy.animate({ fit: { eles: cy.collection([...on].map(x => cy.getElementById(x))), padding: 60 }, duration: 300 });
        panel.innerHTML = `<p class="small muted">The handout's suggested final-exam exercise: draw a theorem's dependency tree back toward Chapter 1. Name the ingredients yourself before each reveal.</p>
          <h3>${ilink(tgt)}</h3><textarea placeholder="What does it rest on? List what you can before revealing." style="min-height:4rem"></textarea>
          <div class="row" style="margin:.5rem 0"><button class="btn primary" id="st" ${shown >= lv.length ? 'disabled' : ''}>Reveal one level back (${shown - 1}/${lv.length - 1})</button><button class="btn" id="al">All</button><button class="btn" id="ot">Another theorem</button></div>
          ${lv.slice(1, shown).map((L, k) => `<div class="small"><strong>Level ${k + 1}</strong>: ${L.map(x => ilink(x, `${ITEMS[x].kind} ${ITEMS[x].num}`)).join(', ')}</div>`).join('')}
          ${shown >= lv.length ? `<p class="small muted">${lv.flat().length - 1} recorded ancestors. Missing links are possible: the map records only the main dependencies.</p>` : ''}`;
        typeset(panel);
        $('#st', panel).onclick = () => { shown++; draw(); }; $('#al', panel).onclick = () => { shown = lv.length; draw(); }; $('#ot', panel).onclick = () => setMode('trace');
      };
      draw();
    } else if (m === 'path') {
      const desc = id => { const s = new Set(), st = [id]; while (st.length) { const x = st.pop(); outEdges(x).filter(r => ['used_in', 'prerequisite', 'special_case_of'].includes(r.type)).forEach(r => { if (!s.has(r.to)) { s.add(r.to); st.push(r.to); } }); } return s; };
      const anc = id => new Set(ancestorsByLevel(id).flat().slice(1));
      const pairs = [];
      Object.keys(ITEMS).forEach(b => { if (!covered().includes(ITEMS[b].cls)) return; const lv = ancestorsByLevel(b); if (lv.length >= 4) lv.slice(3).flat().forEach(a => pairs.push([a, b])); });
      if (!pairs.length) { panel.innerHTML = '<p class="muted">Not enough recorded chains yet.</p>'; return; }
      const [A, B] = pick(pairs); const between = [...desc(A)].filter(x => anc(B).has(x));
      const off = shuffle([...ids].filter(x => !between.includes(x) && x !== A && x !== B && ITEMS[x].cls >= ITEMS[A].cls && ITEMS[x].cls <= ITEMS[B].cls && ITEMS[x].kind !== 'Remark')).slice(0, Math.max(3, 6 - Math.min(3, between.length)));
      const opts = shuffle([...shuffle(between).slice(0, 4), ...off]); const sel = new Set();
      cy.elements().addClass('dim'); [A, B].forEach(x => cy.getElementById(x).removeClass('dim').addClass('target'));
      panel.innerHTML = `<p class="small muted">From the first result to the second there is a recorded chain of dependencies.</p>
        <p><strong>From</strong> ${ilink(A)}<br><strong>to</strong> ${ilink(B)}</p><h3>Which of these lie on such a chain? (select all)</h3>
        <div class="choices">${opts.map(o => `<button class="choice" data-o="${o}">${esc(iname(ITEMS[o]))}</button>`).join('')}</div>
        <div class="row" style="margin-top:.5rem"><button class="btn primary" id="ck">Check</button><button class="btn" id="nx">Another pair</button></div><div id="pr"></div>`;
      $$('[data-o]', panel).forEach(b => b.onclick = () => { const o = b.dataset.o; sel.has(o) ? sel.delete(o) : sel.add(o); b.classList.toggle('step'); b.classList.toggle('placed'); });
      $('#nx', panel).onclick = () => setMode('path');
      $('#ck', panel).onclick = () => {
        const on = new Set(between); let right = 0;
        $$('[data-o]', panel).forEach(b => { const o = b.dataset.o; b.disabled = true; b.classList.remove('placed', 'step'); if (on.has(o)) b.classList.add('right'); if (sel.has(o) && !on.has(o)) b.classList.add('wrong'); if (sel.has(o) === on.has(o)) right++; });
        const all = new Set([A, B, ...between]); all.forEach(x => cy.getElementById(x).removeClass('dim').addClass('hi'));
        cy.edges().filter(ed => all.has(ed.data('source')) && all.has(ed.data('target'))).removeClass('dim').addClass('hi');
        cy.animate({ fit: { eles: cy.collection([...all].map(x => cy.getElementById(x))), padding: 50 }, duration: 300 });
        $('#pr', panel).innerHTML = `<p>${right}/${opts.length} options judged correctly. On the chain: ${between.map(x => ilink(x, `${ITEMS[x].kind} ${ITEMS[x].num}`)).join(', ') || 'only the endpoints'}.</p>`;
        typeset(panel);
      };
      typeset(panel);
    }
  }
  $$('[data-m]', view).forEach(b => b.onclick = () => setMode(b.dataset.m));
  cy.on('tap', 'node', e => { if (mode === 'explore') { focusNode(e.target.id()); info(e.target.id()); } else if (mode === 'trace') setMode('trace', e.target.id()); });
  cy.on('tap', e => { if (e.target === cy && mode === 'explore') clear(); });
  setMode(mode, args[0] === 'focus' ? args[1] : null);
  if (!(args[0] === 'focus')) { if (mode === 'explore') { const cov = latestCovered(); cy.fit(cy.nodes().filter(n => n.data('cls') <= cov), 30); } }
  cleanup = () => cy.destroy();
}

/* ---------- compare ---------- */
const cmpOpen = new Set();
function compare([id]) {
  const c = D.comparisons.find(x => x.id === id);
  if (!c) {
    view.innerHTML = `<h1>Side by side</h1><p class="muted">Notions that are easy to confuse, and places where Rudin and Ross take different routes. Each page starts with predictions; in Teach mode the table also opens row by row.</p>
      <div class="grid g3">${D.comparisons.map(x => `<a class="panel entry" href="#/compare/${x.id}"><h3>${rich(x.title)}</h3><p>${rich(x.question)}</p><p class="tiny" style="margin-top:.4rem">Classes ${(x.classes || []).join(', ')}</p></a>`).join('') || '<p class="muted">No comparison pages yet.</p>'}</div>`;
    return;
  }
  const teach = S.mode === 'teach';
  view.innerHTML = `<a href="#/compare" class="small">← all comparisons</a><h1>${rich(c.title)}</h1><p class="big" style="font-family:var(--serif);font-size:1.1rem">${rich(c.question)}</p>
    <div id="preds">${(c.predict || []).map((p, i) => predictBox(`cmp-${c.id}-${i}`, p)).join('')}</div>
    <div class="panel tablewrap"><table class="cmp"><thead><tr><th></th>${c.sides.map(s => `<th>${rich(s.name)}<div class="tiny">${(s.refs || []).map(r => ilink(r, ITEMS[r] ? `${ITEMS[r].kind} ${ITEMS[r].num}` : r)).join(', ')}</div></th>`).join('')}</tr></thead>
      <tbody>${c.rows.map((r, i) => `<tr class="${teach && !cmpOpen.has(c.id + i) ? 'hidden' : ''}" data-r="${i}"><td class="aspect">${rich(r.aspect)}</td>${r.cells.map(x => `<td class="cell">${rich(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>
      ${teach ? '<p class="tiny muted">Click a hatched row to reveal it — say what you expect first.</p>' : ''}</div>
    <div class="panel" style="margin-top:1rem">${srcTag(false, 'Separating example')}${revealed.has('sep-' + c.id) || !teach ? `<p class="stmt">${rich(c.separating_example)}</p>` : '<button class="btn sm primary" id="sep">Reveal the separating example</button>'}</div>`;
  $$('#preds [data-reveal]', view).forEach(b => b.onclick = () => { revealed.add(b.closest('.predict').dataset.key); render(); });
  $$('tr.hidden', view).forEach(tr => tr.onclick = () => { cmpOpen.add(c.id + tr.dataset.r); tr.classList.remove('hidden'); });
  const sp = $('#sep', view); if (sp) sp.onclick = () => { revealed.add('sep-' + c.id); render(); };
}

/* ---------- threads (lineages) ---------- */
function threads() {
  const hide = S.mode === 'teach';
  view.innerHTML = `<h1>Threads</h1><p class="muted">Remark 32.1 of the handout: every substantive theorem leans on completeness, compactness or uniformity. Each track follows one pillar through the course, left to right.
    ${hide ? 'Notes are hidden: say how each step passes the pillar on, then click the card.' : ''}</p>
    ${D.threads.map(t => `<div class="thread"><h2>${rich(t.title)}</h2><p>${rich(t.summary)}</p><div class="track">${t.steps.map((s, i) => { const it = ITEMS[s.ref];
      return `<div class="tstep"><div class="dot"></div><div class="card" data-k="${esc(t.id)}-${i}"><div class="c">Class ${it ? it.cls : '?'} · ${it ? esc(it.kind + ' ' + it.num) : esc(s.ref)}</div>
      <div>${it ? rich(it.gist || shortLabel(it)) : ''}</div><div class="small muted note-t" ${hide ? 'hidden' : ''}>${rich(s.note)}</div><div class="tiny" ${hide ? 'hidden' : ''}>${ilink(s.ref, 'open')}</div></div></div>`; }).join('')}</div></div>`).join('') || '<p class="muted">No threads yet.</p>'}`;
  $$('.tstep .card', view).forEach(cd => cd.onclick = e => { if (e.target.closest('a')) return; $$('[hidden]', cd).forEach(x => x.hidden = false); });
}

/* ---------- museum ---------- */
function museum([mode]) {
  const M = D.museum;
  if (mode === 'match') {
    const ex = pick(M), opts = shuffle([ex, ...shuffle(M.filter(m => m !== ex)).slice(0, 3)]);
    view.innerHTML = `<a href="#/museum" class="small">← museum</a><h1>Which exhibit closes this door?</h1>
      <div class="panel qcard"><p class="small muted">False statement / tempting belief refuted:</p><p class="qprompt">${rich(ex.closes)}</p>
      <div class="choices">${opts.map(o => `<button class="choice" data-o="${esc(o.id)}"><strong>${rich(o.name)}</strong><div class="small muted">${rich(o.object)}</div></button>`).join('')}</div><div id="mr"></div></div>`;
    $$('[data-o]', view).forEach(b => b.onclick = () => { $$('[data-o]', view).forEach(x => { x.disabled = true; if (x.dataset.o === ex.id) x.classList.add('right'); }); if (b.dataset.o !== ex.id) b.classList.add('wrong');
      $('#mr').innerHTML = `<p class="small" style="margin-top:.6rem">${(ex.refs || []).map(r => ilink(r)).join(' · ')}</p><button class="btn primary" id="nx">Next</button>`; typeset($('#mr')); $('#nx').onclick = () => render(); });
    return;
  }
  const hide = S.mode === 'teach' || mode === 'quiz';
  view.innerHTML = `<div class="spread"><div><h1>Counterexample museum</h1><p class="muted">Remark 32.3: “the examples worth carrying out of this course, one per door they close.” ${hide ? 'Labels are covered: name the false statement each exhibit refutes, then reveal.' : ''}</p></div>
    <div class="row"><a class="btn" href="#/museum/match">Match game</a>${hide ? '<button class="btn" id="ra">Reveal all</button>' : '<a class="btn" href="#/museum/quiz">Cover the labels</a>'}</div></div>
    <div class="grid g3">${M.map(m => `<div class="panel exhibit"><h3>${rich(m.name)}</h3><div class="obj">${rich(m.object)}</div>
      <div class="closes">${srcTag(false, 'Closes the door on')}<div class="cl" ${hide ? 'hidden' : ''}>${rich(m.closes)}</div>${hide ? '<button class="btn sm" data-show>Reveal</button>' : ''}
      <div class="tiny" style="margin-top:.4rem">${(m.refs || []).map(r => ilink(r, ITEMS[r] ? `${ITEMS[r].kind} ${ITEMS[r].num}` : r)).join(' · ')}</div></div></div>`).join('') || '<p class="muted">No exhibits yet.</p>'}</div>`;
  $$('[data-show]', view).forEach(b => b.onclick = () => { b.previousElementSibling.hidden = false; b.remove(); });
  const ra = $('#ra', view); if (ra) ra.onclick = () => $$('[data-show]', view).forEach(b => b.click());
}

/* ---------- labs ---------- */
function labs([id]) {
  const L = window.M104Labs;
  if (!L) { view.innerHTML = '<p class="muted">Labs did not load.</p>'; return; }
  const lab = L.list.find(x => x.id === id);
  if (!lab) {
    view.innerHTML = `<h1>Parameter labs</h1><p class="muted">Each lab turns one definition or theorem into something you can drag. Every lab has a “try this” list: predict, then move the slider.</p>
      <div class="grid g3">${L.list.map(x => `<a class="panel entry" href="#/labs/${x.id}"><h3>${rich(x.title)}</h3><p>${rich(x.blurb)}</p><p class="tiny" style="margin-top:.4rem">${x.refs.map(r => ITEMS[r] ? `${ITEMS[r].kind} ${ITEMS[r].num}` : r).join(' · ')}</p></a>`).join('')}</div>`;
    return;
  }
  view.innerHTML = `<a href="#/labs" class="small">← all labs</a><h1>${rich(lab.title)}</h1><p class="muted">${rich(lab.blurb)} ${lab.refs.map(r => ilink(r, ITEMS[r] ? `${ITEMS[r].kind} ${ITEMS[r].num}` : r)).join(' · ')}</p>
    <div class="lab"><canvas class="plot" id="plot"></canvas><div class="ctrl" id="ctrl"></div></div>
    <div class="panel" style="margin-top:1rem"><h3>Try this</h3><ol class="tryit">${lab.tries.map(t => `<li>${rich(t)}</li>`).join('')}</ol></div>`;
  cleanup = lab.mount($('#plot'), $('#ctrl'), { typeset, rich });
}

/* ---------- explain in your own words ---------- */
let aiState = null;
function explain([id]) {
  const it = ITEMS[id];
  if (!it) { location.hash = '#/learn'; return; }
  const draft = S.explain[id] || '';
  view.innerHTML = `<a href="#/learn/${it.cls}/${id}" class="small">← back to the lecture</a>
    <h1>Explain: <span class="k-${it.kind}">${esc(iname(it))}</span></h1>
    <p class="muted">Without looking, write the statement (all hypotheses), why it is true, and where each hypothesis is used. Then compare.</p>
    <textarea id="ex" style="min-height:12rem" placeholder="In my own words…">${esc(draft)}</textarea>
    <div class="row" style="margin-top:.6rem"><button class="btn primary" id="ai" hidden disabled>Check with the workstation model</button><button class="btn" id="self">Self-check against the notes</button><span class="small muted" id="aist">checking whether the model is reachable…</span></div>
    <div id="fb"></div>`;
  const ta = $('#ex'); ta.oninput = () => { S.explain[id] = ta.value; save(); };
  const st = $('#aist'), btn = $('#ai');
  const setAI = ok => { aiState = ok; btn.disabled = !ok; st.textContent = ok ? 'local model available (runs on the workstation; nothing leaves it)' : (D.publicEdition ? 'Self-check is available on this public edition' : location.protocol === 'file:' ? 'opened from disk: the model check needs the workstation server' : 'model gateway not reachable right now'); };
  if (aiState !== null) setAI(aiState);
  if (!D.publicEdition && location.protocol.startsWith('http')) fetch('api/health').then(r => r.json()).then(j => setAI(!!j.ai)).catch(() => setAI(false)); else setAI(false);
  btn.onclick = async () => {
    if (ta.value.trim().length < 20) { $('#fb').innerHTML = '<p class="no">Write a little more first.</p>'; return; }
    btn.disabled = true; $('#fb').innerHTML = '<p class="muted">Asking the model… the first request can take a few minutes while it loads.</p>';
    try {
      const r = await fetch('api/explain', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, text: ta.value }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || r.status);
      const L = (t, a, cls) => a && a.length ? `<h3 class="${cls || ''}">${t}</h3><ul>${a.map(x => `<li>${rich(x)}</li>`).join('')}</ul>` : '';
      $('#fb').innerHTML = `<div class="panel feedback" style="margin-top:1rem">${srcTag(false, `Model feedback (${esc(j.model)}, ${j.seconds}s) — may be wrong; the notes are the reference`)}
        ${L('Got right', j.covered, 'ok')}${L('Missing', j.missing, 'no')}${L('Wrong or imprecise', j.errors, 'no')}${j.advice ? `<p>${rich(j.advice)}</p>` : ''}</div>`;
      typeset($('#fb'));
    } catch (e) { $('#fb').innerHTML = `<p class="no">The model check failed: ${esc(e.message)}. Use the self-check instead.</p>`; }
    btn.disabled = false;
  };
  $('#self').onclick = () => {
    const pts = [...(it.hypotheses || []).map(x => 'Hypothesis: ' + x), ...(it.conclusion ? ['Conclusion: ' + it.conclusion] : []), ...(it.proof_skeleton || []).map((s, i) => `Step ${i + 1}: ` + s.step), ...(it.pitfalls || []).map(x => 'Avoided: ' + x)];
    $('#fb').innerHTML = `<div class="panel" style="margin-top:1rem">${srcTag(false, 'Study statement')}<div class="stmt">${it.statement}</div>${it.proof ? srcTag(true, 'Handout proof idea') + `<div class="stmt">${it.proof}</div>` : ''}
      ${pts.length ? srcTag(false, 'Tick what your explanation covered') + `<div class="checklist">${pts.map(p => `<label><input type="checkbox"> <span>${rich(p)}</span></label>`).join('')}</div>` : ''}
      ${it.intuition ? srcTag(false, 'Intuition') + `<p>${rich(it.intuition)}</p>` : ''}</div>`;
    typeset($('#fb'));
  };
}

/* ---------- progress ---------- */
function progress() {
  const cov = covered(), seenQ = Object.keys(S.q).filter(k => Q[k]);
  const days = new Set(S.log.map(l => new Date(l.t).toDateString()));
  let streak = 0; for (let d = new Date(); days.has(d.toDateString()); d.setDate(d.getDate() - 1)) streak++;
  const lv = LEVELS.map(l => { const qs = D.questions.filter(q => q.level === l && cov.includes(q.cls)); return [l, mean(qs.map(q => qm(q.id))), qs.length]; });
  const weakItems = Object.keys(ITEMS).map(id => [id, itemM(id), qOfItem(id).filter(q => S.q[q.id]).length]).filter(x => x[1] != null && x[2] > 0).sort((a, b) => a[1] - b[1]).slice(0, 12);
  const proofs = Object.values(ITEMS).filter(it => it.proof_skeleton && it.proof_skeleton.length >= 2);
  const paths = Object.entries(PROOF_PATHS).flatMap(([id, routes]) => routes.map(route => proofPathCounts(id, route)));
  view.innerHTML = `<h1>Progress</h1>
    <div class="grid g2"><div class="panel"><h3>Mastery by class</h3>${heatGrid()}
      <div class="stats"><div><div class="stat">${seenQ.length}</div><div class="stat-l">questions seen of ${D.questions.length}</div></div>
      <div><div class="stat">${S.log.length}</div><div class="stat-l">answers logged</div></div><div><div class="stat">${streak}</div><div class="stat-l">day streak</div></div>
      <div><div class="stat">${proofs.filter(p => (S.proof[p.id] || {}).order).length}/${proofs.length}</div><div class="stat-l">classic proofs ordered</div></div></div><p class="small"><a href="#/proof">Layered proofs</a> · ${paths.filter(p => p.skeleton).length}/${paths.length} skeletons · ${paths.reduce((n, p) => n + p.mastered, 0)}/${paths.reduce((n, p) => n + p.total, 0)} details marked Got it</p></div>
    <div class="panel"><h3>By level (covered classes)</h3>${lv.map(([l, m, n]) => `<div class="spread small" style="margin-top:.5rem"><span><strong>${l}</strong> <span class="muted">${LEVEL_DESC[l]} · ${n} q</span></span><span>${Math.round(m * 100)}%</span></div><div class="bar"><i style="width:${m * 100}%"></i></div>`).join('')}</div></div>
    <div class="grid g2" style="margin-top:1rem"><div class="panel"><h3>Weakest items you have practised</h3>${weakItems.length ? `<ul class="ex-list">${weakItems.map(([id, m]) => `<li>${ilink(id)} <span class="muted small">${Math.round(m * 100)}%</span></li>`).join('')}</ul><a class="btn sm" href="#/practice/weak">Practise these</a>` : '<p class="muted">Nothing practised yet.</p>'}</div>
    <div class="panel"><h3>Your data</h3><p class="small muted">Progress is stored only in this browser (${location.protocol === 'file:' ? 'the copy opened from disk' : esc(location.host)}). The workstation page and a copy opened from disk keep separate progress — move it with export / import.</p>
      <div class="row"><button class="btn" id="exp">Export progress</button><label class="btn">Import<input type="file" id="imp" accept=".json" hidden></label><button class="btn" id="rst">Reset</button></div><div id="pm" class="small"></div></div></div>`;
  $('#exp').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = `math104-progress-${todayISO()}.json`; a.click(); };
  $('#imp').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { const o = JSON.parse(t); if (!o.q) throw new Error('not a progress file');
    // merge: keep the more-practised record per question
    Object.entries(o.q).forEach(([k, v]) => { if (!S.q[k] || (v.seen || 0) > (S.q[k].seen || 0)) S.q[k] = v; });
    mergeProofProgress(o.proof); S.log = [...S.log, ...(o.log || [])].sort((a, b) => a.t - b.t); save(); render(); }).catch(err => { $('#pm').textContent = 'Import failed: ' + err.message; }); };
  $('#rst').onclick = () => { if (confirm('Erase all progress stored in this browser? Export first if you want to keep it.')) { const keep = { mode: S.mode, theme: S.theme }; S = Object.assign(blank(), keep); save(); render(); } };
}


/* ---------- theorem, concept and homework references ---------- */
function referenceLinks(refs) {
  return (refs || '').split(',').filter(Boolean).map(id => ilink(id)).join(' · ');
}
function referenceResultLink(title) {
  return `<a href="#/theorems/${encodeURIComponent(title)}">${rich(title)}</a>`;
}
function theoremRows() {
  const results = REFERENCE.proofs;
  const handout = Object.values(ITEMS).filter(item => ['Theorem', 'Corollary', 'Lemma', 'Proposition'].includes(item.kind));
  const rows = handout.map(item => {
    const added = results.find(p => p.ref === item.id);
    return {
      source: `Handout ${item.num}${item.label ? ' · ' + item.label : ''}`,
      title: added?.title || REFERENCE.aliases[item.id] || shortLabel(item) || `${item.kind} ${item.num}`,
      statement: item.statement, gist: item.gist, html: true, ref: item.id, proof: added?.proof, scope: 'handout',
    };
  });
  results.filter(p => !handout.some(i => i.id === p.ref)).forEach(p => rows.push({ ...p, scope: 'supplement' }));
  return rows;
}
function searchText(value) {
  return texPlain(value).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[’']/g, '').replace(/[–—−-]/g, ' ');
}
function indexedLocators(source) {
  return source.replace(/(\d+)\.(\d+)[–—-](?:(\d+)\.)?(\d+)\b/g, (range, chapter, first, lastChapter, last) => {
    if (lastChapter && lastChapter !== chapter) return range;
    const end = Number(last), start = Number(first);
    if (end < start || end - start > 50) return range;
    return range + ' ' + Array.from({ length: end - start + 1 }, (_, i) => chapter + '.' + (start + i)).join(' ');
  });
}
function referenceSearch({ title, intro, placeholder, rows, groups, initial, filter, cards }) {
  view.innerHTML = `<h1>${title}</h1><p class="muted">${intro}</p>
    <div class="row reference-controls">
      <label>Search <input type="search" id="reference-search" placeholder="${placeholder}"></label>
      <label>Show <select id="reference-group">${groups.map(([v, label]) => `<option value="${esc(v)}">${esc(label)}</option>`).join('')}</select></label>
    </div><p class="small muted" id="reference-count" role="status"></p><div id="reference-results"></div>`;
  const search = $('#reference-search'), group = $('#reference-group'), results = $('#reference-results');
  search.value = initial || '';
  const update = () => {
    const query = searchText(search.value).split(/\s+/).filter(Boolean);
    const matching = rows.filter(row => (!group.value || filter(row) === group.value)
      && query.every(token => row.search.includes(token)));
    $('#reference-count').textContent = `${matching.length} of ${rows.length} entries`;
    results.innerHTML = matching.length ? cards(matching, !!query.length) : '<p>No matching entries.</p>';
    typeset(results);
  };
  search.addEventListener('input', update);
  group.addEventListener('change', update);
  update();
}
function theoremIndex([query]) {
  const rows = theoremRows().map(row => ({ ...row, search: searchText([
    row.title, indexedLocators(row.source), row.gist, row.ref, row.statement.replace(/<[^>]*>/g, ' '),
  ].join(' ')) }));
  const exact = rows.find(row => row.title === query);
  referenceSearch({
    title: 'Theorem Index',
    intro: 'Find theorems, corollaries, and homework results by name or source number. Each source keeps its original numbering.',
    placeholder: 'Rudin 6.27, Rolle, HW6',
    rows, groups: [['', 'All results'], ['handout', 'Numbered course results'], ['supplement', 'Textbook and homework supplements']],
    initial: query, filter: row => row.scope,
    cards: (matching, searched) => matching.map(row => {
      const it = ITEMS[row.ref];
      return `<details class="panel reference-entry"${(searched && matching.length === 1) || (searched && exact === row) ? ' open' : ''}>
        <summary><strong>${rich(row.title)}</strong><span class="small muted">${rich(row.source)}</span></summary>
        ${row.gist ? `<p>${rich(row.gist)}</p>` : ''}
        <div class="stmt">${row.html ? row.statement : rich(row.statement)}</div>
        <div class="row reference-links">
          ${it ? ilink(row.ref, `Open in Learn · ${it.kind} ${it.num}`) : ''}
          ${it?.proof_skeleton?.length >= 2 ? `<a href="#/proof/${esc(it.id)}">Open in Proof Lab</a>` : ''}
        </div>
        ${row.proof ? `<details class="reference-proof"><summary>Proof · review aid</summary><p>${rich(row.proof)}</p></details>` : ''}
      </details>`;
    }).join(''),
  });
}
function conceptList([query]) {
  const rows = REFERENCE.concepts.map(row => ({ ...row, search: searchText(Object.values(row).join(' ')) }));
  referenceSearch({
    title: 'Concept List',
    intro: 'Start with a definition, see how it is used in Math 104, then follow it into later courses.',
    placeholder: 'compactness, measure theory, topology',
    rows, groups: [['', 'All topics'], ...[...new Set(rows.map(row => row.group))].map(g => [g, g])],
    initial: query, filter: row => row.group,
    cards: (matching, searched) => matching.map(row => `<details class="panel reference-entry"${searched && matching.length === 1 ? ' open' : ''}>
      <summary><strong>${esc(row.title)}</strong><span class="small muted">${esc(row.group)} · ${esc(row.scope)}</span></summary>
      <dl class="reference-concept"><dt>Definition</dt><dd>${rich(row.definition)}</dd>
      <dt>In Math 104</dt><dd>${rich(row.course)}</dd>
      <dt>In later courses</dt><dd>${rich(row.later)}</dd></dl>
      <div class="small reference-links">${referenceLinks(row.refs)}</div>
    </details>`).join(''),
  });
}
function homeworkIndex([selected]) {
  const assignments = [...new Set(REFERENCE.homeworks.map(row => row.hw))];
  view.innerHTML = `<h1>Homework</h1><p class="muted">Find related lecture results, problem-solving methods, and supplemental proofs by textbook exercise number.</p>
    <nav class="row reference-jumps" aria-label="Homework assignments">${assignments.map(hw => `<a class="btn sm${hw === selected ? ' primary' : ''}" href="#/homework/${hw}">${hw}</a>`).join('')}
      ${selected ? '<a href="#/homework">All assignments</a>' : ''}</nav>
    ${assignments.filter(hw => !assignments.includes(selected) || hw === selected).map(hw => `
      <section class="homework-section"><h2>${hw}</h2>${REFERENCE.homeworks.filter(row => row.hw === hw).map(row => `
        <article class="panel reference-entry"><h3>${esc(row.source)}</h3><p>${rich(row.method)}</p>
        <div class="small reference-links">${referenceLinks(row.refs)}</div>
        ${row.results ? `<ul class="ex-list small">${row.results.split('|').map(title => `<li>${referenceResultLink(title)}</li>`).join('')}</ul>` : ''}
        </article>`).join('')}</section>`).join('')}`;
}


const ROUTES = { '': home, learn, practice, proof, map: mapView, compare, threads, museum, labs, explain, progress, theorems: theoremIndex, concepts: conceptList, homework: homeworkIndex };
window.M104App = { typeset, rich, esc, ITEMS };
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(); $$('.mode button').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
  window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
  render();
});
})();
