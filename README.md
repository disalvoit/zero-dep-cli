# zero-dep-cli

`words` counts words in a text file and prints the most frequent ones.

```
words <file> [--top N] [--json] [--help]
```

## Contract

1. `<file>` is required. A missing or unreadable file exits **1** with a
   message on stderr.
2. `--top N` prints the N most frequent words. `N` must be a positive
   integer; a missing value, `0`, a negative or a non-integer exits **2**.
3. `--json` prints a JSON array of `{ "word": string, "count": number }`.
4. `--help` prints usage and exits **0**.
5. An unknown flag exits **2**.
6. Words are case-insensitive and stripped of surrounding punctuation, so
   `Word,` and `word` are the same word.
7. Ties are broken alphabetically.
8. The package is **ESM** (`"type": "module"`) and has **no dependencies**.
   No `require`, no `module.exports`.

## Tests

```
npm test
```
