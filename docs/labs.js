/* Parameter labs: small canvas experiments, one per definition or theorem. Numerics illustrate; they prove nothing. */
(() => {
'use strict';
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

function Plot(cv) {
  const ctx = cv.getContext('2d'); const P = { x0: 0, x1: 1, y0: 0, y1: 1, pad: 34 };
  P.size = () => { const r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1; cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); P.w = r.width; P.h = r.height; };
  P.set = (x0, x1, y0, y1, box) => Object.assign(P, { x0, x1, y0, y1, box: box || [P.pad, 8, P.w - 10, P.h - P.pad + 8] });
  P.X = x => P.box[0] + (x - P.x0) / (P.x1 - P.x0) * (P.box[2] - P.box[0]);
  P.Y = y => P.box[3] - (y - P.y0) / (P.y1 - P.y0) * (P.box[3] - P.box[1] - 8) - 0;
  P.clear = () => { ctx.clearRect(0, 0, P.w, P.h); };
  P.axes = (opts = {}) => {
    ctx.save(); ctx.strokeStyle = css('--line2'); ctx.fillStyle = css('--faint'); ctx.font = '11px system-ui'; ctx.lineWidth = 1;
    const tick = (a, b) => { const s = Math.pow(10, Math.floor(Math.log10((b - a) / 4))); const m = (b - a) / s > 20 ? 5 : (b - a) / s > 8 ? 2 : 1; return s * m; };
    const tx = tick(P.x0, P.x1), ty = tick(P.y0, P.y1);
    for (let x = Math.ceil(P.x0 / tx) * tx; x <= P.x1 + 1e-9; x += tx) { const X = P.X(x); ctx.globalAlpha = .35; ctx.beginPath(); ctx.moveTo(X, P.box[1]); ctx.lineTo(X, P.box[3]); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillText(+x.toPrecision(4), X - 8, P.box[3] + 14); }
    for (let y = Math.ceil(P.y0 / ty) * ty; y <= P.y1 + 1e-9; y += ty) { const Y = P.Y(y); ctx.globalAlpha = .35; ctx.beginPath(); ctx.moveTo(P.box[0], Y); ctx.lineTo(P.box[2], Y); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillText(+y.toPrecision(4), 2, Y + 4); }
    ctx.strokeStyle = css('--muted'); ctx.globalAlpha = .7;
    if (P.y0 < 0 && P.y1 > 0) { ctx.beginPath(); ctx.moveTo(P.box[0], P.Y(0)); ctx.lineTo(P.box[2], P.Y(0)); ctx.stroke(); }
    if (P.x0 < 0 && P.x1 > 0) { ctx.beginPath(); ctx.moveTo(P.X(0), P.box[1]); ctx.lineTo(P.X(0), P.box[3]); ctx.stroke(); }
    if (opts.label) { ctx.globalAlpha = 1; ctx.fillStyle = css('--muted'); ctx.fillText(opts.label, P.box[0] + 4, P.box[1] + 12); }
    ctx.restore();
  };
  P.fn = (f, color, width = 2, a = P.x0, b = P.x1, n = 800) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); let pen = false;
    for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, y = f(x);
      if (!isFinite(y) || y > P.y1 + 10 * (P.y1 - P.y0) || y < P.y0 - 10 * (P.y1 - P.y0)) { pen = false; continue; }
      const X = P.X(x), Y = P.Y(Math.max(P.y0 - (P.y1 - P.y0), Math.min(P.y1 + (P.y1 - P.y0), y)));
      pen ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); pen = true; }
    ctx.stroke(); ctx.restore();
  };
  P.poly = (pts, color, width = 1.5) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y))); ctx.stroke(); ctx.restore(); };
  P.dot = (x, y, color, r = 2.6) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), r, 0, 7); ctx.fill(); };
  P.band = (lo, hi, color, a = P.x0, b = P.x1) => { ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = .18; ctx.beginPath();
    const n = 300; for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; ctx.lineTo(P.X(x), P.Y(hi(x))); }
    for (let i = n; i >= 0; i--) { const x = a + (b - a) * i / n; ctx.lineTo(P.X(x), P.Y(lo(x))); } ctx.closePath(); ctx.fill(); ctx.restore(); };
  P.rect = (x0, y0, x1, y1, color, alpha = .2, stroke) => { ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = alpha; const X0 = P.X(x0), Y0 = P.Y(y0), X1 = P.X(x1), Y1 = P.Y(y1);
    ctx.fillRect(Math.min(X0, X1), Math.min(Y0, Y1), Math.abs(X1 - X0), Math.abs(Y1 - Y0)); if (stroke) { ctx.globalAlpha = .8; ctx.strokeStyle = stroke; ctx.strokeRect(Math.min(X0, X1), Math.min(Y0, Y1), Math.abs(X1 - X0), Math.abs(Y1 - Y0)); } ctx.restore(); };
  P.vline = (x, color, dash) => { ctx.save(); ctx.strokeStyle = color; ctx.setLineDash(dash ? [5, 4] : []); ctx.beginPath(); ctx.moveTo(P.X(x), P.box[1]); ctx.lineTo(P.X(x), P.box[3]); ctx.stroke(); ctx.restore(); };
  P.hline = (y, color, dash) => { ctx.save(); ctx.strokeStyle = color; ctx.setLineDash(dash ? [5, 4] : []); ctx.beginPath(); ctx.moveTo(P.box[0], P.Y(y)); ctx.lineTo(P.box[2], P.Y(y)); ctx.stroke(); ctx.restore(); };
  P.text = (s, x, y, color) => { ctx.save(); ctx.fillStyle = color || css('--muted'); ctx.font = '12px system-ui'; ctx.fillText(s, x, y); ctx.restore(); };
  P.ctx = ctx; return P;
}

// controls: spec = [{k, type:'range'|'select'|'check'|'button', label, min, max, step, value, options:[[v,label]]}]
function controls(el, spec, onchange, extra) {
  el.innerHTML = spec.map(s => s.type === 'select' ? `<label>${s.label}<select data-k="${s.k}">${s.options.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>`
    : s.type === 'check' ? `<label style="flex-direction:row;align-items:center;gap:.4rem"><input type="checkbox" data-k="${s.k}" ${s.value ? 'checked' : ''}>${s.label}</label>`
    : s.type === 'button' ? `<button class="btn" data-b="${s.k}">${s.label}</button>`
    : `<label>${s.label} <span data-v="${s.k}"></span><input type="range" data-k="${s.k}" min="${s.min}" max="${s.max}" step="${s.step || 1}" value="${s.value}"></label>`).join('') + `<div class="readout" id="ro"></div>` + (extra || '');
  const st = {}; spec.forEach(s => { if (s.type !== 'button') st[s.k] = s.type === 'select' ? s.options[0][0] : s.type === 'check' ? !!s.value : +s.value; });
  el.querySelectorAll('[data-k]').forEach(i => i.addEventListener('input', () => { const s = spec.find(x => x.k === i.dataset.k); st[s.k] = s.type === 'select' ? i.value : s.type === 'check' ? i.checked : +i.value; onchange(st); }));
  el.querySelectorAll('[data-b]').forEach(b => b.addEventListener('click', () => onchange(st, b.dataset.b)));
  const show = (k, txt) => { const v = el.querySelector(`[data-v="${k}"]`); if (v) v.textContent = txt; };
  return { st, show, ro: el.querySelector('#ro') };
}
function standard(canvas, ctrl, spec, draw) {
  const P = Plot(canvas); let C;
  const redraw = (st, btn) => { P.size(); draw(P, st, C, btn); };
  C = controls(ctrl, spec, redraw);
  const ro = new ResizeObserver(() => redraw(C.st)); ro.observe(canvas);
  const mq = matchMedia('(prefers-color-scheme: dark)'); const onT = () => redraw(C.st); mq.addEventListener('change', onT);
  redraw(C.st);
  return () => { ro.disconnect(); mq.removeEventListener('change', onT); };
}
const fmt = (x, d = 4) => (Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0)) ? x.toExponential(2) : (+x.toFixed(d)).toString();
const logv = (v, lo, hi) => Math.pow(10, lo + (hi - lo) * v / 100);

/* 1. epsilon-N */
const SEQ = {
  inv: { name: '1/n', f: n => 1 / n, L: 0 }, alt: { name: '(−1)ⁿ/n', f: n => (n % 2 ? -1 : 1) / n, L: 0 },
  frac: { name: 'n/(n+1)', f: n => n / (n + 1), L: 1 }, sinr: { name: 'sin(n)/√n', f: n => Math.sin(n) / Math.sqrt(n), L: 0 },
  e: { name: '(1+1/n)ⁿ', f: n => Math.pow(1 + 1 / n, n), L: Math.E }, root: { name: 'n^(1/n)', f: n => Math.pow(n, 1 / n), L: 1 },
  osc: { name: '(−1)ⁿ (diverges)', f: n => n % 2 ? -1 : 1, L: null },
};
const epsN = { id: 'epsilon-n', title: 'ε–N: what convergence asks for', refs: ['def-7.1', 'the-7.2'],
  blurb: 'Pick ε. The definition demands one index N after which every term stays inside the band (L−ε, L+ε).',
  tries: ['For 1/n, halve ε repeatedly. How does N grow? Compare with the Archimedean property (Theorem 2.1).', 'For sin(n)/√n, the first N is erratic: some later terms come back near the edge. Why must N work for <em>all</em> n ≥ N, not just one?', 'For (−1)ⁿ, move the candidate limit L. Which ε defeats every L? (Any ε ≤ 1.)', 'n^(1/n) converges to 1 slowly: estimate N for ε = 0.01 before looking.'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 's', type: 'select', label: 'Sequence', options: Object.entries(SEQ).map(([k, v]) => [k, v.name]) },
    { k: 'e', label: 'ε (log scale)', min: 0, max: 100, value: 60 },
    { k: 'L', label: 'candidate limit L (for the divergent one)', min: -150, max: 150, value: 0 }],
    (P, st, C) => {
      const S = SEQ[st.s], eps = logv(st.e, -3, 0), L = S.L == null ? st.L / 100 : S.L; C.show('e', '= ' + fmt(eps)); C.show('L', S.L == null ? '= ' + fmt(L, 2) : '(fixed: ' + fmt(L) + ')');
      const H = 20000; let N = 1; for (let n = 1; n <= H; n++) if (Math.abs(S.f(n) - L) >= eps) N = n + 1;
      const fails = N > H - 100;
      const nmax = Math.min(2000, Math.max(40, Math.ceil((fails ? 60 : N) * 1.6)));
      let lo = L - 2 * eps, hi = L + 2 * eps; for (let n = 1; n <= nmax; n++) { const v = S.f(n); lo = Math.min(lo, v); hi = Math.max(hi, v); }
      P.set(0, nmax + 1, lo - .05 * (hi - lo), hi + .05 * (hi - lo)); P.clear(); P.axes({ label: 'aₙ against n' });
      P.band(() => L - eps, () => L + eps, css('--accent')); P.hline(L, css('--accent'), true);
      if (!fails) P.vline(N, css('--good'), true);
      const step = Math.max(1, Math.floor(nmax / 600));
      for (let n = 1; n <= nmax; n += step) { const v = S.f(n); P.dot(n, v, Math.abs(v - L) < eps ? css('--ink') : css('--bad'), nmax > 300 ? 1.6 : 2.6); }
      C.ro.textContent = fails ? `No N up to n = ${H}: terms keep leaving the band.\n${S.L == null ? 'This sequence has no limit: for ε ≤ 1 no L works.' : ''}`
        : `ε = ${fmt(eps)}\nsmallest N with |aₙ − L| < ε for all n ≥ N (checked to n = ${H}):\nN = ${N}\nred = terms outside the band`;
    }) };

/* 2. lim sup / lim inf */
const SEQ2 = {
  a: { name: '(−1)ⁿ(1 + 1/n)', f: n => (n % 2 ? -1 : 1) * (1 + 1 / n) }, b: { name: 'sin n', f: n => Math.sin(n) },
  c: { name: '(−1)ⁿ + 1/n', f: n => (n % 2 ? -1 : 1) + 1 / n }, d: { name: 'n mod 3 pattern + 1/n', f: n => (n % 3) - 1 + 2 / n },
  e: { name: '(−1)ⁿ n/(n+1) · (1 + (−1)ⁿ)/2', f: n => n % 2 ? 0 : n / (n + 1) },
};
const limsup = { id: 'limsup', title: 'lim sup and lim inf as tail envelopes', refs: ['def-9.1', 'the-9.2'],
  blurb: 'sₙ = sup over the tail k ≥ n is non-increasing; its limit is lim sup. The same for inf from below.',
  tries: ['Why can the tail sup only go down as n grows?', 'For sin n, both envelopes stay near ±1. Which theorem guarantees subsequences converging to lim sup and lim inf?', 'Find a sequence here whose sup is not its lim sup.', 'When do the two envelopes meet? (Exactly when the sequence converges.)'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 's', type: 'select', label: 'Sequence', options: Object.entries(SEQ2).map(([k, v]) => [k, v.name]) },
    { k: 'n', label: 'show the tail from n =', min: 1, max: 150, value: 20 }],
    (P, st, C) => {
      const f = SEQ2[st.s].f, H = 4000, M = 200; C.show('n', st.n);
      const sup = new Array(H + 2).fill(-Infinity), inf = new Array(H + 2).fill(Infinity);
      for (let n = H; n >= 1; n--) { sup[n] = Math.max(f(n), sup[n + 1]); inf[n] = Math.min(f(n), inf[n + 1]); }
      let lo = Infinity, hi = -Infinity; for (let n = 1; n <= M; n++) { lo = Math.min(lo, f(n)); hi = Math.max(hi, f(n)); }
      P.set(0, M + 1, lo - .15, hi + .15); P.clear(); P.axes({ label: 'aₙ, tail sup sₙ (green), tail inf (red)' });
      P.rect(st.n, lo - .15, M + 1, hi + .15, css('--accent'), .07);
      for (let n = 1; n <= M; n++) P.dot(n, f(n), n >= st.n ? css('--ink') : css('--faint'), 2.2);
      P.poly(Array.from({ length: M }, (_, i) => [i + 1, sup[i + 1]]), css('--good'), 2);
      P.poly(Array.from({ length: M }, (_, i) => [i + 1, inf[i + 1]]), css('--bad'), 2);
      C.ro.textContent = `tail from n = ${st.n} (computed to n = ${H}):\nsup = ${fmt(sup[st.n])}\ninf = ${fmt(inf[st.n])}\n\nestimate lim sup ≈ ${fmt(sup[H - 500])}\nestimate lim inf ≈ ${fmt(inf[H - 500])}\nsup of whole sequence = ${fmt(sup[1])}`;
    }) };

/* 3. Riemann rearrangement */
const rearr = { id: 'rearrangement', title: 'Rearranging the alternating harmonic series', refs: ['the-12.4', 'def-12.3', 'the-12.6'],
  blurb: '1 − 1/2 + 1/3 − … converges to log 2, but only conditionally. Re-order the same terms to reach any target.',
  tries: ['Set the target to 0, then to 3. Why does the greedy rule always work? (Both the positive and the negative parts diverge, and the terms tend to 0.)', 'Why can the same trick not change the sum of Σ(−1)ⁿ/n²? (Theorem on absolutely convergent series.)', 'How far does the rearranged partial sum overshoot the target after n terms? Compare with the size of the last term used.'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 'T', label: 'target', min: -300, max: 300, value: 150 }, { k: 'n', label: 'terms', min: 10, max: 3000, value: 400 }],
    (P, st, C) => {
      const T = st.T / 100, N = st.n; C.show('T', '= ' + fmt(T, 2)); C.show('n', st.n);
      let p = 1, q = 2, s = 0; const pts = [], nat = []; let sn = 0, usedP = 0, usedN = 0;
      for (let k = 1; k <= N; k++) { if (s <= T) { s += 1 / p; p += 2; usedP++; } else { s -= 1 / q; q += 2; usedN++; } pts.push([k, s]); sn += (k % 2 ? 1 : -1) / k; nat.push([k, sn]); }
      const lo = Math.min(T, 0.3, ...pts.map(x => x[1])) - .2, hi = Math.max(T, 1, ...pts.map(x => x[1])) + .2;
      P.set(0, N, lo, hi); P.clear(); P.axes({ label: 'partial sums: rearranged (blue), natural order (grey)' });
      P.hline(T, css('--bad'), true); P.hline(Math.log(2), css('--faint'), true);
      P.poly(nat, css('--faint'), 1.2); P.poly(pts, css('--accent'), 1.6);
      C.ro.textContent = `target ${fmt(T, 2)}\nrearranged sum after ${N} terms: ${fmt(s, 5)}\nused ${usedP} positive and ${usedN} negative terms\nnatural order: ${fmt(sn, 5)} → log 2 = ${fmt(Math.log(2), 5)}`;
    }) };

/* 4. uniform continuity via delta(x) */
const UF = {
  inv: { name: '1/x on (0, 1]', f: x => 1 / x, a: 0.02, b: 1, open: true },
  sq: { name: 'x² on [0, R]', f: x => x * x, a: 0, b: null },
  sqrt: { name: '√x on [0, 1]', f: x => Math.sqrt(Math.max(0, x)), a: 0, b: 1 },
  sin1: { name: 'sin(1/x) on (0, 1]', f: x => Math.sin(1 / x), a: 0.02, b: 1, open: true },
  xsin: { name: 'x sin(1/x) on (0, 1]', f: x => x * Math.sin(1 / x), a: 0.005, b: 1, open: true },
};
function deltaAt(f, x, eps, a, b) {
  let lo = 0, hi = (b - a);
  const ok = d => { for (let i = 0; i <= 48; i++) { const y = x - d + 2 * d * i / 48; if (y < a || y > b) continue; if (Math.abs(f(y) - f(x)) >= eps) return false; } return true; };
  for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; ok(m) ? lo = m : hi = m; }
  return lo;
}
const ucont = { id: 'uniform-continuity', title: 'Uniform continuity: one δ for every point?', refs: ['def-14.5', 'the-14.6', 'exa-14.7'],
  blurb: 'For each x, the largest δ that works for this ε is drawn below the graph. Uniform continuity asks for a positive lower bound on δ(x).',
  tries: ['1/x: as x → 0 the needed δ(x) collapses. Which hypothesis of Theorem 14.6 is missing? (Compactness — (0,1] is not closed.)', 'x² on [0, R]: δ(x) is smallest at the right end. Increase R: on all of ℝ no single δ survives.', '√x is uniformly continuous on [0,1] although its slope blows up at 0. Why does δ(0) stay positive?', 'x sin(1/x) extends continuously to 0, so it is uniformly continuous on (0,1]; sin(1/x) does not. Compare their δ curves.'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 'f', type: 'select', label: 'Function', options: Object.entries(UF).map(([k, v]) => [k, v.name]) },
    { k: 'e', label: 'ε (log scale)', min: 0, max: 100, value: 55 }, { k: 'R', label: 'R (for x²)', min: 1, max: 20, value: 3 }],
    (P, st, C) => {
      const F = UF[st.f], eps = logv(st.e, -2, 0), a = F.a, b = F.b == null ? st.R : F.b; C.show('e', '= ' + fmt(eps)); C.show('R', st.R);
      const g = 140, xs = Array.from({ length: g + 1 }, (_, i) => a + (b - a) * i / g), ds = xs.map(x => deltaAt(F.f, x, eps, a, b));
      let lo = Infinity, hi = -Infinity; xs.forEach(x => { const v = F.f(x); lo = Math.min(lo, v); hi = Math.max(hi, v); });
      const top = [P.pad, 8, P.w - 10, P.h * 0.55]; P.set(Math.min(0, a), b, lo - .1 * (hi - lo + 1e-9), hi + .1 * (hi - lo + 1e-9), top); P.clear(); P.axes({ label: 'f(x)' });
      P.fn(F.f, css('--accent'), 2, a, b);
      const dmax = Math.max(...ds) * 1.1 || 1, bot = [P.pad, P.h * 0.62, P.w - 10, P.h - 26]; P.set(Math.min(0, a), b, 0, dmax, bot); P.axes({ label: 'δ(x): largest δ that works at x' });
      P.poly(xs.map((x, i) => [x, ds[i]]), css('--good'), 2);
      const mi = Math.min(...ds), at = xs[ds.indexOf(mi)];
      P.hline(mi, css('--bad'), true);
      C.ro.textContent = `ε = ${fmt(eps)}\nmin δ(x) on the sampled grid = ${fmt(mi)}\n(attained near x = ${fmt(at, 3)})${F.open ? `\nthe grid stops at x = ${a}; closer to 0 it shrinks further` : ''}\nδ(x) found numerically (48 samples per test)`;
    }) };

/* 5. pointwise vs uniform convergence of f_n */
const FAM = {
  pow: { name: 'xⁿ on [0,1]', f: (n, x) => Math.pow(x, n), lim: x => x < 1 ? 0 : 1, a: 0, b: 1, note: 'limit is discontinuous' },
  bump: { name: 'n²x(1−x²)ⁿ on [0,1]', f: (n, x) => n * n * x * Math.pow(1 - x * x, n), lim: () => 0, a: 0, b: 1, note: '∫fₙ = n²/(2n+2) → ∞, ∫ lim = 0' },
  spike: { name: 'x/(1+nx²) on [−2,2]', f: (n, x) => x / (1 + n * x * x), lim: () => 0, a: -2, b: 2, note: 'uniform: sup = 1/(2√n)' },
  sinn: { name: 'sin(nx)/√n on [0,2π]', f: (n, x) => Math.sin(n * x) / Math.sqrt(n), lim: () => 0, a: 0, b: 2 * Math.PI, note: 'uniform, but fₙ′ = √n cos(nx) does not converge', d: (n, x) => Math.sqrt(n) * Math.cos(n * x) },
  tent: { name: 'moving bump nx e^(−nx) on [0,1]', f: (n, x) => n * x * Math.exp(-n * x), lim: () => 0, a: 0, b: 1, note: 'pointwise only: sup = 1/e for every n' },
};
const ucv = { id: 'uniform-convergence', title: 'Pointwise vs. uniform convergence', refs: ['def-21.3', 'exa-21.2', 'the-22.1', 'the-23.1', 'the-23.2'],
  blurb: 'Uniform convergence means the whole graph of fₙ eventually lies in the ε-tube around f. Pointwise only asks each x separately.',
  tries: ['xⁿ: for any n, part of the graph leaves the tube near x = 1. Why does that force the limit to be discontinuous? (Theorem 22.1.)', 'n²x(1−x²)ⁿ: pointwise limit 0, yet the integrals blow up. Which interchange fails, and which hypothesis of Theorem 23.1 is missing?', 'sin(nx)/√n: the tube shrinks, but tick “show fₙ′”. Why does Theorem 23.2 ask for uniform convergence of the derivatives?', 'nx e^(−nx): find the x where the sup is attained. Where does the bump go as n grows?'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 'f', type: 'select', label: 'Family', options: Object.entries(FAM).map(([k, v]) => [k, v.name]) },
    { k: 'n', label: 'n', min: 1, max: 200, value: 5 }, { k: 'e', label: 'ε (tube)', min: 1, max: 100, value: 15 }, { k: 'd', type: 'check', label: 'show fₙ′ (sin family)' }],
    (P, st, C) => {
      const F = FAM[st.f], n = st.n, eps = st.e / 100; C.show('n', n); C.show('e', '= ' + eps);
      const N = 1200; let sup = 0, at = F.a, intn = 0, lo = Infinity, hi = -Infinity;
      for (let i = 0; i <= N; i++) { const x = F.a + (F.b - F.a) * i / N, v = F.f(n, x), d = Math.abs(v - F.lim(x)); if (d > sup) { sup = d; at = x; } intn += (i === 0 || i === N ? .5 : 1) * v * (F.b - F.a) / N; lo = Math.min(lo, v, F.lim(x)); hi = Math.max(hi, v, F.lim(x)); }
      const showD = st.d && F.d; if (showD) { for (let i = 0; i <= 200; i++) { const x = F.a + (F.b - F.a) * i / 200, v = F.d(n, x); lo = Math.min(lo, v); hi = Math.max(hi, v); } }
      P.set(F.a, F.b, Math.min(lo, -eps) - .1, Math.max(hi, eps) + .1); P.clear(); P.axes({ label: `f_${n} (blue), limit f (grey), ε-tube` });
      P.band(x => F.lim(x) - eps, x => F.lim(x) + eps, css('--good'));
      P.fn(F.lim, css('--faint'), 3, F.a, F.b, 1500);
      P.fn(x => F.f(n, x), css('--accent'), 2, F.a, F.b, 1500);
      if (showD) P.fn(x => F.d(n, x), css('--warn'), 1.2, F.a, F.b, 3000);
      P.vline(at, css('--bad'), true);
      C.ro.textContent = `n = ${n}\nsup |fₙ − f| ≈ ${fmt(sup)} at x ≈ ${fmt(at, 3)}\n${sup < eps ? 'inside the tube everywhere' : 'leaves the ε-tube'}\n∫ fₙ ≈ ${fmt(intn)}\n${F.note}`;
    }) };

/* 6. Riemann–Stieltjes upper and lower sums */
const RF = { sq: { name: 'f(x) = x²', f: x => x * x }, sin: { name: 'f(x) = sin(3x) + 1', f: x => Math.sin(3 * x) + 1 }, step: { name: 'f = 1 for x > 0.5, else 0', f: x => x > 0.5 ? 1 : 0 }, osc: { name: 'f(x) = x sin(1/x)', f: x => x === 0 ? 0 : x * Math.sin(1 / x) } };
const RA = { id: { name: 'α(x) = x (Riemann)', a: x => x }, sq: { name: 'α(x) = x²', a: x => x * x }, jump: { name: 'α = jump of 1 at x = 0.5', a: x => x > 0.5 ? 1 : 0 }, jump2: { name: 'α = jump of 1 at x = 0.5 (from the left)', a: x => x >= 0.5 ? 1 : 0 } };
const rs = { id: 'riemann-stieltjes', title: 'Upper and lower Riemann–Stieltjes sums', refs: ['def-18.1', 'the-18.2', 'the-18.3', 'the-18.4'],
  blurb: 'U(P,f,α) = Σ Mᵢ Δαᵢ and L(P,f,α) = Σ mᵢ Δαᵢ. Refining P can only lower U and raise L; f ∈ ℛ(α) when the gap can be made small.',
  tries: ['Press “refine” a few times. Check that U never increases and L never decreases (Theorem 18.2).', 'With α a jump at 0.5 and f continuous at 0.5, the integral is f(0.5). Watch U − L shrink.', 'Step f with a jump at 0.5 and α with a jump at 0.5: does U − L go to 0? (When f and α are discontinuous at the same point from the same side, f ∉ ℛ(α).) Try both α versions.', 'Random partitions: is the mesh, or the refinement, what matters for Theorem 18.3?'],
  mount: (cv, ct) => {
    let parts = null; const mk = n => Array.from({ length: n + 1 }, (_, i) => i / n);
    return standard(cv, ct, [
      { k: 'f', type: 'select', label: 'Integrand', options: Object.entries(RF).map(([k, v]) => [k, v.name]) },
      { k: 'a', type: 'select', label: 'Integrator', options: Object.entries(RA).map(([k, v]) => [k, v.name]) },
      { k: 'n', label: 'uniform partition, intervals', min: 1, max: 64, value: 6 },
      { k: 'refine', type: 'button', label: 'Refine (add midpoints)' }, { k: 'rand', type: 'button', label: 'Random partition' }],
      (P, st, C, btn) => {
        const f = RF[st.f].f, al = RA[st.a].a; C.show('n', st.n);
        if (btn === 'refine' && parts) { const q = []; parts.forEach((x, i) => { if (i) q.push((parts[i - 1] + x) / 2); q.push(x); }); parts = q.length > 1100 ? parts : q; }
        else if (btn === 'rand') { const r = Array.from({ length: st.n - 1 }, Math.random).sort(); parts = [0, ...r, 1]; }
        else if (!btn) parts = mk(st.n);
        let U = 0, L = 0; const boxes = [];
        for (let i = 1; i < parts.length; i++) { const a = parts[i - 1], b = parts[i]; let M = -Infinity, m = Infinity;
          for (let k = 0; k <= 60; k++) { const v = f(a + (b - a) * k / 60); M = Math.max(M, v); m = Math.min(m, v); }
          if (st.f === 'step' && a <= 0.5 && b > 0.5) { M = 1; m = 0; }
          const da = al(b) - al(a); U += M * da; L += m * da; boxes.push([a, b, M, m, da]); }
        let lo = Math.min(0, ...boxes.map(x => x[3])), hi = Math.max(...boxes.map(x => x[2]));
        P.set(0, 1, lo - .1, hi + .15); P.clear(); P.axes({ label: 'f with upper (red) and lower (green) boxes; bold boxes carry Δα > 0' });
        boxes.forEach(([a, b, M, m, da]) => { const w = da > 1e-12 ? .28 : .06; P.rect(a, 0, b, M, css('--bad'), w, css('--bad')); P.rect(a, 0, b, m, css('--good'), w + .1); });
        P.fn(f, css('--accent'), 2, 0, 1, 1000);
        C.ro.textContent = `${parts.length - 1} intervals\nU(P,f,α) = ${fmt(U, 5)}\nL(P,f,α) = ${fmt(L, 5)}\nU − L = ${fmt(U - L, 5)}`;
      });
  } };

/* 7. Taylor polynomials */
const fact = k => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
const TF = {
  exp: { name: 'eˣ', f: Math.exp, c: k => 1 / fact(k), a: -3, b: 3, R: '∞' }, sin: { name: 'sin x', f: Math.sin, c: k => k % 2 ? ((k - 1) / 2 % 2 ? -1 : 1) / fact(k) : 0, a: -8, b: 8, R: '∞' },
  log: { name: 'log(1 + x)', f: x => Math.log(1 + x), c: k => k ? (k % 2 ? 1 : -1) / k : 0, a: -0.95, b: 2, R: '1' },
  geo: { name: '1/(1 − x)', f: x => 1 / (1 - x), c: () => 1, a: -1.8, b: 0.95, R: '1' },
  flat: { name: 'e^(−1/x²) (0 at 0)', f: x => x === 0 ? 0 : Math.exp(-1 / (x * x)), c: () => 0, a: -2, b: 2, R: 'series is 0: converges everywhere, but not to f' },
};
const taylor = { id: 'taylor', title: 'Taylor polynomials and the remainder', refs: ['the-17.4', 'exa-17.5', 'def-11.5'],
  blurb: 'Pₙ matches f to order n at 0. Taylor’s theorem controls the error by one higher derivative at an intermediate point.',
  tries: ['eˣ: raise the degree. On a fixed window the error goes to 0 — the factorial wins.', 'log(1 + x) beyond x = 1: more terms make it worse. Relate this to the radius of convergence of the power series.', 'e^(−1/x²): every Pₙ is 0. Smooth is not the same as analytic — the remainder does not shrink.', 'For sin x, why are P₁ and P₂ the same polynomial?'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 'f', type: 'select', label: 'Function', options: Object.entries(TF).map(([k, v]) => [k, v.name]) }, { k: 'n', label: 'degree n', min: 0, max: 30, value: 3 }],
    (P, st, C) => {
      const F = TF[st.f], n = st.n; C.show('n', n);
      const Pn = x => { let s = 0, p = 1; for (let k = 0; k <= n; k++) { s += F.c(k) * p; p *= x; } return s; };
      let lo = Infinity, hi = -Infinity, err = 0; for (let i = 0; i <= 400; i++) { const x = F.a + (F.b - F.a) * i / 400, v = F.f(x); lo = Math.min(lo, v); hi = Math.max(hi, v); err = Math.max(err, Math.abs(v - Pn(x))); }
      const pad = (hi - lo) * .4 + .5; P.set(F.a, F.b, lo - pad, hi + pad); P.clear(); P.axes({ label: `f (grey) and P_${n} (blue)` });
      P.fn(F.f, css('--faint'), 3.5, F.a, F.b); P.fn(Pn, css('--accent'), 2, F.a, F.b); P.vline(0, css('--line2'));
      C.ro.textContent = `degree ${n}\nmax |f − Pₙ| on the window ≈ ${fmt(err)}\nradius of convergence: ${F.R}`;
    }) };

/* 8. Bernstein polynomials */
const BF = { abs: { name: '|x − 1/2|', f: x => Math.abs(x - .5) }, sqrt: { name: '√x', f: x => Math.sqrt(x) }, kink: { name: 'min(1, 3|x − 0.3|)', f: x => Math.min(1, 3 * Math.abs(x - .3)) }, sin: { name: 'sin(2πx)', f: x => Math.sin(2 * Math.PI * x) } };
function bern(f, n, x) { if (x <= 0) return f(0); if (x >= 1) return f(1);
  let lp = n * Math.log(1 - x), s = 0; const r = Math.log(x) - Math.log(1 - x);
  for (let k = 0; k <= n; k++) { s += f(k / n) * Math.exp(lp); lp += Math.log((n - k) / (k + 1)) + r; } return s; }
const bernstein = { id: 'bernstein', title: 'Weierstrass approximation with Bernstein polynomials', refs: ['the-26.1', 'cor-26.4'],
  blurb: 'Bₙf(x) = Σ f(k/n) C(n,k) xᵏ(1−x)ⁿ⁻ᵏ averages the values f(k/n) with binomial weights concentrated near x. One explicit proof of the Weierstrass theorem.',
  tries: ['Watch the sup error for |x − 1/2| as n grows: it decays roughly like 1/√n. Where is the error largest?', 'Why do the weights concentrate near x? (Variance of a binomial: x(1−x)/n.) This is where uniform continuity of f enters.', 'Bernstein polynomials of a polynomial need not be the polynomial itself — check sin(2πx) for small n.'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 'f', type: 'select', label: 'Continuous f on [0,1]', options: Object.entries(BF).map(([k, v]) => [k, v.name]) }, { k: 'n', label: 'n', min: 1, max: 400, value: 10 }],
    (P, st, C) => {
      const f = BF[st.f].f, n = st.n; C.show('n', n);
      let err = 0, at = 0; for (let i = 0; i <= 500; i++) { const x = i / 500, d = Math.abs(f(x) - bern(f, n, x)); if (d > err) { err = d; at = x; } }
      P.set(0, 1, -1.15, 1.15); P.clear(); P.axes({ label: `f (grey), B_${n} f (blue), nodes f(k/n)` });
      P.fn(f, css('--faint'), 3.5, 0, 1); P.fn(x => bern(f, n, x), css('--accent'), 2, 0, 1, 500);
      if (n <= 80) for (let k = 0; k <= n; k++) P.dot(k / n, f(k / n), css('--warn'), 2.4);
      P.vline(at, css('--bad'), true);
      C.ro.textContent = `n = ${n}\nsup |f − Bₙf| ≈ ${fmt(err)} at x ≈ ${fmt(at, 3)}`;
    }) };

/* 9. Cantor set */
const cantor = { id: 'cantor', title: 'Building the Cantor set', refs: ['def-6.3', 'the-6.4', 'the-6.2'],
  blurb: 'Remove open middle thirds forever. What is left is compact, perfect, uncountable, and has total length 0.',
  tries: ['After k steps: how many intervals, of what length, and what total length? Predict for k = 8.', 'Type x = 0.25. It is never removed — yet it is not an endpoint of any interval. (Ternary 0.020202…)', 'Why is every point of the Cantor set a limit point of it (perfect)? Look at the two children of the interval containing x.'],
  mount: (cv, ct) => {
    const P = Plot(cv); let k = 4, x = 0.25;
    ct.innerHTML = `<label>steps k <span id="kv"></span><input type="range" min="0" max="9" value="4" id="k"></label><label>test a point x in [0,1]<input type="text" id="x" value="0.25"></label><div class="readout" id="ro"></div>`;
    const draw = () => {
      P.size(); P.set(0, 1, 0, 1); P.clear(); const ctx = P.ctx; ctx.fillStyle = css('--accent');
      let iv = [[0, 1]]; const rowH = (P.h - 50) / 10;
      for (let lv = 0; lv <= k; lv++) { iv.forEach(([a, b]) => ctx.fillRect(P.X(a), 14 + lv * rowH, Math.max(1, P.X(b) - P.X(a)), rowH * .55)); P.text('k = ' + lv, 2, 14 + lv * rowH + rowH * .45);
        if (lv < k) iv = iv.flatMap(([a, b]) => { const t = (b - a) / 3; return [[a, a + t], [b - t, b]]; }); }
      ctx.fillStyle = css('--bad'); if (x >= 0 && x <= 1) ctx.fillRect(P.X(x) - 1, 8, 2, 14 + (k + 1) * rowH);
      let digs = '', y = x, alive = true, died = null; for (let i = 0; i < 24; i++) { y *= 3; let d = Math.floor(y + 1e-12); if (d > 2) d = 2; y -= d; digs += d;
        if (d === 1 && alive) { const rest = y; if (!(rest < 1e-12 || (i < 23 && false))) { alive = false; died = i + 1; } } }
      document.getElementById('kv').textContent = k;
      document.getElementById('ro').textContent = `step ${k}: ${2 ** k} intervals of length 3^−${k} = ${fmt(3 ** -k)}\ntotal length (2/3)^${k} = ${fmt((2 / 3) ** k)}\n\nx = ${x} in base 3: 0.${digs}…\n${alive ? 'no digit 1 needed in the first 24 places: x survives every step shown' : `a digit 1 at place ${died}: x is removed at step ${died} (unless the expansion can be rewritten, e.g. 0.1 = 0.0222…)`}`;
    };
    ct.querySelector('#k').oninput = e => { k = +e.target.value; draw(); };
    ct.querySelector('#x').oninput = e => { const v = parseFloat(e.target.value); if (isFinite(v)) { x = v; draw(); } };
    const ro = new ResizeObserver(draw); ro.observe(cv); draw(); return () => ro.disconnect();
  } };

/* 10. Weierstrass' nowhere-differentiable function (Rudin 7.18 construction) */
const phi = x => { const t = ((x % 2) + 2) % 2; return t <= 1 ? t : 2 - t; };
const monster = { id: 'weierstrass-monster', title: 'A continuous, nowhere differentiable function', refs: ['the-24.1', 'the-21.5', 'the-22.1'],
  blurb: 'f(x) = Σ (3/4)ⁿ φ(4ⁿx), with φ the distance to the nearest even integer. The M-test gives continuity; the zoom shows why no tangent ever appears.',
  tries: ['Add terms one by one. Why is the sum continuous? (Weierstrass M-test with Mₙ = (3/4)ⁿ, then Theorem 22.1.)', 'Zoom in around a point. A differentiable function looks like a line under zoom; this one keeps its corners.', 'The slopes of the n-th term are ±3ⁿ — they grow faster than the terms shrink. That is the heart of Rudin’s proof.'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 'K', label: 'terms', min: 1, max: 12, value: 6 }, { k: 'z', label: 'zoom (powers of 4)', min: 0, max: 6, value: 0 }, { k: 'c', label: 'centre x₀', min: 0, max: 100, value: 30 }],
    (P, st, C) => {
      const K = st.K, w = Math.pow(4, -st.z), x0 = st.c / 100; C.show('K', K); C.show('z', '×' + 4 ** st.z); C.show('c', '= ' + x0);
      const f = x => { let s = 0, a = 1, b = 1; for (let n = 0; n < K; n++) { s += a * phi(b * x); a *= .75; b *= 4; } return s; };
      const a = x0 - w, b = x0 + w; let lo = Infinity, hi = -Infinity; for (let i = 0; i <= 600; i++) { const v = f(a + (b - a) * i / 600); lo = Math.min(lo, v); hi = Math.max(hi, v); }
      P.set(a, b, lo - .05 * (hi - lo + 1e-9), hi + .05 * (hi - lo + 1e-9)); P.clear(); P.axes({ label: `partial sum with ${K} terms on [x₀ − 4^−${st.z}, x₀ + 4^−${st.z}]` });
      P.fn(f, css('--accent'), 1.5, a, b, 2400);
      const h = 4 ** -(K + 1); const dq = (f(x0 + h) - f(x0)) / h;
      C.ro.textContent = `window width ${fmt(2 * w)}\nheight of graph in window ≈ ${fmt(hi - lo)}\ndifference quotient at x₀, h = 4^−${K + 1}: ${fmt(dq)}`;
    }) };

/* 11. Fourier partial sums */
const FW = {
  sq: { name: 'square wave sign(sin x)', f: x => Math.sign(Math.sin(x)), b: n => n % 2 ? 4 / (Math.PI * n) : 0, kind: 'sin' },
  saw: { name: 'sawtooth x on (−π, π)', f: x => { const t = ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return t; }, b: n => 2 * (n % 2 ? 1 : -1) / n, kind: 'sin' },
  tri: { name: 'triangle |x| on (−π, π)', f: x => { const t = ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return Math.abs(t); }, a0: Math.PI / 2, b: n => n % 2 ? -4 / (Math.PI * n * n) : 0, kind: 'cos' },
};
const fourier = { id: 'fourier', title: 'Fourier partial sums', refs: ['def-30.1', 'the-30.2', 'the-30.3', 'the-30.4'],
  blurb: 'Sₙ f is the best mean-square approximation by trigonometric polynomials of degree n. Smoothness of f decides how fast — and in what sense — Sₙ f → f.',
  tries: ['Square wave: the overshoot near the jump does not shrink as n grows (about 9% of the jump; Gibbs). So the convergence is not uniform — consistent with Theorem 22.1, since the limit has jumps.', 'Triangle wave: coefficients decay like 1/n², the M-test applies, and convergence is uniform.', 'Mean-square error decreases with n for every f here. Which result says it tends to 0? (Parseval.)'],
  mount: (cv, ct) => standard(cv, ct, [
    { k: 'f', type: 'select', label: 'Function', options: Object.entries(FW).map(([k, v]) => [k, v.name]) }, { k: 'n', label: 'degree n', min: 1, max: 101, value: 7 }],
    (P, st, C) => {
      const F = FW[st.f], n = st.n; C.show('n', n);
      const S = x => { let s = F.a0 || 0; for (let k = 1; k <= n; k++) { const c = F.b(k); if (c) s += c * (F.kind === 'sin' ? Math.sin(k * x) : Math.cos(k * x)); } return s; };
      let mx = -Infinity, mse = 0; const N = 2000; for (let i = 0; i < N; i++) { const x = -Math.PI + 2 * Math.PI * (i + .5) / N, v = S(x); mx = Math.max(mx, v); mse += (v - F.f(x)) ** 2 / N; }
      const fmax = st.f === 'sq' ? 1 : Math.PI;
      P.set(-Math.PI, Math.PI, st.f === 'tri' ? -.4 : -fmax * 1.3, fmax * 1.3); P.clear(); P.axes({ label: `f (grey) and S_${n} f (blue) on [−π, π]` });
      P.fn(F.f, css('--faint'), 3, -Math.PI, Math.PI, 1600); P.fn(S, css('--accent'), 1.8, -Math.PI, Math.PI, 2400);
      C.ro.textContent = `degree ${n}\nmax of Sₙ f = ${fmt(mx)} (sup of f = ${fmt(fmax)})\nmean-square error ≈ ${fmt(mse)}`;
    }) };

window.M104Labs = { list: [epsN, limsup, rearr, ucont, rs, taylor, ucv, monster, bernstein, cantor, fourier] };
})();
