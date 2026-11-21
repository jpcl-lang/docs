---
title: Round trips
description: What the deterministic writer produces, and what a rewrite cannot keep.
---

The writer is deterministic, so a file rewritten twice is byte-identical. That
is what makes it safe for a program to own a config that a person also edits.

## What the writer produces

- Every top-level object becomes a `[SECTION]`, separated by a blank line.
- Section entries sit one per line, with no separating commas.
- Inside a nested object, entries sit one per line and are separated by
  commas, JSON-style, with none after the last.
- Nested objects always expand across lines. `{}` is the only inline form.
- Arrays stay inline while they fit inside the width (88 columns by default),
  then break one element per line.
- Null is written as an empty value (`key:`, or `key:,` when a comma
  follows) and as `null` inside arrays, since an array element cannot be
  empty.
- Keys keep their insertion order, unless you sort them.
- Strings are always double-quoted. Keys are quoted unless they are made only of
  letters, digits, `_` and `-`.
- Indentation is 2 spaces by default.

```jp
version: 2

[SERVER_ID]
prefix: "!"
config: {
  disabled_channels:,
  disabled_users: [9892, 82082, 8209]
}
```

## What a rewrite cannot keep

Two things never survive, in any implementation:

1. **Comments are dropped.** They are not part of the parsed data.
2. **Root-level scalars move above the first section**, because anything after a
   header would be read back as part of that section.

`jpcl fmt -w` rewrites a file the same way, so it drops comments too.

### TypeScript only

JavaScript itself causes three more:

- **Integer-like keys move to the front.** JavaScript objects list keys such as
  `"1234567890"` first, in ascending order. A `[1234567890]` section comes out
  ahead of `[SERVER_ID]` even if the file had it last. Pass a `Map` to `dumps`
  if that order matters.
- **Whole floats become integers.** `1.0` reads back as `1` and is written as
  `1`.
- **`undefined` follows `JSON.stringify`.** Object properties set to `undefined`
  are skipped, and `undefined` array elements are written as `null`.

## Writing between languages

All three writers produce the same text for the same data, so a file written
by one reads back unchanged in the others.

## Atomic writes

`dump` and `save` write to a temporary file in the same folder, then rename it
into place. A crash or a concurrent reader never sees half a config.

To write in place instead:

- **TypeScript:** pass `{ atomic: false }` to `dump` or `save`.
- **Python:** pass `atomic=False` to `dump` or `save`.
- **Go:** pass `false` as `Dump`'s third argument. `JPConfig.Save` is always
  atomic.
