# Contribution Guidelines

## Source code authorship and provenance

All source code (excluding tests) and commit messages must be authored by a human being without involvement from any LLM or autonomous agent.

This restriction exists to maintain verifiable provenance for every artifact in the repository. LLM training corpora are not fully disclosed by their operators, and output from such models may constitute a derivative work of training data governed by licenses incompatible with this project. Because generated output cannot be traced back to its training sources, any such contribution creates an unresolvable uncertainty over third-party license obligations. This condition — the introduction of content whose licensing obligations have been obscured by passage through a generative model — is referred to here as license washing. The prohibition extends to verbatim use of generated output, structural templates derived from it, and any edits made to it; producing a draft with an LLM and subsequently modifying it constitutes prohibited use under this policy.

### Attestation

By submitting a contribution, the author attests that all source code (excluding tests) and all commit messages in the contribution were produced by that person directly, without LLM or autonomous agent involvement at any stage, and that the author has independently read and understood every change the contribution contains.

### Disclosing LLM or agent assistance in tests

To disclose which LLM or agent assisted in producing a test, add one `Assisted-by` trailer per tool to the commit message, using the model name and version as the value.

The `Co-authored-by` trailer is reserved for **human contributors only**.

Examples:
```plain
Assisted-by: claude-sonnet-4-6
Assisted-by: kimi-k2p5
```
