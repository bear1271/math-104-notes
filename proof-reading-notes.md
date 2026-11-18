# Proof Reading Notes

Compare proof routes and identify where conditions and earlier results enter. Class numbers follow the Fall 2026 UC Berkeley Math 104 course.

## Class 5 · Heine–Borel

### Handout 5.6 and Rudin Thms. 2.38–2.41

**Scope** Subsets of Euclidean space

**Route** The handout highlights the bisection argument. Rudin supplies the preceding interval and nested-cell lemmas, then connects compactness, closedness and boundedness, and the limit-point property.

### Conditions used at specific steps

- **Establish existence of a common point**. Apply the least-upper-bound property to the nested coordinate intervals. The diameter estimate gives uniqueness once existence has been shown.

- **Pass from a cell to the set**. Boundedness puts the set in one Euclidean cell. Closedness in the ambient space gives relative closedness in that compact cell.

### Reading checks

- **Where does the common point come from?** (Rudin 2.38–2.40). The diameter estimate gives at most one common point. Existence comes from the least-upper-bound argument for nested closed intervals applied coordinate by coordinate.

- **What does a bad cell mean?** (Handout 5.6 and Rudin 2.40). Each cell is covered by the original open cover. A bad cell is one that no finite subfamily covers. If every subcell had a finite subcover, their finite union would cover the parent.

- **Why is the set of selected points infinite?** (Rudin 2.41(c) ⇒ (a)). In the unbounded case every bounded ball contains only finitely many selected terms. In the nonclosed case choose $x_n$ outside the missing point, with $x_n\to x_0$; no finite set avoiding $x_0$ could contain the whole sequence.

## Class 8 · Cauchy convergence

### Handout 8.2

**Scope** Compact metric spaces and Euclidean space

**Route** In the compact case, extract a convergent subsequence and use the Cauchy property to control the entire tail. For Euclidean space, first bound the sequence and place it in a compact box.

### Rudin Thm. 3.11(b)–(c)

**Scope** Same scope, different compact-space proof

**Route** Intersect the nested closures of the Cauchy tails. Their diameters tend to zero. In Euclidean space, take the compact closure of the bounded range.

### Ross §10, Lemma 10.10 and Thm. 10.11

**Scope** Real sequences

**Route** Bound the sequence, compare the tail supremum and infimum, and use their equality in the limit. Ross identifies where the completeness axiom enters.

### Conditions used at specific steps

- **Control the whole tail**. Choose the Cauchy cutoff before selecting one convergent subsequence term beyond it. The same term controls every remaining index.

- **Apply the nested compact set theorem**. In Rudin's version, closing the tails makes them compact in the compact ambient space. The diameter is unchanged by closure (Rudin 3.10(a)).

### Reading checks

- **“The tail is trapped”** (Handout 8.2). Pick the Cauchy cutoff first. Choose one subsequence term beyond it and within the remaining error of the limit. That one term works for every original index beyond the cutoff.

- **Why take closures?** (Rudin 3.10(a), 3.11(b)). Closed tails are compact subsets of the compact domain. Closure preserves the diameter by 3.10(a), so the shrinking-diameter argument still applies after taking closures.

- **From one bound to two extrema** (Ross 10.11). For each fixed $m>N$, $s_m+\varepsilon$ bounds every $s_n$ with $n>N$. Taking the supremum in $n$ gives $v_N\le s_m+\varepsilon$ for every $m>N$. Only then take the infimum in $m$.

## Class 14 · Heine–Cantor

### Handout 14.6 and Rudin Thm. 4.19

**Scope** Compact metric domain

**Route** Use half-radius balls for the finite cover and full-radius balls for the two continuity estimates.

### Ross Thm. 19.2 and Rudin Ex. 4.10

**Scope** Ross states the closed-interval case. Rudin assigns the compact metric argument.

**Route** Negate uniform continuity, choose nearby pairs with separated images, and extract a convergent subsequence from the first coordinates.

### Mathematics in Lean §11.2.4

**Scope** Same scope, different use of compactness

**Route** Fix the output tolerance. In the compact product domain, consider the closed set of pairs violating that tolerance. Minimize input distance over that set.

### Conditions used at specific steps

- **Choose one positive radius**. Continuity gives a positive radius at each point. Compactness reduces the half-radius cover to finitely many radii, whose minimum is positive. The triangle inequality puts the second point inside a full-radius ball.

### Reading checks

- **Two different radii** (Rudin 4.19, equations (4.17)–(4.19)). The cover identifies a center within half its radius of the first point. The common $\delta$ supplies the remaining margin for the second point to stay in the full ball. Rudin explicitly explains why the finite minimum is positive.

- **Two sequences, one set of indices** (Ross 19.2 and Rudin Ex. 4.10). After $x_{n_k}\to x$, retain the same indices on $y_{n_k}$. The input distances tend to zero, so the second subsequence has the same limit. The output separation is bounded below by one fixed $\varepsilon$ throughout.

- **Why is the attained minimum positive?** (Mathematics in Lean §11.2.4). Each bad pair has distinct coordinates because $\varepsilon>0$. The attained minimum is the distance of one bad pair and is therefore positive. An empty bad-pair set allows any positive radius.

## Class 18 · Riemann–Stieltjes Cauchy criterion

### Handout 18.3 and Rudin Thms. 6.4–6.6

**Scope** Riemann–Stieltjes integrability for an increasing integrator

**Route** The handout gives the criterion. Rudin brackets the two integrals by the partition sums and uses a common refinement of partitions chosen separately for the upper and lower bounds.

### Ross Thms. 32.5 and 35.6

**Scope** Thm. 32.5 is the ordinary Riemann case. Thm. 35.6 uses increasing integrator $F$.

**Route** Ross writes the common-refinement argument in §32 and sends the reader back to that argument in §35. Carry the increment $F(t_i)-F(t_{i-1})$ through the refinement estimates.

### Conditions used at specific steps

- **Refine both partitions**. The increasing integrator gives nonnegative weights. That sign permits refinement to raise lower sums and lower upper sums. Boundedness of the integrand keeps the upper and lower integral values finite.

### Reading checks

- **Which partitions move in which direction?** (Rudin 6.5–6.6 and Ross 32.5). Choose the lower and upper approximants independently by the supremum and infimum properties. The union partition can only raise the lower sum and lower the upper sum. Keep their roles distinct in the inequality $L(P_1)\le L(P)\le U(P)\le U(P_2)$.

- **What justifies reusing the Riemann proof?** (Ross 35.6, referring back to 32.5). The argument uses refinement monotonicity and the upper–lower ordering, which also hold for the Stieltjes sums. The weight is a nonnegative integrator increment because the integrator is increasing.

## Class 18 · Integrability with finitely many discontinuities

### Handout 18.5 and Rudin Thms. 6.8, 6.10

**Scope** Bounded $f$ with finitely many discontinuities, with increasing $\alpha$ continuous at those points

**Route** The handout states the result. Rudin isolates each discontinuity, then uses the oscillation estimate from 6.8 on the remaining compact set.

### Conditions used at specific steps

- **Split the error across intervals**. Finiteness allows a finite error budget. Continuity of the integrator at the bad points controls the total increment there, and boundedness of the integrand controls its oscillation. Remove relatively open neighborhoods, including one-sided ones at bad endpoints, before using compactness and uniform continuity on the remaining set.

### Reading checks

- **What is small near a discontinuity?** (Rudin 6.10). The bad interval needs a small $\alpha$-increment. Its ordinary length is useful because continuity of $\alpha$ at the bad point lets us make that increment small. Finiteness lets us allocate a fraction of the total error to each bad point and choose disjoint intervals.

- **Which set is compact and carries continuous \(f\)?** (Rudin 6.10, endpoint clarification). Remove neighborhoods open relative to $[a,b]$. If an endpoint is bad, remove a one-sided neighborhood containing it, such as $[a,v)$. Removing just $(a,v)$ would leave the bad endpoint in the set on which uniform continuity is invoked.

- **Why split the sum?** (Rudin 6.8 and 6.10). On the good intervals the oscillation is small and the increments sum to at most $\alpha(b)-\alpha(a)$. On the bad intervals use the bound $2\sup|f|$ on the oscillation and the previously chosen small total increment.

## Class 21 · Uniform Cauchy criterion

### Handout 21.4 and Rudin Thm. 7.8

**Scope** Numerical functions on a common domain

**Route** The handout states the uniform Cauchy condition. Rudin obtains a pointwise limit by numerical completeness, then passes to the limit in a bound with a common cutoff.

### Mathematics in Lean §11.2.5

**Scope** Supporting lemma at a fixed point

**Route** The chapter separates the metric Cauchy condition from the convergence theorem for complete targets. Apply that latter step to the numerical sequence at a fixed point. Uniformity still comes from the original common cutoff.

### Conditions used at specific steps

- **Take pointwise limits while retaining one cutoff**. Scalar completeness gives a limit at each point. The common cutoff is fixed before the point is chosen, so it remains uniform after the pointwise limit.

### Reading checks

- **Which completeness is used?** (Rudin 7.8, citing 3.11). For each $x$, the scalar sequence $f_n(x)$ is Cauchy and converges in the complete scalar field. The hypothesis gives the same cutoff for all $x$ before those limits are defined.

- **Why does a pointwise limit give a uniform bound here?** (Rudin 7.8, (7.13)–(7.14)). Choose $N$ before fixing $n\ge N$ and $x$. Pass $m$ to infinity with those choices fixed. Continuity of absolute value preserves the weak inequality, and the resulting bound still uses the same $N$ for every $x$.

## Class 23 · Uniform convergence of derivatives

### Conditions used at specific steps

- **Control increments, constants, and quotients**. Differentiability gives the conditions for the mean value estimate. The anchor controls additive constants. Uniform convergence of the difference quotients licenses the limit exchange.

## Class 25 · Arzelà–Ascoli

### Conditions used at specific steps

- **Choose the subsequence and control it uniformly**. Compactness gives finite nets and a countable dense set. Pointwise boundedness supplies subsequences for diagonal extraction, and equicontinuity gives a common radius for the upgrade to uniform convergence.

## Class 27 · Stone–Weierstrass

### Conditions used at specific steps

- **Check the algebra and the two finite covers**. Zero constant terms allow polynomial composition without assuming the algebra contains constants. Separation and nonvanishing enable interpolation. Real-valuedness gives the order for maxima and minima, and compactness makes those operations finite.
