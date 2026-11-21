---
title: Values
description: Strings, numbers, booleans, null, objects and arrays, and what each language parses them to.
---

## Value types

| Type | Examples |
| --- | --- |
| String | `"hello"`, `'hello'`, `hello world` (unquoted) |
| Integer | `42`, `-7`, `1_000`, `0xff`, `0o755`, `0b1010` |
| Float | `3.5`, `1e3`, `.5`, `inf`, `-inf`, `nan` |
| Boolean | `true`, `false` |
| Null | `null`, `none`, `nil`, or nothing at all |
| Object | `{a: 1, b: 2}` |
| Array | `[1, 2, 3]` |

## What each language returns

| Type | TypeScript | Python | Go |
| --- | --- | --- | --- |
| String | `string` | `str` | `string` |
| Integer | `number`, or `bigint` beyond 2^53 | `int` | `int64` |
| Float | `number` | `float` | `float64` |
| Boolean | `boolean` | `bool` | `bool` |
| Null | `null` | `None` | `nil` |
| Object | plain object | `dict` | `*jpcl.Object` |
| Array | array | `list` | `[]any` |

## Unquoted values

An unquoted value is read in this order:

1. **A keyword.** `true`, `false`, `null`, `none`, `nil`, `nan`, `inf` and
   `infinity`, with an optional sign on the last three. Keywords are
   case-insensitive, so `True` and `None` work too.
2. **A number.** See [Numbers](#numbers).
3. **A plain string.** Anything else, with surrounding whitespace trimmed.

`yes`, `no`, `on` and `off` are deliberately **not** booleans. They stay
strings.

```jp
[s]
a: True          ~~ true
b: 0x1F          ~~ 31
c: hello world   ~~ "hello world"
d: yes           ~~ "yes"
```

### When to quote

Quote a value if it contains:

- `~~` or `~*`, which would start a comment
- a comma, or a `{`, `}`, `[` or `]`
- leading or trailing whitespace you want to keep

A lone `~` is just text, as are `#` and `$`, so these need no quotes:

```jp
[s]
home: ~/config
colour: #8496AD
price: $5
```

## Numbers

- **Integers:** an optional sign, then decimal digits. `0x`, `0o` and `0b`
  prefixes give hexadecimal, octal and binary.
- **Underscores** may separate digits: `1_000_000`, `0xff_ff`.
- **Floats:** a decimal point, an exponent, or both: `3.5`, `1e3`, `2.5E-3`,
  `.5`.
- **Non-finite:** `inf`, `+inf`, `-inf`, `infinity` and `nan`.

### Large integers

- **Python** integers have arbitrary precision.
- **TypeScript** parses an integer past 2^53 to a `bigint` by default, so
  64-bit IDs such as Discord snowflakes keep every digit. See
  [Big numbers](/reference/typescript/#big-numbers).
- **Go** integers are `int64`. A number beyond roughly 9.2×10¹⁸ falls through to
  `float64` and loses precision.

## Strings

Single and double quotes behave identically, and both honour backslash
escapes. A string cannot contain a raw line break.

| Escape | Meaning |
| --- | --- |
| `\"` `\'` `\\` `\/` | the character itself |
| `\n` `\r` `\t` | line feed, carriage return, tab |
| `\b` `\f` `\v` | backspace, form feed, vertical tab |
| `\0` `\a` `\e` | null, bell, escape |
| `\xXX` | a code point, 2 hex digits |
| `\uXXXX` | a code point, 4 hex digits |
| `\UXXXXXXXX` | a code point, 8 hex digits, e.g. `\U0001F600` |

A backslash at the very end of a line continues the string on the next line,
and swallows that line's indentation:

```jp
[s]
motd: "Welcome to the \
       server!"            ~~ "Welcome to the server!"
```

## Objects and arrays

- Objects are `{key: value, …}`. Keys follow the same rules as entry keys.
- Arrays are `[value, …]`. Elements may be any value, including objects and
  arrays.
- Both accept trailing commas, and may span lines once opened.
