---
title: The jpcl command
description: Validate, format, read and convert .jp files from the shell.
---

Every implementation ships the same `jpcl` command, with the same subcommands,
flags and output.

| Implementation | Get the command |
| --- | --- |
| TypeScript | `npm install jpcl-lang`, then `npx jpcl …` |
| Python | `pip install jpcl`, then `jpcl …` or `python -m jpcl …` |
| Go | `go install github.com/jpcl-lang/jpcl/go/v2/cmd/jpcl@latest` |

`-` reads standard input in place of a file name. Every command exits `0` on
success and `1` on failure.

## `jpcl check`

Validate one or more files.

```bash
jpcl check data/*.jp
```

```
ok  data/servers.example.jp
```

| Flag | Meaning |
| --- | --- |
| `-q`, `--quiet` | Only report errors. |

Stops with exit code `1` and the decode error when a file is malformed. Worth a
line in CI.

## `jpcl fmt`

Reformat files in the canonical style. Without `-w` the result goes to standard
output.

```bash
jpcl fmt -w data/servers.jp
```

| Flag | Meaning |
| --- | --- |
| `-w`, `--write` | Rewrite the files in place. |
| `--indent N` | Spaces per level. Default `2`. |
| `--width N` | Column budget for inline arrays. Default `88`. |
| `--sort-keys` | Sort keys alphabetically. |

:::caution
Formatting drops comments, like any rewrite. See
[Round trips](/guides/round-trips/).
:::

## `jpcl get`

Print one value by dotted path.

```bash
jpcl get data/servers.jp SERVER_ID.prefix
```

```
"!"
```

| Flag | Meaning |
| --- | --- |
| `-r`, `--raw` | Print strings without quotes. |

A missing path prints `no such path: SERVER_ID.nope` and exits `1`.

## `jpcl to-json`

Convert `.jp` to JSON.

```bash
jpcl to-json -o out.json data/servers.jp
```

| Flag | Meaning |
| --- | --- |
| `-o`, `--output FILE` | Write to a file instead of standard output. |
| `--indent N` | Spaces per level. Default `2`. |

## `jpcl from-json`

Convert JSON to `.jp`.

```bash
jpcl from-json -o data/servers.jp out.json
```

| Flag | Meaning |
| --- | --- |
| `-o`, `--output FILE` | Write to a file instead of standard output. |
| `--indent N` | Spaces per level. Default `2`. |
| `--width N` | Column budget for inline arrays. Default `88`. |
| `--sort-keys` | Sort keys alphabetically. |

In TypeScript and Python, integers of any size survive `to-json` and
`from-json` intact. Go is limited to `int64`.

## Flag order

The TypeScript and Python commands accept flags before or after the file
names. The Go command uses Go's standard `flag` package, so **flags must come
first**:

```bash
# Works everywhere
jpcl fmt -w data/servers.jp

# Not in Go
jpcl fmt data/servers.jp -w
```
