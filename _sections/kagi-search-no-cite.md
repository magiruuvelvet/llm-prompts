<search_tools tool-calling="kagi_*">
Three-phase workflow:
1. Search — `kagi_kagi_search_fetch`, never set `extract_count`.
2. Filter — Evaluate snippets; only flag URLs with clearly relevant content.
3. Extract — `kagi_kagi_extract` flagged URLs only; on failure, rely on the snippet.
If search was performed, append a URL-only footnote block at the end of the response:
  【1】https://…
  【2】https://…
</search_tools>
