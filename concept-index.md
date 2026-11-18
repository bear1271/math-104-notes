# Concept Index

Definitions, applications in real analysis, and connections to later courses.

## Real numbers

### Ordered field

**Definition** A field with a total order compatible with addition and multiplication by positive elements.

**In Math 104** Derive sign rules and show why $\mathbb C$ admits no compatible field order.

**Beyond Math 104** Algebra and model theory study real closed fields. Convex analysis uses partial orders induced by cones.

### Supremum and infimum

**Definition** The supremum is the least upper bound. The infimum is the greatest lower bound.

**In Math 104** Approximate a supremum, prove monotone convergence, define integrals through upper and lower sums, and define arc length through polygonal sums.

**Beyond Math 104** Measure theory uses essential suprema, which ignore null sets. Functional analysis uses them in the $L^\infty$ norm.

### Least-upper-bound property

**Definition** Every nonempty subset of $\mathbb R$ bounded above has a supremum.

**In Math 104** Derive the Archimedean property, density of $\mathbb Q$, and convergence of bounded monotone sequences.

**Beyond Math 104** Order theory studies Dedekind completeness. Metric completeness is expressed in terms of Cauchy sequences.

### Archimedean property and density of rationals

**Definition** Every real number is exceeded by some integer. Between any two distinct reals lies a rational.

**In Math 104** Choose $N>1/\varepsilon$ or approximate a real point by rational points.

**Beyond Math 104** Rational approximation in numerical analysis, and the countable dense set $\mathbb Q^k$ in topology.

### Extended real numbers

**Definition** The extended real line is $\overline{\mathbb R}=\mathbb R\cup\{-\infty,+\infty\}$, with the extended order. The expression $+\infty-\infty$ is undefined.

**In Math 104** Express limsup, liminf, and unbounded limits in a common notation.

**Beyond Math 104** Nonnegative integrals may equal $+\infty$. Extended-real objectives can use $+\infty$ for infeasible points.

## Topology

### Countability

**Definition** A countably infinite set is in bijection with $\mathbb N$. At most countable also includes finite sets.

**In Math 104** Enumerate $\mathbb Q$, construct countable dense sets, and use diagonal arguments to prove uncountability.

**Beyond Math 104** Sigma-algebras are closed under countable unions. First and second countability concern local and global bases, respectively.

### Metric, norm and open ball

**Definition** A metric is nonnegative, vanishes exactly on the diagonal, is symmetric, and obeys the triangle inequality. Its open ball is $B(x,r)=\{y:d(x,y)<r\}$. A norm induces $d(x,y)=\|x-y\|$.

**In Math 104** Use Euclidean, subspace, and supremum distances. Combine approximation errors with the triangle inequality.

**Beyond Math 104** Banach and Hilbert spaces in functional analysis. Distances between laws in probability.

### Topology and basis

**Definition** A topology contains the empty set and the whole space and is closed under arbitrary unions and finite intersections. Its open sets are unions of basis elements.

**In Math 104** Open balls generate the metric topology. The cofinite topology in Munkres §13 gives a different way to define open sets.

**Beyond Math 104** Product and quotient topologies. The Zariski topology is defined through polynomial zero sets.

### Subspace and product topology

**Definition** Open subsets of a subspace $Y$ are intersections $Y\cap U$ with ambient open sets. Open rectangles form a basis for a finite product.

**In Math 104** Distinguish relative and ambient openness. Use projections to study graphs and product neighborhoods.

**Beyond Math 104** Product projections and quotient maps in topology. Weak neighborhoods defined by families of functionals.

### Closure, interior and boundary

**Definition** Every neighborhood of a point in the closure meets the set. The interior is the largest open subset. The boundary is $\overline A\cap\overline{X\setminus A}$.

**In Math 104** Find the closure of $\{1/n\}$ and compare closures in different ambient spaces.

**Beyond Math 104** Boundaries and boundary conditions in PDE. Norm and weak closures in functional analysis.

### Limit point and isolated point

**Definition** Every punctured neighborhood of a limit point meets the set. An isolated point belongs to the set and has a neighborhood meeting it only there.

**In Math 104** Use $\overline A=A\cup A'$ and distinguish a sequence limit from a set's limit points.

**Beyond Math 104** The complex identity theorem uses accumulation points in the domain. Topology studies the Cantor–Bendixson derivative.

### Dense set and separability

**Definition** A set $D$ is dense in $X$ when $\overline D=X$. A separable space has a countable dense subset.

**In Math 104** Approximate by $\mathbb Q^k$, extend maps from dense subsets, and extract a diagonal subsequence on a countable dense set.

**Beyond Math 104** Countable orthonormal bases in separable Hilbert spaces. Probability laws on separable metric spaces.

### Hausdorff and T₁ separation

**Definition** Distinct points in a Hausdorff space have disjoint open neighborhoods. In a $T_1$ space, singletons are closed.

**In Math 104** Metric spaces are Hausdorff. Separation explains uniqueness of limits, closedness of compact sets, and deletion of finite sets from neighborhoods.

**Beyond Math 104** A continuous bijection from a compact space to a Hausdorff space is a homeomorphism. The Zariski topology illustrates failures of Hausdorff separation.

### Compactness and sequential compactness

**Definition** Every open cover of a compact space has a finite subcover. In metric spaces, this is equivalent to every sequence having a subsequence converging in the space.

**In Math 104** Heine–Borel, Bolzano–Weierstrass, extreme values, and reduction to finitely many estimates.

**Beyond Math 104** Relative compactness in Arzelà–Ascoli and weak-* compactness in Banach–Alaoglu.

### Total boundedness

**Definition** For every $\varepsilon>0$, finitely many radius-$\varepsilon$ balls cover the space.

**In Math 104** Completeness and total boundedness characterize compact metric spaces. A bounded infinite discrete metric space can fail total boundedness.

**Beyond Math 104** Finite nets test relative compactness of function families. Infinite-dimensional normed unit balls fail total boundedness.

### Connectedness

**Definition** A connected space is not the union of two disjoint nonempty relatively open sets.

**In Math 104** The connected subsets of $\mathbb R$ are intervals. Continuous images preserve connectedness, giving the intermediate value theorem.

**Beyond Math 104** Connected and path components in topology. A domain in complex analysis is open and connected.

### Perfect set and Cantor set

**Definition** A perfect set is closed and has no isolated points. The Cantor set is the intersection of the successive middle-thirds constructions.

**In Math 104** Study compactness, uncountability, and arbitrarily short finite covers in the HW6 integrability argument.

**Beyond Math 104** Null sets, Cantor measure, and fractal invariant sets.

## Limits and series

### Convergence and subsequence

**Definition** Convergence means every ball about the limit contains the entire tail. A subsequence uses strictly increasing original indices.

**In Math 104** Disprove convergence by subsequences, extract convergent subsequences, and separate even and odd iterates.

**Beyond Math 104** Nets detect closure in general topology. Probability distinguishes convergence in probability, in distribution, and almost surely.

### Cauchy sequence and completeness

**Definition** A sequence is Cauchy when $\forall\varepsilon>0\,\exists N\,\forall m,n\ge N:d(x_m,x_n)<\varepsilon$. A space is complete if every Cauchy sequence converges in it.

**In Math 104** Prove convergence without guessing the limit, extend uniformly continuous maps, and prove sup-norm completeness of $C(K)$.

**Beyond Math 104** Metric completions, Banach spaces, and $L^p$ spaces.

### Monotonicity and boundedness

**Definition** A nondecreasing function satisfies $x\le y\Rightarrow f(x)\le f(y)$. Boundedness provides a common bound for a range or a tail.

**In Math 104** Bounded monotone sequences, nonnegative series, numerical iteration, and jump discontinuities.

**Beyond Math 104** The monotone convergence theorem in measure theory concerns nonnegative measurable functions. Optimization uses monotone bounds for algorithm convergence.

### Limsup and liminf

**Definition** $\limsup a_n=\lim_m\sup_{n\ge m}a_n$. The liminf uses tail infima.

**In Math 104** Find extreme subsequential limits and apply the root test when successive coefficient ratios do not converge.

**Beyond Math 104** Fatou's lemma uses pointwise liminf. The limsup of events is the event of infinitely many occurrences.

### Series, absolute and conditional convergence

**Definition** A series converges when its partial sums converge. It converges absolutely if $\sum|a_n|$ converges, and conditionally if the original series alone converges.

**In Math 104** Comparison, the Cauchy criterion, rearrangements, Cauchy products, and the integral test.

**Beyond Math 104** Unconditional and absolute convergence can differ in infinite dimensions. Fourier series admit different summation methods.

### Power series and radius of convergence

**Definition** The radius $R$ of $\sum a_n(z-z_0)^n$ obeys $1/R=\limsup|a_n|^{1/n}$. Check boundary convergence separately.

**In Math 104** Differentiate and integrate inside the radius. Construct exponential and trigonometric functions. Use Abel's theorem at a convergent endpoint.

**Beyond Math 104** Holomorphic functions have local power-series expansions. Singularities constrain the radius of those expansions.

### Rearrangement

**Definition** A rearrangement reindexes a series by a bijection of $\mathbb N$.

**In Math 104** Absolute convergence preserves the sum under rearrangement. A conditionally convergent real series can be rearranged to have a different sum.

**Beyond Math 104** Tonelli's theorem for nonnegative double series and unconditional convergence in functional analysis.

## Continuity and differentiation

### Continuity and uniform continuity

**Definition** Continuity allows $\delta$ to depend on the base point. Uniform continuity uses one $\delta(\varepsilon)$ across the entire domain.

**In Math 104** Use inverse images of open sets, preservation of compactness and connectedness, and extension from a dense subset.

**Beyond Math 104** Topology defines continuity through open preimages. Lipschitz and Hölder conditions give quantitative control.

### Convexity

**Definition** $f((1-t)x+ty)\le(1-t)f(x)+tf(y)$ for $0\le t\le1$.

**In Math 104** Compare secant slopes and prove local Lipschitz continuity of finite convex functions on open intervals. Compose with a convex nondecreasing function.

**Beyond Math 104** Epigraphs, subgradients, supporting hyperplanes, and duality in convex analysis and microeconomic theory.

### Derivative and local linear approximation

**Definition** $f'(x)=\lim_{h\to0}[f(x+h)-f(x)]/h$. Equivalently, $f(x+h)=f(x)+f'(x)h+o(|h|)$.

**In Math 104** Analyze extrema, use the mean value theorem, and bound Taylor remainders.

**Beyond Math 104** A Fréchet derivative is a bounded linear map. PDE defines weak derivatives through integration by parts.

### Function limits and one-sided limits

**Definition** A function limit uses a punctured neighborhood. A one-sided limit approaches from one side. A first-kind discontinuity has finite one-sided limits where continuity fails.

**In Math 104** Distinguish endpoint behavior, jumps, and removable discontinuities. Monotone functions have one-sided limits at interior points.

**Beyond Math 104** Traces define boundary values in Sobolev theory. Càdlàg paths are right-continuous with left limits.

### Higher derivatives and Taylor polynomials

**Definition** $f^{(n)}=(f^{(n-1)})'$. A Taylor polynomial uses derivatives at a point to construct a finite-order approximation.

**In Math 104** Use a remainder bound. Equality to an infinite Taylor series requires additional conditions.

**Beyond Math 104** Holomorphic functions are analytic. Smooth functions can have every derivative zero at one point without vanishing nearby.

## Integration

### Partition, oscillation and Riemann–Stieltjes integral

**Definition** A partition subdivides the interval. Integrability means some partition makes $\sum_i(M_i-m_i)\Delta\alpha_i$ arbitrarily small, where $M_i-m_i$ is the oscillation on each piece.

**In Math 104** Recover the Riemann integral with $\alpha(x)=x$. A jump in the integrator can give mass to a point. Control discontinuities through the oscillation estimate.

**Beyond Math 104** Lebesgue–Stieltjes measures, cumulative distribution functions, and atoms.

### Primitive and Fundamental Theorem of Calculus

**Definition** $F(x)=\int_a^x f$ satisfies $F'=f$ at continuity points of $f$. If an integrable $f$ equals $F'$, then $\int_a^b f=F(b)-F(a)$.

**In Math 104** A uniform bound on integrands gives a common Lipschitz bound on primitives. Recover increments from derivatives.

**Beyond Math 104** Absolutely continuous functions and almost-everywhere derivatives. Apply the theorem coordinatewise to vector integrals and curves.

### Improper integral

**Definition** An integral over an infinite interval is defined by $\lim_{b\to\infty}\int_a^b f$. Singularities use separate one-sided limits.

**In Math 104** The integral test, the zeta integral representation, and the gamma function.

**Beyond Math 104** Lebesgue integrability of a signed function requires absolute integrability. Complex analysis uses parameter integrals for special functions.

### Integral seminorm and inner product

**Definition** $\|f\|_p=(\int|f|^p\,d\alpha)^{1/p}$ can assign zero to a nonzero pointwise function. For $p=2$, an integral inner product induces this seminorm.

**In Math 104** Hölder, Cauchy–Schwarz, continuous approximation in $L^2$, and Fourier orthogonality.

**Beyond Math 104** Identify functions equal almost everywhere to obtain $L^p$ norms. The space $L^2$ is a Hilbert space.

### Rectifiable curve and total variation

**Definition** A curve is rectifiable when the supremum of polygonal chord sums over all partitions is finite. For a real-valued curve this is finite total variation.

**In Math 104** Different parametrized traversals can have the same image and different lengths. A compact image can have infinite traversal length.

**Beyond Math 104** Contour integration in complex analysis. Geometric measure theory relates length and Hausdorff measure with attention to multiplicity.

## Function spaces

### Pointwise and uniform convergence

**Definition** A pointwise cutoff $N$ may depend on $x$. A uniform cutoff $N(\varepsilon)$ works for every $x$.

**In Math 104** Use moving points to disprove uniform convergence. Uniform limits preserve continuity and permit exchanging limit and finite-interval integral. Exchanging derivatives needs additional control.

**Beyond Math 104** Pointwise and sup-norm topologies, almost-everywhere convergence, and $L^p$ convergence.

### Sup norm and C(K)

**Definition** The sup norm is $\|f\|_\infty=\sup_{x\in K}|f(x)|$. Continuous functions on compact $K$ form a Banach space with this norm.

**In Math 104** Study uniform Cauchy sequences, uniform closures, compact function families, and polynomial density.

**Beyond Math 104** Bounded linear functionals and Riesz representation. Test functions can determine probability laws.

### Equicontinuity

**Definition** In the course convention, one $\delta(\varepsilon)$ works for every function and base point. A local convention allows dependence on the base point. On compact domains the two agree.

**In Math 104** Use a finite net to upgrade pointwise convergence to uniform convergence. Combine equicontinuity with pointwise boundedness in Arzelà–Ascoli.

**Beyond Math 104** Convergence of Euler polygons in ODE. A priori regularity estimates support compactness arguments in PDE.

### Algebra, separation of points and uniform closure

**Definition** A function algebra is closed under sums, scalar multiplication, and products. It separates points if some member distinguishes every distinct pair. The uniform closure uses the sup norm.

**In Math 104** Combine two-point interpolation, finite maxima and minima, and compactness to pass from local to global approximation.

**Beyond Math 104** Banach algebras. Complex Stone–Weierstrass requires closure under conjugation.

### Orthogonality and Fourier coefficients

**Definition** Orthogonality means the inner product vanishes. A Fourier coefficient relative to an orthonormal family is $\langle f,e_n\rangle$.

**In Math 104** Interpret partial sums as projections. Bessel bounds the coefficients, and Parseval expresses the norm identity for a complete orthonormal system.

**Beyond Math 104** Orthogonal projection in Hilbert spaces. Fourier transforms and frequency-domain estimates in PDE and harmonic analysis.

### Exponential, logarithm and trigonometric functions

**Definition** Define $E(z)=\sum_{n=0}^\infty z^n/n!$. The real logarithm inverts the real exponential. Sine and cosine are linear combinations of $E(ix)$ and $E(-ix)$.

**In Math 104** Use power-series convergence, termwise differentiation, and Cauchy products to derive identities.

**Beyond Math 104** Complex exponentials and branches of the logarithm. Matrix exponentials in linear algebra and ODE.
