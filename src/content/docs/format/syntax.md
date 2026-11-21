---
title: Syntax
description: Sections, entries, nesting and empty values — the whole .jp format.
---

A `.jp` file is a document of **sections**. Each section holds **entries**, and
an entry's value can be an object or an array, nested as deep as you need. Text
is UTF-8.

## Sections

A `[NAME]` header opens a root key. Everything below it, until the next header,
belongs to that section.

```jp
[SERVER_ID]
prefix: "!"

[SERVER_ID_2]
prefix: "?"
```

That parses to:

```json
{
  "SERVER_ID": { "prefix": "!" },
  "SERVER_ID_2": { "prefix": "?" }
}
```

### Dotted and quoted headers

Headers may be dotted to nest, and quoted when a name contains a dot:

```jp
[guild.limits]        ~~ -> { "guild": { "limits": {...} } }
rate: 30

["weird.name"]        ~~ -> { "weird.name": {...} }
ok: true
```

### Entries before the first header

Key/value pairs written *before* the first header land at the document root:

```jp
version: 2

[SERVER_ID]
prefix: "!"
```

```json
{
  "version": 2,
  "SERVER_ID": { "prefix": "!" }
}
```

## Entries

An entry is `key: value`.

- Keys need no quotes. A bare key may contain spaces, but not brackets, commas,
  colons or quotes.
- Quote a key, with `"` or `'`, if it needs any of those.

```jp
[SERVER_ID]
display name: "Main server"
"key: with punctuation": true
```

### Separators

Entries are separated by a line break, a comma, or both. Trailing and repeated
commas are accepted:

```jp
[SERVER_ID]
a: 1
b: {x: 1, y: 2,}
c: [1, 2, 3,]
```

## Nesting

Below a section, values use JSON-style structure: `{…}` for objects and `[…]`
for arrays, as deep as you like.

```jp
[SERVER_ID]
modules: {
  moderation: {
    enabled: true,
    log_channels: [1001, 1002]
  }
}
```

## Empty values

A key with nothing after the colon has no value yet, and parses to null:

```jp
[SERVER_ID]
config: {
  disabled_channels:,      ~~ -> null
  timeout:                 ~~ -> null
}
```

Because of this, **a value must start on the same line as its `:`**. An opening
`{` or `[` goes on the colon's line; its contents may then wrap freely.

```jp
[SERVER_ID]
~~ Right: the brace is on the colon's line.
users: [
  9892,
  82082
]
```

An array element cannot be empty, so a null inside an array is written out:

```jp
[SERVER_ID]
slots: [null, 3]
```

## Comments

`~~` starts a line comment and `~* … *~` wraps a block comment. Both are
allowed anywhere. See [Comments](/format/comments/).

## Duplicate keys

A repeated key in the same object is an error by default, rather than a silent
overwrite. Each implementation has an option to keep the first or the last
value instead. See [Errors](/guides/errors/).

## Limits

Nesting is capped at 200 levels, so a hostile file cannot exhaust the stack.
