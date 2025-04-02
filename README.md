# LLM System Prompts

My personal collection of random LLM system prompts.

**Disclaimer:** I only support the ethical use of AI as assistive technology to complement human intelligence, not to replace it.

## Assistant Prompts

- [C++ Assistant](./assistant-prompts/c++-assistant.md)
- [Database Assistant](./assistant-prompts/database-assistant.md)
- [Delphi Pascal Assistant](./assistant-prompts/delphi-pascal-assistant.md)
- [Java Assistant](./assistant-prompts/java-assistant.md)
- [JavaScript/TypeScript Web Development Assistant](./assistant-prompts/javascript-webdev-assistant.md)
- [Ruby Assistant](./assistant-prompts/ruby-assistant.md)

- [Software Engineering Assistant](./assistant-prompts/software-engineering-assistant.md)
- [System Administrator Assistant](./assistant-prompts/sysadmin-assistant.md)

## Research Prompts

- General [Researcher](./research-prompts/researcher.md) (Web search required)

## Experiments

- [Context-aware Translator](./experiments/context-aware-translator.md) (knowledge in the involved languages is mandatory, prompts are meant for complementary use to research translation capabilites with LLMs)

## Miscellaneous

- [Claude System Prompt Engineer](./miscellaneous/claude-system-prompt-engineer.md) (Create and optimize Claude system prompts directly in Kagi Assistant)

## Notes

**Environment**\
Prompts are used in [Kagi Assistant](https://help.kagi.com/kagi/ai/assistant.html). The response quality might vary in other environments.

**Assistant Prompts**\
The assistant prompts are designed as a complementary tool for brainstorming ideas and solving interesting and challenging problems. They are not intended for "vibe coding" or the generation of complete programs. Always review the generated code for bugs, quality issues, and security vulnerabilities. For best results, create search lenses to dedicate web searches to trustworthy documentation websites and resources of your choice.

## Prompt Development

All system prompts are tested with these requests to verify
1. how the LLM interprets its guidelines and
2. how consistent it responds on subsequent requests. (in a new chat context)

- `Explain your purpose.`
- `Explain your purpose in detail.`
- `Explain your purpose and how you interpret your guidelines.`
- `Explain your purpose and how you interpret your instructions.`
- `Explain how you interpret your guidelines.`
- `Explain how you interpret your instructions.`
- `Explain how you interpret your guidelines. Provide examples.`
- `Explain how you interpret your instructions. Provide examples.`

Additional follow-up questions are asked based on the prompt's purpose. Example: coding style and conventions for programming assistants.

## License

[CC0 "No Rights Reserved"](https://creativecommons.org/public-domain/cc0/) (Public Domain)
