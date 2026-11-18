# Dataset Lineage Map

An inspectable data-dependency workbench. Record a baseline, change a source or transformation description, and see which downstream artifacts need review.

## Website

[Open Dataset Lineage Map](https://royalpuskar.github.io/dataset-lineage-map/)

## Why it exists

A published table can look unchanged even when its source dataset or cleaning method has changed. This project makes that dependency visible by comparing content and recursively derived lineage fingerprints against a recorded reference.

## Implemented features

- SHA-256 fingerprints of UTF-8 text content and recipe descriptions.
- Recursive lineage signatures incorporating every declared parent signature.
- Topological review order with explanations for changed content, recipes, and dependencies.
- Detection of new and removed artifacts; rejection of cycles, missing parents, duplicate IDs and duplicate edges.
- Per-artifact editor, full JSON model editor, baseline controls, and evidence export.
- Responsive interface with large-screen breakpoints, accessible labels, and no external runtime dependencies.

## Run and test

Use Node.js 22+ for tests. Serve the application over HTTPS or localhost for Web Crypto.

```sh
node --test test.mjs
python3 -m http.server 8000
```

Open `http://localhost:8000`. There is no installation step, API key, or account. The GitHub Actions workflow runs the test suite on push and pull request.

## Reproduce the change-impact experiment

The sample baseline contains a synthetic survey, a dictionary, cleaned data, a summary, a report, and an independent reference. Add a row to the survey and choose **Compare with baseline**. The survey, cleaned data, summary, and report require review; the dictionary and independent reference remain unchanged. Change only the cleaning recipe to see its downstream effects. Reset restores the synthetic example.

**Record current baseline** accepts the current data as a new comparison reference. It does not rebuild any artifact or validate whether the results are correct. Review and rerun your real transformation pipeline first.

## Architecture and model

`engine.mjs` validates the DAG, orders dependencies, computes fingerprints and compares snapshots. `sample.mjs` supplies fictional text artifacts. `app.mjs` implements browser editing and reports without a backend. `test.mjs` tests ten behavior groups, including a standard SHA-256 test vector, transitive propagation, order invariance, invalid graphs and input immutability.

```json
{"nodes":[
  {"id":"raw","parents":[],"recipe":"source v1","content":"x\n1"},
  {"id":"table","parents":["raw"],"recipe":"copy x","content":"x\n1"}
]}
```

Node IDs use letters, numbers, underscores and hyphens, up to 64 characters. Parent order and node order are not semantically significant. Text whitespace and line endings are significant. Node IDs, recipes, output content and parent signatures all contribute to the lineage signature. Recipe descriptions are metadata, never executed as code.

The engine accepts 1–150 nodes, up to 30 parents per node, content up to 100000 characters per node and one million characters total. Recipes are limited to 2000 characters. The browser JSON editor is limited to 1.2 million characters. The comparison API expects a baseline returned by `snapshot`; importing arbitrary baselines is unsupported.

## Privacy and limitations

Inputs stay in page memory; reload clears the experiment. Exports include full artifact content and descriptions as well as hashes. No files are uploaded, no URLs fetched, and no transformations executed. Hosting receives normal page requests.

This is a change-impact prototype, not proof of provenance, authorship, freshness, correctness, or reproducibility. It only sees declared dependencies. It does not detect missing real-world dependencies or prove that an unchanged downstream output was regenerated. Hashes are not signatures; an editable baseline is not a trusted anchor. Only UTF-8 text artifacts are modeled, not arbitrary binary files.

## Roadmap

Local binary-file hashing, signed baseline receipts, transformation-run evidence, and integration with actual pipeline runners. These features are not yet implemented.

## Copyright

© 2026 Puskar (Royalpuskar). All rights reserved except permissions granted by the [MIT License](LICENSE). See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
