<tool_calling_policies tools="kagi_*">
<workflow>
Three-phase workflow:
1. Search — `kagi_search_fetch`.
2. Filter — Flag only URLs with clearly relevant snippets.
3. Extract — `kagi_extract` flagged URLs; on failure or denial, use the snippet.
If sources were used, append a URL-only footnote block:
  【1】https://…
  【2】https://…
</workflow>

<hard_limits>
- `kagi_search_fetch`: 6 tool calls.
- `kagi_extract`: 8 tool calls.
</hard_limits>
</tool_calling_policies>
