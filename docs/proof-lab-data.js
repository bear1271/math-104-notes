
(() => {
'use strict';

const m = String.raw;
const step = (id, title, needs, claim, details) => ({ id, title, needs, claim, details });
const detail = (id, title, prompt, hint, answer, check, refs = []) =>
  ({ id, title, prompt, hint, answer, check, refs });

const stones = {
  algebra: step('algebra', 'Uniform closure is an algebra', [],
    m`\(\mathcal B=\overline{\mathcal A}^{\|\cdot\|_\infty}\) is closed under addition, scalar multiplication, and multiplication.`, [
    detail('product', 'Product estimate · Rudin Thm. 7.29',
      m`Suppose \(u_n,v_n\in\mathcal A\) converge uniformly to \(u,v\). Prove that \(u_nv_n\to uv\) uniformly. Which sequence needs a common bound?`,
      m`Insert \(u_nv\) and use the sup norm.`,
      m`Use \(\|u_nv_n-uv\|_\infty\le\|u_n\|_\infty\|v_n-v\|_\infty+\|v\|_\infty\|u_n-u\|_\infty\). The tail satisfies \(\|u_n\|_\infty\le\|u\|_\infty+1\); include the finitely many initial norms in the bound. Sums and scalar multiples follow from the norm inequalities.`,
      'Explain where the common bound comes from and exhibit both error terms.', ['def-22.4']),
  ]),
  interpolate: step('interpolate', 'Two-point interpolation · Rudin Thm. 7.31', [],
    m`For distinct \(x,y\in K\) and any real \(a,b\), some \(h\in\mathcal A\) satisfies \(h(x)=a,\ h(y)=b\).`, [
    detail('selectors', 'Build the two selectors',
      m`Use separation and nonvanishing to construct two functions with value pairs \((1,0)\) and \((0,1)\), using the algebra operations.`,
      m`If \(s(x)\ne s(y)\), start with \(us-s(y)u\).`,
      m`Choose \(s,u,v\in\mathcal A\) with \(s(x)\ne s(y)\), \(u(x)\ne0\), and \(v(y)\ne0\). Put \(U=us-s(y)u,\ V=vs-s(x)v\). Then \(U(y)=V(x)=0\) and \(U(x)V(y)\ne0\). Take \(h=aU/U(x)+bV/V(y)\).`,
      'Give both selectors and name the hypotheses that make their denominators nonzero.', ['def-27.1']),
  ]),
  lattice: step('lattice', 'Finite maxima and minima', ['absolute'],
    m`\(\mathcal B\) is closed under finite pointwise maxima and minima.`, [
    detail('identities', 'From absolute value to lattice operations',
      m`For \(u,v\in\mathcal B\), express \(\max(u,v)\) and \(\min(u,v)\) using absolute value and linear operations. Extend the result to finite families.`,
      m`Compare the sign of \(u-v\).`,
      m`Use \(\max(u,v)=(u+v+|u-v|)/2\) and \(\min(u,v)=(u+v-|u-v|)/2\). These operations stay in \(\mathcal B\), and iteration handles finite families.`,
      'Check the opposite signs and explain how to iterate the two-function formulas.'),
  ]),
  lower: step('lower', 'First finite subcover · global lower bound', ['lattice', 'interpolate'],
    m`For each \(x\in K\), some \(g_x\in\mathcal B\) satisfies \(g_x(x)=f(x)\) and \(g_x(z)>f(z)-\varepsilon\) for all \(z\in K\).`, [
    detail('open-cover', 'Construct the open cover',
      m`Fix \(x\). Construct an open cover from two-point interpolation. How do you choose an interpolant when the second point is also \(x\)?`,
      m`Each \(y\) should belong to the open set built using \(y\).`,
      m`Choose \(h_y\in\mathcal A\) with \(h_y(x)=f(x)\) and \(h_y(y)=f(y)\). If \(y=x\), scale a member nonzero at \(x\). Define \(U_y=\{z\in K:h_y(z)>f(z)-\varepsilon\}\). Continuity of \(h_y-f\) makes \(U_y\) open, and \(y\in U_y\), so these sets cover \(K\).`,
      'Check openness, a witness for each covered point, and the coincident-point case.', ['the-13.4']),
    detail('maximum', 'Why the maximum gives a global lower bound',
      m`Given the finite subcover \(U_{y_1},\ldots,U_{y_r}\), construct \(g_x\). Prove it preserves the equality at \(x\) and the global lower bound.`,
      m`For each \(z\), the cover provides an index that can depend on \(z\).`,
      m`Set \(g_x=\max_{j\le r}h_{y_j}\in\mathcal B\). All terms have value \(f(x)\) at \(x\), giving the equality. For each \(z\), some \(j\) has \(z\in U_{y_j}\), so \(g_x(z)\ge h_{y_j}(z)>f(z)-\varepsilon\).`,
      'Use all candidates at the anchor and at least one candidate at each other point.', ['def-5.1']),
  ]),
  upper: step('upper', 'Second finite subcover · uniform approximation', ['lower'],
    m`For every \(\eta>0\), some \(g\in\mathcal B\) satisfies \(\|f-g\|_\infty<\eta\). Thus \(f\in\mathcal B\).`, [
    detail('minimum', 'Why the minimum keeps both bounds',
      m`From \(g_x(x)=f(x)\) and \(g_x>f-\varepsilon\), construct the second cover and the final approximant. How do you ensure \(\|f-g\|_\infty<\eta\)?`,
      m`Make \(x\) belong to its own open set. Start with \(\varepsilon=\eta/2\).`,
      m`Take \(\varepsilon=\eta/2\). The open sets \(V_x=\{z:g_x(z)<f(z)+\varepsilon\}\) cover \(K\) because \(x\in V_x\). For a finite subcover \(V_{x_1},\ldots,V_{x_s}\), take \(g=\min_{j\le s}g_{x_j}\in\mathcal B\). Every candidate is above \(f-\varepsilon\) everywhere, and at each point some candidate is below \(f+\varepsilon\). Thus \(\|g-f\|_\infty\le\varepsilon<\eta\). Use closedness to conclude.`,
      'Check the open cover, the quantifiers for both bounds, the sup norm, and the use of closedness.'),
  ]),
};
const stoneAbsolute = step('absolute', 'Absolute-value closure · Handout Cor. 26.4', ['algebra'],
  m`If \(u\in\mathcal B\), then \(|u|\in\mathcal B\).`, [
  detail('zero-constant', 'Remove the constant term',
    m`Given \(u\in\mathcal B\), use Weierstrass approximation to get \(P_n\circ u\to|u|\) uniformly. Why control \(P_n(0)\)?`,
    m`Approximate on \([-\|u\|_\infty,\|u\|_\infty]\), then subtract \(Q_n(0)\).`,
    m`The case \(\|u\|_\infty=0\) is immediate. Otherwise take \(Q_n\to |t|\) uniformly on the indicated interval and set \(P_n=Q_n-Q_n(0)\). Since \(|Q_n(0)|\le\|Q_n-|t|\|_\infty\), the error at most doubles. The zero constant term lets us form \(P_n(u)\) from positive powers of \(u\) and linear combinations. Uniform convergence and closedness give \(|u|\in\mathcal B\).`,
    'Check the approximation interval, error bound, zero constant term, and closedness.', ['cor-26.4']),
]);
const stoneRecurrence = step('absolute', 'Absolute-value closure · Rudin Ex. 7.23', ['algebra'],
  m`The polynomial recurrence with zero constant term yields \(|u|\in\mathcal B\).`, [
  detail('recurrence', 'Prove uniform convergence of the recurrence',
    m`Let \(P_0(t)=0,\ P_{n+1}(t)=P_n(t)+(t^2-P_n(t)^2)/2\). On \([-1,1]\), find a uniform error bound or give a quantifier proof of uniform convergence.`,
    m`Write \(a=|t|\) and factor \(a-P_{n+1}\). Split into small \(a\) and \(a\) bounded away from zero.`,
    m`The identity \(a-P_{n+1}=(a-P_n)(1-(a+P_n)/2)\) gives \(0\le P_n\le P_{n+1}\le a\) by induction. Thus the error is bounded by \(a(1-a/2)^n\). For \(0<\varepsilon\le1\), the error is below \(\varepsilon/2\) when \(a<\varepsilon/2\). Otherwise bound it by \((1-\varepsilon/4)^n\), which tends to zero uniformly in that range.`,
    'State the induction invariant and choose one cutoff for the whole interval.'),
  detail('rescale', 'Rescale and compose',
    m`Use the recurrence on \([-1,1]\) to show \(|u|\in\mathcal B\) for arbitrary \(u\in\mathcal B\).`,
    m`For \(c=\|u\|_\infty>0\), consider \(cP_n(u/c)\).`,
    m`Induction gives \(P_n(0)=0\), so \(cP_n(u/c)\in\mathcal B\). Its error is at most \(c\sup_{|t|\le1}|P_n(t)-|t||\), which tends to zero. Use closedness. If \(c=0\), then \(|u|=0\).`,
    'Check the rescaling, the zero-norm case, and why composition stays in the algebra.'),
]);
const stonePath = absolute => [stones.algebra, absolute, stones.lattice, stones.interpolate, stones.lower, stones.upper];

const uniformBound = step('bounded', 'Uniform bound for the entire sequence', [],
  m`Some \(M<\infty\) bounds \(|f_n(x)|\) for all \(n\) and \(x\in K\).`, [
  detail('net-bound', 'Upgrade pointwise bounds to one bound',
    m`For nonempty compact \(K\), derive a common bound \(M\) from pointwise boundedness and equicontinuity.`,
    m`Use equicontinuity with tolerance \(1\), then bound values at finitely many centers.`,
    m`Take \(\delta\) so \(d(x,y)<\delta\) implies \(|f_n(x)-f_n(y)|<1\) for every \(n\). Extract a finite cover with centers \(p_j\). Each \(M_j=\sup_n|f_n(p_j)|\) is finite. Comparing any \(x\) to a nearby center gives \(|f_n(x)|\le1+\max_j M_j\). The empty case is immediate.`,
    'Identify the roles of equicontinuity and the finite subcover in making the bound uniform.', ['def-24.2', 'def-5.1']),
]);
const dense = step('dense', 'Countable dense set', [],
  m`The compact metric space \(K\) has a countable dense subset \(E\), possibly finite.`, [
  detail('dense-centers', 'Build a dense set at every scale',
    m`For each \(k\ge1\), extract a finite subcover from \(\{B(x,1/k):x\in K\}\). Define \(E\) and prove it is countable and dense.`,
    m`Take the countable union of the finite center sets.`,
    m`Let \(E_k\) be the finite center set and put \(E=\bigcup_{k\ge1}E_k\). It is countable. Given \(x\in K\) and \(r>0\), pick \(k\) with \(1/k<r\). A center from \(E_k\) lies in \(B(x,r)\).`,
    'Show that every ball in \(K\) contains a point of \(E\).', ['def-5.1', 'the-3.4']),
]);
const diagonal = step('diagonal', 'Diagonal subsequence · Rudin Thm. 7.23', ['dense'],
  m`One subsequence \((g_i)\) converges at every point of \(E\).`, [
  detail('indices', 'Why the diagonal keeps every coordinate',
    m`Enumerate nonempty \(E\) as \(p_1,p_2,\ldots\), with repetitions if finite. Construct one subsequence that converges at each coordinate, with strictly increasing original indices.`,
    m`Extract nested subsequences, then take the \(k\)-th element from row \(k\).`,
    m`Use pointwise boundedness and Bolzano–Weierstrass in \(\mathbb R\) or \(\mathbb R^2\) to choose row \(k\) as a subsequence of row \(k-1\) converging at \(p_k\). The original index of entry \(k+1\) in row \(k+1\) is at least that of entry \(k+1\) in row \(k\), hence exceeds the preceding diagonal index. For fixed \(j\), the diagonal tail lies in row \(j\) with increasing indices, so it converges at \(p_j\).`,
    'Prove strict increase of indices and inheritance of convergence at each fixed coordinate.', ['the-24.4']),
]);
const uniformCauchy = step('upgrade', 'Uniform Cauchy estimate from finitely many centers', ['diagonal'],
  m`The subsequence \((g_i)\) is uniformly Cauchy on \(K\), hence converges uniformly.`, [
  detail('one-cutoff', 'Choose one cutoff for all points',
    m`Given \(\varepsilon>0\), use finitely many centers in \(E\) to find a common tail where \(\sup_{x\in K}|g_i(x)-g_j(x)|<\varepsilon\).`,
    m`Choose the radius using \(\varepsilon/4\). Take the maximum of the center cutoffs.`,
    m`Choose \(\delta\) from equicontinuity for \(\varepsilon/4\). Density and compactness give a cover by finitely many \(\delta\)-balls centered at \(p_s\in E\). At each center the Cauchy property supplies \(N_s\) with \(|g_i(p_s)-g_j(p_s)|<\varepsilon/4\) for \(i,j\ge N_s\). Set \(N=\max_s N_s\). Insert a nearby center at any \(x\) to bound the supremum by \(3\varepsilon/4\), then apply the uniform Cauchy criterion.`,
    'Choose the scale, then the centers, then a cutoff independent of \(x\). Show all three error terms.', ['the-21.4']),
]);
const totalBounded = step('total-bounded', 'Total boundedness in the sup metric', ['bounded'],
  m`For every \(\varepsilon>0\), finitely many sup-norm \(\varepsilon\)-balls cover \(\{f_n:n\ge1\}\subset C(K)\).`, [
  detail('grid', 'Encode the family at a finite net',
    m`Given \(\|f_n\|_\infty\le M\), group functions by finitely many sample centers and a finite grid in the bounded range. Prove each group has sup-norm diameter below \(\varepsilon\).`,
    m`A sample vector records which cell contains each value. Choose a small enough cell size and equicontinuity tolerance.`,
    m`Use a finite net \(p_1,\ldots,p_r\) at an equicontinuity scale for \(\varepsilon/4\). Partition \([-M,M]\) into intervals of diameter at most \(\varepsilon/4\). For complex values, use squares of side at most \(\varepsilon/8\) in \([-M,M]^2\). Assign boundary values to one cell. Group by the cell of each \(f_n(p_j)\). Two functions in a group differ by at most \(3\varepsilon/4\) at any point by comparison to a nearby center. Choose a representative of each nonempty group as a ball center.`,
    'Explain why there are finitely many groups and why a ball center can be taken from the family.', ['def-24.2', 'def-22.4']),
]);
const nested = step('nested', 'Extract a Cauchy subsequence and take its limit', ['total-bounded'],
  m`Total boundedness yields a uniformly Cauchy subsequence. Completeness gives its uniform limit.`, [
  detail('nested-covers', 'Nested extraction across shrinking scales',
    m`Use the finite covers at shrinking scales to construct strictly increasing indices \(n_k\). Give an explicit Cauchy estimate.`,
    m`Apply the finite pigeonhole principle to the infinite set of indices retained at the preceding step.`,
    m`Set \(I_0=\mathbb N\). At radius \(r_k=2^{-k}\), some covering ball contains the functions indexed by infinitely many members of \(I_{k-1}\). Keep those indices as \(I_k\) and choose \(n_k\in I_k\) greater than the preceding index. For \(i,j\ge k\), both functions lie in the same radius-\(r_k\) ball, giving distance at most \(2r_k\). Completeness of \(C(K)\) gives convergence.`,
    'Distinguish infinitely many indices from infinitely many distinct functions. Show increasing indices and the ball diameter bound.', ['the-22.5']),
]);

const increment = step('mvt', 'Mean-value bound on increments', [],
  m`For \(x,t\in[a,b]\), \(|(f_n-f_m)(t)-(f_n-f_m)(x)|\le|t-x|\sup|f_n'-f_m'|\).`, [
  detail('scale', 'Apply MVT to the difference',
    m`Apply the MVT to \(f_n-f_m\). Why can the derivatives be discontinuous? When is the bound finite if individual derivatives are unbounded?`,
    m`Use the uniform Cauchy condition to control differences of derivatives on the tail.`,
    m`Put \(H=f_n-f_m\). For real \(H\), the MVT bounds the difference quotient. For complex \(H\) and \(w=H(t)-H(x)\ne0\), apply it to \(s\mapsto\operatorname{Re}(\overline w H(s)/|w|)\). This has increment \(|w|\) and derivative bounded by \(|H'|\). The zero-increment case is immediate. Uniform Cauchyness gives a finite bound on derivative differences for sufficiently large \(m,n\), even if individual derivatives are unbounded.`,
    'Identify the function to which the MVT applies and the derivative difference that is bounded.', ['the-16.5']),
]);
const anchor = step('anchor', 'Anchor at one point and obtain the uniform limit', ['mvt'],
  m`Set \(t=x_0\) and use the Cauchy property of \((f_n(x_0))\) to get uniform convergence \(f_n\to f\).`, [
  detail('constant', 'Control the additive constants',
    m`Derive the estimate for \(\|f_n-f_m\|_\infty\) and identify the assumption controlling each term. What happens without convergence at \(x_0\)?`,
    m`Compare the values of \(f_n-f_m\) at \(x\) and \(x_0\).`,
    m`We have \(\|f_n-f_m\|_\infty\le|f_n(x_0)-f_m(x_0)|+(b-a)\sup|f_n'-f_m'|\). The first term is small by convergence at \(x_0\), the second by uniform convergence of the derivatives. Use the uniform Cauchy criterion. If \(f_n\equiv n\), the derivatives are zero while the function values diverge everywhere.`,
    'Trace both terms to their assumptions and give a counterexample without the anchor.', ['the-21.4']),
]);
const quotients = step('quotients', 'Uniform control of difference quotients', ['mvt', 'anchor'],
  m`For fixed \(x\), \(\varphi_n(t)=[f_n(t)-f_n(x)]/(t-x)\) converges uniformly on the punctured domain to the difference quotient of \(f\).`, [
  detail('cancel', 'Cancel the distance before taking the limit',
    m`Prove \((\varphi_n)\) is uniformly Cauchy and identify its limit. Why is the sup-norm error \(\|f_n-f\|_\infty\) divided by \(|t-x|\) insufficient?`,
    m`First control increments, then cancel \(|t-x|\).`,
    m`By the increment estimate, \(|\varphi_n(t)-\varphi_m(t)|\le\sup|f_n'-f_m'|\) for all \(t\ne x\), which gives a uniform Cauchy tail. For fixed \(t\ne x\), convergence at \(t\) and \(x\) identifies the limit as the difference quotient of \(f\). A function-value error alone leaves a factor \(1/|t-x|\), unbounded near \(x\).`,
    'Fix \(t\) to identify the limit. State separately what proves uniform convergence.', ['the-21.4']),
]);
const exchange = step('exchange', 'Interchange the quotient limits · Rudin Thm. 7.11', ['quotients'],
  m`\(\lim_{t\to x}\lim_n\varphi_n(t)=\lim_n\lim_{t\to x}\varphi_n(t)=\lim_n f_n'(x)\)。`, [
  detail('two-limits', 'Identify the two limits and the hypotheses',
    m`Write both orders of limits. Where do you use uniform convergence of \(\varphi_n\)? How do you take the limit at \(x=a\) or \(b\)?`,
    m`For fixed \(n\), differentiability gives the inner limit.`,
    m`For each \(n\), \(t\to x\) gives \(f_n'(x)\). Uniform convergence of \(\varphi_n\) on the punctured interval permits exchanging limits by Rudin 7.11. Thus \(f'(x)=\lim_n f_n'(x)\). At an endpoint take the one-sided limit within the interval.`,
    'Specify which functions converge uniformly and handle the endpoints.', ['the-22.1']),
]);
const limitingIncrement = step('limiting-increment', 'Pass to the limit in the increment bound', ['mvt', 'anchor'],
  m`With \(g=\lim_n f_n'\), every difference quotient of \(f-f_n\) is bounded by \(\sup|g-f_n'|\) for sufficiently large fixed \(n\).`, [
  detail('fixed-index', 'Freeze one approximant',
    m`Fix \(n\) with finite \(\sup|f_n'-g|\), then fix \(x,t\). Let \(m\to\infty\) in the increment bound for \(f_m-f_n\).`,
    m`Use \(\sup|f_m'-f_n'|\le\sup|f_m'-g|+\sup|g-f_n'|\).`,
    m`Fix \(n,x,t\) with \(t\ne x\). The MVT bounds the modulus of the difference quotient for \(f_m-f_n\) by \(\sup|f_m'-g|+\sup|g-f_n'|\). Let \(m\to\infty\). The quotient becomes that of \(f-f_n\), the first term tends to zero, and the remaining bound is independent of \(x,t\).`,
    'Hold \(n,x,t\) fixed as \(m\to\infty\) and retain a bound independent of \(t\).', ['the-16.5']),
]);
const direct = step('direct', 'Take the derivative by a three-term estimate', ['limiting-increment'],
  m`The difference quotient \(D_f(t,x)\) tends to \(g(x)\), where \(g=\lim_n f_n'\).`, [
  detail('choose-order', 'Choose n before choosing t',
    m`Decompose \(|D_f(t,x)-g(x)|\) into three terms. For given \(\varepsilon>0\), in what order do you choose \(n\) and the neighborhood of \(x\)?`,
    m`Insert \(D_{f_n}(t,x)\) and \(f_n'(x)\).`,
    m`Bound by \(|D_f-D_{f_n}|+|D_{f_n}-f_n'(x)|+|f_n'(x)-g(x)|\). Choose \(n\) with \(\sup|f_n'-g|<\varepsilon/3\) to control the first and third terms. Hold \(n\) fixed and use differentiability of \(f_n\) to make the middle term less than \(\varepsilon/3\) near \(x\). At endpoints use one-sided neighborhoods.`,
    'Use the same \(n\) for the outer errors. Only the middle term requires bringing \(t\) close to \(x\).'),
]);

window.M104ProofLab = {
  'the-27.3': [
    { id: 'handout', title: 'Polynomial approximation and lattice gluing', source: 'Handout 27.3 · Rudin Thm. 7.32', scope: 'Handout route', steps: stonePath(stoneAbsolute),
      transfer: 'With two-point interpolation and closure under finite maxima and minima, both finite-subcover arguments apply as written. This yields an approximation theorem formulated for vector lattices.' },
    { id: 'recurrence', title: 'Polynomial recurrence and lattice gluing', source: 'Rudin Ex. 7.23 and HW7, followed by Rudin Thm. 7.32', scope: 'Same hypotheses, with one lemma replaced',
      steps: stonePath(stoneRecurrence), transfer: 'The recurrence proves absolute-value approximation directly. The interpolation and gluing steps then apply without first invoking the Weierstrass approximation theorem.' },
  ],
  'the-25.1': [
    { id: 'handout', title: 'Dense set, diagonal subsequence, finite net', source: 'Handout 25.1 · Rudin Thm. 7.23, 7.25', scope: 'Handout route',
      steps: [uniformBound, dense, diagonal, uniformCauchy],
      transfer: 'HW7, Rudin Ex. 7.16, assumes pointwise convergence of the whole sequence. Apply the common cutoff at finitely many centers to obtain uniform convergence of the full sequence.' },
    { id: 'total-boundedness', title: 'Total boundedness in the function space', source: 'Standard argument using finite nets and completeness of C(K)', scope: 'Same hypotheses, using the function-space metric',
      steps: [uniformBound, totalBounded, nested],
      transfer: 'View the family as a subset of C(K). Finite ball covers give a route to relative compactness and show why sampling must be combined with common oscillation bounds.' },
  ],
  'the-23.2': [
    { id: 'handout', title: 'Uniform convergence of quotients and interchange of limits', source: 'Handout 23.2 · Rudin Thm. 7.11, 7.17', scope: 'Handout route',
      steps: [increment, anchor, quotients, exchange],
      transfer: 'In HW7, Rudin Ex. 7.7, the functions converge uniformly while the derivatives converge only pointwise. Interchanging the quotient limits fails at zero.' },
    { id: 'direct-estimate', title: 'Fix one approximant and bound the difference quotient', source: 'Standard argument from the MVT estimate in Rudin Thm. 7.17', scope: 'Same hypotheses, with a direct estimate',
      steps: [increment, anchor, limitingIncrement, direct],
      transfer: 'Fix one approximant before using its local derivative. The direct estimate also works with discontinuous derivatives.' },
  ],
};
})();
