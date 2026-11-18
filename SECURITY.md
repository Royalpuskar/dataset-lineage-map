# Security and privacy

Use synthetic or non-sensitive text. The application has no backend, telemetry, accounts, or runtime third-party scripts. Inputs are rendered with textContent and never evaluated. Recipe text cannot execute transformations. All state is in page memory. Evidence exports intentionally contain the full model, including artifact content; review them before sharing.

SHA-256 comparisons detect differences relative to a supplied baseline, not authenticity. Someone who can edit the baseline can replace both data and fingerprints. A production integration needs authenticated manifests, declared dependency review, durable storage and independent execution evidence.

Report reproducible bugs in repository issues using synthetic fixtures. Do not include passwords, real datasets or private records.
