# LLM System Prompts

My personal collection of random LLM system prompts and some complementary tooling.

**Stance:** LLMs are programmable tools and must be treated as such. This technology complements human programmers, it does not replace them. Therefore I only support the ethical use of this technology. The programmer who operates such tools is fully responsible for their outcome. A machine cannot be held accountable.

## Notes

- I only share some of my prompts in this public repository.
- Prompts are currently used in:
  - [Pi](https://github.com/earendil-works/pi) with a small custom patch (mainly around how system prompts are handled) and a custom system prompt extension that suits my exact needs.
- Prompts depend on the [Kagi](https://kagi.com) Search and Extract API to replace [Kagi Assistant's](https://help.kagi.com/kagi/ai/assistant.html) `ResearchAgent`.\
  The corresponding Pi plugin can be found in [pi-ext/custom-tools/kagi.ts](./pi-ext/custom-tools/kagi.ts).\
  My current LLM-based research setup works surprisingly well, if not even better than in Kagi Assistant.
- Some commits and changes in this repository were assisted by Claude Sonnet of varying versions. Many of them are just prompts; see [tools/claude-prompt-engineer.md](./tools/claude-prompt-engineer.md) on how prompts are drafted.

## Deprecated

- The use in Kagi Assistant is deprecated, as this product no longer supports my workflows and needs. Managing my collection of prompts became too tedious with the 2026-06 UI/UX overhaul.
- 2026-07-01: `kagimcp` was replaced by my own Pi plugin [pi-ext/custom-tools/kagi.ts](./pi-ext/custom-tools/kagi.ts). It is way smaller, does not depend on Python, and allows me to remove the Pi MCP client plugin I had installed specifically only for Kagi.
