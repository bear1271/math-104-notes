# Layered Proof Exercises

Practice the logic of each route, then write out the local arguments. The reference notes below each prompt supply the key inference and a check on its use.

## Class 23 · Uniform convergence of derivatives

### Uniform convergence of quotients and interchange of limits

**Source** Handout 23.2 · Rudin Thm. 7.11, 7.17

**Scope** Handout route

#### Mean-value bound on increments

For $x,t\in[a,b]$, $|(f_n-f_m)(t)-(f_n-f_m)(x)|\le|t-x|\sup|f_n'-f_m'|$.

**Prompt** Apply the MVT to $f_n-f_m$. Why can the derivatives be discontinuous? When is the bound finite if individual derivatives are unbounded?

**Hint** Use the uniform Cauchy condition to control differences of derivatives on the tail.

**Reference argument** Put $H=f_n-f_m$. For real $H$, the MVT bounds the difference quotient. For complex $H$ and $w=H(t)-H(x)\ne0$, apply it to $s\mapsto\operatorname{Re}(\overline w H(s)/|w|)$. This has increment $|w|$ and derivative bounded by $|H'|$. The zero-increment case is immediate. Uniform Cauchyness gives a finite bound on derivative differences for sufficiently large $m,n$, even if individual derivatives are unbounded.

**Self-check** Identify the function to which the MVT applies and the derivative difference that is bounded.

#### Anchor at one point and obtain the uniform limit

Set $t=x_0$ and use the Cauchy property of $(f_n(x_0))$ to get uniform convergence $f_n\to f$.

**Prompt** Derive the estimate for $\|f_n-f_m\|_\infty$ and identify the assumption controlling each term. What happens without convergence at $x_0$?

**Hint** Compare the values of $f_n-f_m$ at $x$ and $x_0$.

**Reference argument** We have $\|f_n-f_m\|_\infty\le|f_n(x_0)-f_m(x_0)|+(b-a)\sup|f_n'-f_m'|$. The first term is small by convergence at $x_0$, the second by uniform convergence of the derivatives. Use the uniform Cauchy criterion. If $f_n\equiv n$, the derivatives are zero while the function values diverge everywhere.

**Self-check** Trace both terms to their assumptions and give a counterexample without the anchor.

#### Uniform control of difference quotients

For fixed $x$, $\varphi_n(t)=[f_n(t)-f_n(x)]/(t-x)$ converges uniformly on the punctured domain to the difference quotient of $f$.

**Prompt** Prove $(\varphi_n)$ is uniformly Cauchy and identify its limit. Why is the sup-norm error $\|f_n-f\|_\infty$ divided by $|t-x|$ insufficient?

**Hint** First control increments, then cancel $|t-x|$.

**Reference argument** By the increment estimate, $|\varphi_n(t)-\varphi_m(t)|\le\sup|f_n'-f_m'|$ for all $t\ne x$, which gives a uniform Cauchy tail. For fixed $t\ne x$, convergence at $t$ and $x$ identifies the limit as the difference quotient of $f$. A function-value error alone leaves a factor $1/|t-x|$, unbounded near $x$.

**Self-check** Fix (t) to identify the limit. State separately what proves uniform convergence.

#### Interchange the quotient limits · Rudin Thm. 7.11

$\lim_{t\to x}\lim_n\varphi_n(t)=\lim_n\lim_{t\to x}\varphi_n(t)=\lim_n f_n'(x)$。

**Prompt** Write both orders of limits. Where do you use uniform convergence of $\varphi_n$? How do you take the limit at $x=a$ or $b$?

**Hint** For fixed $n$, differentiability gives the inner limit.

**Reference argument** For each $n$, $t\to x$ gives $f_n'(x)$. Uniform convergence of $\varphi_n$ on the punctured interval permits exchanging limits by Rudin 7.11. Thus $f'(x)=\lim_n f_n'(x)$. At an endpoint take the one-sided limit within the interval.

**Self-check** Specify which functions converge uniformly and handle the endpoints.

**Transfer** In HW7, Rudin Ex. 7.7, the functions converge uniformly while the derivatives converge only pointwise. Interchanging the quotient limits fails at zero.

### Fix one approximant and bound the difference quotient

**Source** Standard argument from the MVT estimate in Rudin Thm. 7.17

**Scope** Same hypotheses, with a direct estimate

#### Mean-value bound on increments

For $x,t\in[a,b]$, $|(f_n-f_m)(t)-(f_n-f_m)(x)|\le|t-x|\sup|f_n'-f_m'|$.

**Prompt** Apply the MVT to $f_n-f_m$. Why can the derivatives be discontinuous? When is the bound finite if individual derivatives are unbounded?

**Hint** Use the uniform Cauchy condition to control differences of derivatives on the tail.

**Reference argument** Put $H=f_n-f_m$. For real $H$, the MVT bounds the difference quotient. For complex $H$ and $w=H(t)-H(x)\ne0$, apply it to $s\mapsto\operatorname{Re}(\overline w H(s)/|w|)$. This has increment $|w|$ and derivative bounded by $|H'|$. The zero-increment case is immediate. Uniform Cauchyness gives a finite bound on derivative differences for sufficiently large $m,n$, even if individual derivatives are unbounded.

**Self-check** Identify the function to which the MVT applies and the derivative difference that is bounded.

#### Anchor at one point and obtain the uniform limit

Set $t=x_0$ and use the Cauchy property of $(f_n(x_0))$ to get uniform convergence $f_n\to f$.

**Prompt** Derive the estimate for $\|f_n-f_m\|_\infty$ and identify the assumption controlling each term. What happens without convergence at $x_0$?

**Hint** Compare the values of $f_n-f_m$ at $x$ and $x_0$.

**Reference argument** We have $\|f_n-f_m\|_\infty\le|f_n(x_0)-f_m(x_0)|+(b-a)\sup|f_n'-f_m'|$. The first term is small by convergence at $x_0$, the second by uniform convergence of the derivatives. Use the uniform Cauchy criterion. If $f_n\equiv n$, the derivatives are zero while the function values diverge everywhere.

**Self-check** Trace both terms to their assumptions and give a counterexample without the anchor.

#### Pass to the limit in the increment bound

With $g=\lim_n f_n'$, every difference quotient of $f-f_n$ is bounded by $\sup|g-f_n'|$ for sufficiently large fixed $n$.

**Prompt** Fix $n$ with finite $\sup|f_n'-g|$, then fix $x,t$. Let $m\to\infty$ in the increment bound for $f_m-f_n$.

**Hint** Use $\sup|f_m'-f_n'|\le\sup|f_m'-g|+\sup|g-f_n'|$.

**Reference argument** Fix $n,x,t$ with $t\ne x$. The MVT bounds the modulus of the difference quotient for $f_m-f_n$ by $\sup|f_m'-g|+\sup|g-f_n'|$. Let $m\to\infty$. The quotient becomes that of $f-f_n$, the first term tends to zero, and the remaining bound is independent of $x,t$.

**Self-check** Hold (n,x,t) fixed as (m	oinfty) and retain a bound independent of (t).

#### Take the derivative by a three-term estimate

The difference quotient $D_f(t,x)$ tends to $g(x)$, where $g=\lim_n f_n'$.

**Prompt** Decompose $|D_f(t,x)-g(x)|$ into three terms. For given $\varepsilon>0$, in what order do you choose $n$ and the neighborhood of $x$?

**Hint** Insert $D_{f_n}(t,x)$ and $f_n'(x)$.

**Reference argument** Bound by $|D_f-D_{f_n}|+|D_{f_n}-f_n'(x)|+|f_n'(x)-g(x)|$. Choose $n$ with $\sup|f_n'-g|<\varepsilon/3$ to control the first and third terms. Hold $n$ fixed and use differentiability of $f_n$ to make the middle term less than $\varepsilon/3$ near $x$. At endpoints use one-sided neighborhoods.

**Self-check** Use the same (n) for the outer errors. Only the middle term requires bringing (t) close to (x).

**Transfer** Fix one approximant before using its local derivative. The direct estimate also works with discontinuous derivatives.

## Class 25 · Arzelà–Ascoli

### Dense set, diagonal subsequence, finite net

**Source** Handout 25.1 · Rudin Thm. 7.23, 7.25

**Scope** Handout route

#### Uniform bound for the entire sequence

Some $M<\infty$ bounds $|f_n(x)|$ for all $n$ and $x\in K$.

**Prompt** For nonempty compact $K$, derive a common bound $M$ from pointwise boundedness and equicontinuity.

**Hint** Use equicontinuity with tolerance $1$, then bound values at finitely many centers.

**Reference argument** Take $\delta$ so $d(x,y)<\delta$ implies $|f_n(x)-f_n(y)|<1$ for every $n$. Extract a finite cover with centers $p_j$. Each $M_j=\sup_n|f_n(p_j)|$ is finite. Comparing any $x$ to a nearby center gives $|f_n(x)|\le1+\max_j M_j$. The empty case is immediate.

**Self-check** Identify the roles of equicontinuity and the finite subcover in making the bound uniform.

#### Countable dense set

The compact metric space $K$ has a countable dense subset $E$, possibly finite.

**Prompt** For each $k\ge1$, extract a finite subcover from $\{B(x,1/k):x\in K\}$. Define $E$ and prove it is countable and dense.

**Hint** Take the countable union of the finite center sets.

**Reference argument** Let $E_k$ be the finite center set and put $E=\bigcup_{k\ge1}E_k$. It is countable. Given $x\in K$ and $r>0$, pick $k$ with $1/k<r$. A center from $E_k$ lies in $B(x,r)$.

**Self-check** Show that every ball in (K) contains a point of (E).

#### Diagonal subsequence · Rudin Thm. 7.23

One subsequence $(g_i)$ converges at every point of $E$.

**Prompt** Enumerate nonempty $E$ as $p_1,p_2,\ldots$, with repetitions if finite. Construct one subsequence that converges at each coordinate, with strictly increasing original indices.

**Hint** Extract nested subsequences, then take the $k$-th element from row $k$.

**Reference argument** Use pointwise boundedness and Bolzano–Weierstrass in $\mathbb R$ or $\mathbb R^2$ to choose row $k$ as a subsequence of row $k-1$ converging at $p_k$. The original index of entry $k+1$ in row $k+1$ is at least that of entry $k+1$ in row $k$, hence exceeds the preceding diagonal index. For fixed $j$, the diagonal tail lies in row $j$ with increasing indices, so it converges at $p_j$.

**Self-check** Prove strict increase of indices and inheritance of convergence at each fixed coordinate.

#### Uniform Cauchy estimate from finitely many centers

The subsequence $(g_i)$ is uniformly Cauchy on $K$, hence converges uniformly.

**Prompt** Given $\varepsilon>0$, use finitely many centers in $E$ to find a common tail where $\sup_{x\in K}|g_i(x)-g_j(x)|<\varepsilon$.

**Hint** Choose the radius using $\varepsilon/4$. Take the maximum of the center cutoffs.

**Reference argument** Choose $\delta$ from equicontinuity for $\varepsilon/4$. Density and compactness give a cover by finitely many $\delta$-balls centered at $p_s\in E$. At each center the Cauchy property supplies $N_s$ with $|g_i(p_s)-g_j(p_s)|<\varepsilon/4$ for $i,j\ge N_s$. Set $N=\max_s N_s$. Insert a nearby center at any $x$ to bound the supremum by $3\varepsilon/4$, then apply the uniform Cauchy criterion.

**Self-check** Choose the scale, then the centers, then a cutoff independent of (x). Show all three error terms.

**Transfer** HW7, Rudin Ex. 7.16, assumes pointwise convergence of the whole sequence. Apply the common cutoff at finitely many centers to obtain uniform convergence of the full sequence.

### Total boundedness in the function space

**Source** Standard argument using finite nets and completeness of C(K)

**Scope** Same hypotheses, using the function-space metric

#### Uniform bound for the entire sequence

Some $M<\infty$ bounds $|f_n(x)|$ for all $n$ and $x\in K$.

**Prompt** For nonempty compact $K$, derive a common bound $M$ from pointwise boundedness and equicontinuity.

**Hint** Use equicontinuity with tolerance $1$, then bound values at finitely many centers.

**Reference argument** Take $\delta$ so $d(x,y)<\delta$ implies $|f_n(x)-f_n(y)|<1$ for every $n$. Extract a finite cover with centers $p_j$. Each $M_j=\sup_n|f_n(p_j)|$ is finite. Comparing any $x$ to a nearby center gives $|f_n(x)|\le1+\max_j M_j$. The empty case is immediate.

**Self-check** Identify the roles of equicontinuity and the finite subcover in making the bound uniform.

#### Total boundedness in the sup metric

For every $\varepsilon>0$, finitely many sup-norm $\varepsilon$-balls cover $\{f_n:n\ge1\}\subset C(K)$.

**Prompt** Given $\|f_n\|_\infty\le M$, group functions by finitely many sample centers and a finite grid in the bounded range. Prove each group has sup-norm diameter below $\varepsilon$.

**Hint** A sample vector records which cell contains each value. Choose a small enough cell size and equicontinuity tolerance.

**Reference argument** Use a finite net $p_1,\ldots,p_r$ at an equicontinuity scale for $\varepsilon/4$. Partition $[-M,M]$ into intervals of diameter at most $\varepsilon/4$. For complex values, use squares of side at most $\varepsilon/8$ in $[-M,M]^2$. Assign boundary values to one cell. Group by the cell of each $f_n(p_j)$. Two functions in a group differ by at most $3\varepsilon/4$ at any point by comparison to a nearby center. Choose a representative of each nonempty group as a ball center.

**Self-check** Explain why there are finitely many groups and why a ball center can be taken from the family.

#### Extract a Cauchy subsequence and take its limit

Total boundedness yields a uniformly Cauchy subsequence. Completeness gives its uniform limit.

**Prompt** Use the finite covers at shrinking scales to construct strictly increasing indices $n_k$. Give an explicit Cauchy estimate.

**Hint** Apply the finite pigeonhole principle to the infinite set of indices retained at the preceding step.

**Reference argument** Set $I_0=\mathbb N$. At radius $r_k=2^{-k}$, some covering ball contains the functions indexed by infinitely many members of $I_{k-1}$. Keep those indices as $I_k$ and choose $n_k\in I_k$ greater than the preceding index. For $i,j\ge k$, both functions lie in the same radius-$r_k$ ball, giving distance at most $2r_k$. Completeness of $C(K)$ gives convergence.

**Self-check** Distinguish infinitely many indices from infinitely many distinct functions. Show increasing indices and the ball diameter bound.

**Transfer** View the family as a subset of C(K). Finite ball covers give a route to relative compactness and show why sampling must be combined with common oscillation bounds.

## Class 27 · Stone–Weierstrass

### Polynomial approximation and lattice gluing

**Source** Handout 27.3 · Rudin Thm. 7.32

**Scope** Handout route

#### Uniform closure is an algebra

$\mathcal B=\overline{\mathcal A}^{\|\cdot\|_\infty}$ is closed under addition, scalar multiplication, and multiplication.

**Prompt** Suppose $u_n,v_n\in\mathcal A$ converge uniformly to $u,v$. Prove that $u_nv_n\to uv$ uniformly. Which sequence needs a common bound?

**Hint** Insert $u_nv$ and use the sup norm.

**Reference argument** Use $\|u_nv_n-uv\|_\infty\le\|u_n\|_\infty\|v_n-v\|_\infty+\|v\|_\infty\|u_n-u\|_\infty$. The tail satisfies $\|u_n\|_\infty\le\|u\|_\infty+1$; include the finitely many initial norms in the bound. Sums and scalar multiples follow from the norm inequalities.

**Self-check** Explain where the common bound comes from and exhibit both error terms.

#### Absolute-value closure · Handout Cor. 26.4

If $u\in\mathcal B$, then $|u|\in\mathcal B$.

**Prompt** Given $u\in\mathcal B$, use Weierstrass approximation to get $P_n\circ u\to|u|$ uniformly. Why control $P_n(0)$?

**Hint** Approximate on $[-\|u\|_\infty,\|u\|_\infty]$, then subtract $Q_n(0)$.

**Reference argument** The case $\|u\|_\infty=0$ is immediate. Otherwise take $Q_n\to |t|$ uniformly on the indicated interval and set $P_n=Q_n-Q_n(0)$. Since $|Q_n(0)|\le\|Q_n-|t|\|_\infty$, the error at most doubles. The zero constant term lets us form $P_n(u)$ from positive powers of $u$ and linear combinations. Uniform convergence and closedness give $|u|\in\mathcal B$.

**Self-check** Check the approximation interval, error bound, zero constant term, and closedness.

#### Finite maxima and minima

$\mathcal B$ is closed under finite pointwise maxima and minima.

**Prompt** For $u,v\in\mathcal B$, express $\max(u,v)$ and $\min(u,v)$ using absolute value and linear operations. Extend the result to finite families.

**Hint** Compare the sign of $u-v$.

**Reference argument** Use $\max(u,v)=(u+v+|u-v|)/2$ and $\min(u,v)=(u+v-|u-v|)/2$. These operations stay in $\mathcal B$, and iteration handles finite families.

**Self-check** Check the opposite signs and explain how to iterate the two-function formulas.

#### Two-point interpolation · Rudin Thm. 7.31

For distinct $x,y\in K$ and any real $a,b$, some $h\in\mathcal A$ satisfies $h(x)=a,\ h(y)=b$.

**Prompt** Use separation and nonvanishing to construct two functions with value pairs $(1,0)$ and $(0,1)$, using the algebra operations.

**Hint** If $s(x)\ne s(y)$, start with $us-s(y)u$.

**Reference argument** Choose $s,u,v\in\mathcal A$ with $s(x)\ne s(y)$, $u(x)\ne0$, and $v(y)\ne0$. Put $U=us-s(y)u,\ V=vs-s(x)v$. Then $U(y)=V(x)=0$ and $U(x)V(y)\ne0$. Take $h=aU/U(x)+bV/V(y)$.

**Self-check** Give both selectors and name the hypotheses that make their denominators nonzero.

#### First finite subcover · global lower bound

For each $x\in K$, some $g_x\in\mathcal B$ satisfies $g_x(x)=f(x)$ and $g_x(z)>f(z)-\varepsilon$ for all $z\in K$.

**Prompt** Fix $x$. Construct an open cover from two-point interpolation. How do you choose an interpolant when the second point is also $x$?

**Hint** Each $y$ should belong to the open set built using $y$.

**Reference argument** Choose $h_y\in\mathcal A$ with $h_y(x)=f(x)$ and $h_y(y)=f(y)$. If $y=x$, scale a member nonzero at $x$. Define $U_y=\{z\in K:h_y(z)>f(z)-\varepsilon\}$. Continuity of $h_y-f$ makes $U_y$ open, and $y\in U_y$, so these sets cover $K$.

**Self-check** Check openness, a witness for each covered point, and the coincident-point case.

**Prompt** Given the finite subcover $U_{y_1},\ldots,U_{y_r}$, construct $g_x$. Prove it preserves the equality at $x$ and the global lower bound.

**Hint** For each $z$, the cover provides an index that can depend on $z$.

**Reference argument** Set $g_x=\max_{j\le r}h_{y_j}\in\mathcal B$. All terms have value $f(x)$ at $x$, giving the equality. For each $z$, some $j$ has $z\in U_{y_j}$, so $g_x(z)\ge h_{y_j}(z)>f(z)-\varepsilon$.

**Self-check** Use all candidates at the anchor and at least one candidate at each other point.

#### Second finite subcover · uniform approximation

For every $\eta>0$, some $g\in\mathcal B$ satisfies $\|f-g\|_\infty<\eta$. Thus $f\in\mathcal B$.

**Prompt** From $g_x(x)=f(x)$ and $g_x>f-\varepsilon$, construct the second cover and the final approximant. How do you ensure $\|f-g\|_\infty<\eta$?

**Hint** Make $x$ belong to its own open set. Start with $\varepsilon=\eta/2$.

**Reference argument** Take $\varepsilon=\eta/2$. The open sets $V_x=\{z:g_x(z)<f(z)+\varepsilon\}$ cover $K$ because $x\in V_x$. For a finite subcover $V_{x_1},\ldots,V_{x_s}$, take $g=\min_{j\le s}g_{x_j}\in\mathcal B$. Every candidate is above $f-\varepsilon$ everywhere, and at each point some candidate is below $f+\varepsilon$. Thus $\|g-f\|_\infty\le\varepsilon<\eta$. Use closedness to conclude.

**Self-check** Check the open cover, the quantifiers for both bounds, the sup norm, and the use of closedness.

**Transfer** With two-point interpolation and closure under finite maxima and minima, both finite-subcover arguments apply as written. This yields an approximation theorem formulated for vector lattices.

### Polynomial recurrence and lattice gluing

**Source** Rudin Ex. 7.23 and HW7, followed by Rudin Thm. 7.32

**Scope** Same hypotheses, with one lemma replaced

#### Uniform closure is an algebra

$\mathcal B=\overline{\mathcal A}^{\|\cdot\|_\infty}$ is closed under addition, scalar multiplication, and multiplication.

**Prompt** Suppose $u_n,v_n\in\mathcal A$ converge uniformly to $u,v$. Prove that $u_nv_n\to uv$ uniformly. Which sequence needs a common bound?

**Hint** Insert $u_nv$ and use the sup norm.

**Reference argument** Use $\|u_nv_n-uv\|_\infty\le\|u_n\|_\infty\|v_n-v\|_\infty+\|v\|_\infty\|u_n-u\|_\infty$. The tail satisfies $\|u_n\|_\infty\le\|u\|_\infty+1$; include the finitely many initial norms in the bound. Sums and scalar multiples follow from the norm inequalities.

**Self-check** Explain where the common bound comes from and exhibit both error terms.

#### Absolute-value closure · Rudin Ex. 7.23

The polynomial recurrence with zero constant term yields $|u|\in\mathcal B$.

**Prompt** Let $P_0(t)=0,\ P_{n+1}(t)=P_n(t)+(t^2-P_n(t)^2)/2$. On $[-1,1]$, find a uniform error bound or give a quantifier proof of uniform convergence.

**Hint** Write $a=|t|$ and factor $a-P_{n+1}$. Split into small $a$ and $a$ bounded away from zero.

**Reference argument** The identity $a-P_{n+1}=(a-P_n)(1-(a+P_n)/2)$ gives $0\le P_n\le P_{n+1}\le a$ by induction. Thus the error is bounded by $a(1-a/2)^n$. For $0<\varepsilon\le1$, the error is below $\varepsilon/2$ when $a<\varepsilon/2$. Otherwise bound it by $(1-\varepsilon/4)^n$, which tends to zero uniformly in that range.

**Self-check** State the induction invariant and choose one cutoff for the whole interval.

**Prompt** Use the recurrence on $[-1,1]$ to show $|u|\in\mathcal B$ for arbitrary $u\in\mathcal B$.

**Hint** For $c=\|u\|_\infty>0$, consider $cP_n(u/c)$.

**Reference argument** Induction gives $P_n(0)=0$, so $cP_n(u/c)\in\mathcal B$. Its error is at most $c\sup_{|t|\le1}|P_n(t)-|t||$, which tends to zero. Use closedness. If $c=0$, then $|u|=0$.

**Self-check** Check the rescaling, the zero-norm case, and why composition stays in the algebra.

#### Finite maxima and minima

$\mathcal B$ is closed under finite pointwise maxima and minima.

**Prompt** For $u,v\in\mathcal B$, express $\max(u,v)$ and $\min(u,v)$ using absolute value and linear operations. Extend the result to finite families.

**Hint** Compare the sign of $u-v$.

**Reference argument** Use $\max(u,v)=(u+v+|u-v|)/2$ and $\min(u,v)=(u+v-|u-v|)/2$. These operations stay in $\mathcal B$, and iteration handles finite families.

**Self-check** Check the opposite signs and explain how to iterate the two-function formulas.

#### Two-point interpolation · Rudin Thm. 7.31

For distinct $x,y\in K$ and any real $a,b$, some $h\in\mathcal A$ satisfies $h(x)=a,\ h(y)=b$.

**Prompt** Use separation and nonvanishing to construct two functions with value pairs $(1,0)$ and $(0,1)$, using the algebra operations.

**Hint** If $s(x)\ne s(y)$, start with $us-s(y)u$.

**Reference argument** Choose $s,u,v\in\mathcal A$ with $s(x)\ne s(y)$, $u(x)\ne0$, and $v(y)\ne0$. Put $U=us-s(y)u,\ V=vs-s(x)v$. Then $U(y)=V(x)=0$ and $U(x)V(y)\ne0$. Take $h=aU/U(x)+bV/V(y)$.

**Self-check** Give both selectors and name the hypotheses that make their denominators nonzero.

#### First finite subcover · global lower bound

For each $x\in K$, some $g_x\in\mathcal B$ satisfies $g_x(x)=f(x)$ and $g_x(z)>f(z)-\varepsilon$ for all $z\in K$.

**Prompt** Fix $x$. Construct an open cover from two-point interpolation. How do you choose an interpolant when the second point is also $x$?

**Hint** Each $y$ should belong to the open set built using $y$.

**Reference argument** Choose $h_y\in\mathcal A$ with $h_y(x)=f(x)$ and $h_y(y)=f(y)$. If $y=x$, scale a member nonzero at $x$. Define $U_y=\{z\in K:h_y(z)>f(z)-\varepsilon\}$. Continuity of $h_y-f$ makes $U_y$ open, and $y\in U_y$, so these sets cover $K$.

**Self-check** Check openness, a witness for each covered point, and the coincident-point case.

**Prompt** Given the finite subcover $U_{y_1},\ldots,U_{y_r}$, construct $g_x$. Prove it preserves the equality at $x$ and the global lower bound.

**Hint** For each $z$, the cover provides an index that can depend on $z$.

**Reference argument** Set $g_x=\max_{j\le r}h_{y_j}\in\mathcal B$. All terms have value $f(x)$ at $x$, giving the equality. For each $z$, some $j$ has $z\in U_{y_j}$, so $g_x(z)\ge h_{y_j}(z)>f(z)-\varepsilon$.

**Self-check** Use all candidates at the anchor and at least one candidate at each other point.

#### Second finite subcover · uniform approximation

For every $\eta>0$, some $g\in\mathcal B$ satisfies $\|f-g\|_\infty<\eta$. Thus $f\in\mathcal B$.

**Prompt** From $g_x(x)=f(x)$ and $g_x>f-\varepsilon$, construct the second cover and the final approximant. How do you ensure $\|f-g\|_\infty<\eta$?

**Hint** Make $x$ belong to its own open set. Start with $\varepsilon=\eta/2$.

**Reference argument** Take $\varepsilon=\eta/2$. The open sets $V_x=\{z:g_x(z)<f(z)+\varepsilon\}$ cover $K$ because $x\in V_x$. For a finite subcover $V_{x_1},\ldots,V_{x_s}$, take $g=\min_{j\le s}g_{x_j}\in\mathcal B$. Every candidate is above $f-\varepsilon$ everywhere, and at each point some candidate is below $f+\varepsilon$. Thus $\|g-f\|_\infty\le\varepsilon<\eta$. Use closedness to conclude.

**Self-check** Check the open cover, the quantifiers for both bounds, the sup norm, and the use of closedness.

**Transfer** The recurrence proves absolute-value approximation directly. The interpolation and gluing steps then apply without first invoking the Weierstrass approximation theorem.
