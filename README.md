# LLM System Prompts

My personal collection of random LLM system prompts.

## Assistant Prompts

- [C++ Assistant](./assistant-prompts/c++-assistant.md) (RAG enabled)
- [Database Assistant](./assistant-prompts/database-assistant.md) (RAG enabled)
- [Delphi Pascal Assistant](./assistant-prompts/delphi-pascal-assistant.md) (RAG enabled)
- [Java Assistant](./assistant-prompts/java-assistant.md) (RAG enabled)
- [JavaScript/TypeScript Web Development Assistant](./assistant-prompts/javascript-webdev-assistant.md) (RAG enabled)
- [Ruby Assistant](./assistant-prompts/ruby-assistant.md) (RAG enabled)

- [Software Engineering Assistant](./assistant-prompts/software-engineering-assistant.md) (RAG enabled)
- [System Administrator Assistant](./assistant-prompts/sysadmin-assistant.md) (RAG enabled)

## Research Prompts

- General [Researcher](./research-prompts/researcher.md) (RAG content required)

## Experiments

- [Context-aware Translator](./experiments/context-aware-translator.md) (RAG enabled, knowledge in the involved languages is mandatory, prompts are meant for supplementary use to research translation capabilites with LLMs)

## Miscellaneous

- [Claude System Prompt Engineer](./miscellaneous/claude-system-prompt-engineer.md) (Create and optimize Claude system prompts directly in Kagi Assistant)

## Notes

**Environment**\
Prompts are used in [Kagi Assistant](https://help.kagi.com/kagi/ai/assistant.html). The response quality might vary in other environments.

**RAG content**\
For best results with the assistant prompts, create proper search lenses to scope web searches to trustworthy documentation websites and forums of your choice.

**Assistant Prompts**\
The assistant prompts are meant to only assist you with your programming tasks and help you brainstorm ideas and concepts. Always verify and try to understand the output. They are not meant to generate entire components and applications for you (aka "vibe coding").

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
