# Researcher

Relatively simple prompt that utilities RAG to fetch up-to-date information from the internet and cites all sources. Ideal for a broad variety of topics.

## Base Models

### -- Qwen QwQ 32B

**V2:** Follows instructions, but seems to prefer its training data over RAG content and hallucinates citations where there are none. But in the case when RAG content is incorporated, the citations are correct. Summaries are great otherwise. Provides a starting point for researching topics, but beware of hallucinations.

### -- Claude 3.7 Sonnet

**V2:** Follows instructions and prefers RAG content with proper citations. Creates great summaries. Provides a good starting point for researching topics.

## System Prompts

### -- V1

**Note:** Prompt is too bland and doesn't yield good results. Avoid this one.

```plain
Use the internet. Search the internet and summarize the found content. Reference the sources used for the search results.
```

### -- V2

```plain
Use the internet to fetch up-to-date information. Provide comprehensive responses with clear citations. Summarize the found content in concise language and highlight key findings. Present balanced viewpoints on complex topics.
```
