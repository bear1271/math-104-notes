# Math 104 Real Analysis Notes

Study notes for UC Berkeley Math 104, Fall 2026, by Green (Sirun) Wang. This is an independent study resource. The notes use the course’s class numbering and point back to the relevant published references.

## Interactive Review

[Open the Interactive Review](https://bear1271.github.io/math-104-notes/) on GitHub Pages, or open [docs/index.html](docs/index.html) from a local checkout. The site runs in the browser and includes the class review, practice, proof lab, concept index, dependency map, and labs. Progress is stored in the browser.

The public edition uses original review summaries with source locators. It does not include course handout prose, exams, or photocopied materials. Explain mode offers self-checks on the static site.

To refresh the published snapshot from the local course workspace, run this from the repository root:

```text
node scripts/package-review.cjs "<path to the local Interactive Review folder>"
```

GitHub Pages publishes the static files in the `docs` folder on `main`.

## Notes
- [Concept index](concept-index.md) — 40 definitions and connections to later mathematics.
- [Proof reading notes](proof-reading-notes.md) — route comparisons and the assumptions used at specific steps.
- [Layered proof exercises](layered-proofs.md) — practice for uniform convergence of derivatives, Arzelà–Ascoli, and Stone–Weierstrass.

## References
- Walter Rudin, *Principles of Mathematical Analysis*, 3rd ed., McGraw-Hill, 1976.
- Kenneth A. Ross, *Elementary Analysis: The Theory of Calculus*, 2nd ed., Springer, 2013.
- [*Mathematics in Lean*, Chapter 11: Topology](https://leanprover-community.github.io/mathematics_in_lean/C11_Topology.html).

Rudin, Ross, and the course handout are cited by theorem, exercise, or class number for cross-reference. These notes contain study explanations and exercises, with AI assistance in drafting and organizing them.

## License

Original contributions are offered under [CC BY-SA 4.0](LICENSE.md).
