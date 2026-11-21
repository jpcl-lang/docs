---
title: Upgrading to 2.0
description: What changed in JPCL 2.0, and how to move a 1.x project across.
---

JPCL 2.0 changes the comment markers. It is a major version because **old files
do not fail to parse — they parse differently.**

## What changed

| | 1.2 | 2.0 |
| --- | --- | --- |
| Line comment | `$$ note` | `~~ note` |
| Block comment | `$* note *$` | `~* note *~` |
| Go module path | `github.com/jpcl-lang/jpcl-go` | `github.com/jpcl-lang/jpcl/go/v2` |
| Source | three repositories | one monorepo, [`jpcl-lang/jpcl`](https://github.com/jpcl-lang/jpcl) |

In 2.0, `$$` and `$*` are ordinary text. A 1.2 line like this:

```jp
[s]
a: 1 $$ note
```

now reads as the **string** `"1 $$ note"`, not the number `1`. Nothing warns
you, so convert your files before you upgrade the library.

## 1. Convert your files

Run this from your project root. It rewrites every `.jp` file under the current
folder, and leaves a `.bak` copy of each:

```bash
find . -name '*.jp' -exec perl -pi.bak -e 's/\$\$/~~/g; s/\$\*/~*/g; s/\*\$/*~/g' {} +
```

:::caution
This also changes `$$`, `$*` and `*$` inside quoted strings. Search for them
first if your values might contain them:

```bash
grep -rn -F -e '$$' -e '$*' -e '*$' --include='*.jp' .
```
:::

## 2. Upgrade the library

| Language | Command |
| --- | --- |
| TypeScript | `npm install jpcl-lang@2` |
| Python | `pip install "jpcl>=2"` |
| Go | `go get github.com/jpcl-lang/jpcl/go/v2`, then change every import |

For Go, the import path changes as well as the version:

```go
// Before
import jpcl "github.com/jpcl-lang/jpcl-go"

// After
import jpcl "github.com/jpcl-lang/jpcl/go/v2"
```

## 3. Validate with the 2.0 command

```bash
jpcl check data/*.jp
```

Then convert one file to JSON and confirm no value contains `$$` or `~~`:

```bash
jpcl to-json data/servers.jp
```

## Values that now need quotes

A value that **starts a block comment** must be quoted in 2.0:

```jp
[s]
pattern: "~*.jp"      ~~ unquoted, this would open a block comment
```

A lone `~` is still plain text, so `home: ~/config` is fine.
