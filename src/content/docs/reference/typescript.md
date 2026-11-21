---
title: TypeScript / JavaScript
description: API reference for the jpcl-lang npm package.
---

```bash
npm install jpcl-lang
```

Ships ESM with TypeScript types. Node 20+, Bun and Deno. No runtime
dependencies.

```ts
import * as jpcl from "jpcl-lang";
```

## Entry points

| Import | Contents |
| --- | --- |
| `jpcl-lang` | Everything: text, files, folders, `JPConfig`. |
| `jpcl-lang/core` | `loads`, `dumps`, errors and types only. No filesystem access, for browsers, workers and edge runtimes. |

## Text

### `loads(text, options?)`

Parse `.jp` text into a plain object. Also exported as `parse`.

```ts
const data = jpcl.loads('[s]\nprefix: "!"\n');
```

### `dumps(value, options?)`

Serialise a plain object or a `Map` to `.jp` text. Also exported as
`stringify`.

```ts
const text = jpcl.dumps(data, { indent: 4, sortKeys: true });
```

## Files

| Function | Returns |
| --- | --- |
| `load(path, options?)` | `Promise<JPObject>` |
| `loadSync(path, options?)` | `JPObject` |
| `dump(value, path, options?)` | `Promise<void>` |
| `dumpSync(value, path, options?)` | `void` |
| `loadDir(directory, options?)` | `Promise<Record<string, JPObject>>` |
| `loadDirSync(directory, options?)` | `Record<string, JPObject>` |

Paths may be strings or `file:` URLs. Writes are atomic by default.

## Options

### `ParseOptions`

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| `filename` | `string \| null` | `null` | Name used in error messages. `loads` only. |
| `duplicateKeys` | `"error" \| "first" \| "last"` | `"error"` | What to do with a repeated key. |
| `integers` | `"auto" \| "bigint" \| "number"` | `"auto"` | How integers are returned. See [Big numbers](#big-numbers). |

### `StringifyOptions`

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| `indent` | `number` | `2` | Spaces per level. |
| `width` | `number` | `88` | Column budget for inline arrays. |
| `sortKeys` | `boolean` | `false` | Sort keys by code point. |
| `ensureAscii` | `boolean` | `false` | Escape non-ASCII characters. |
| `default` | `(value) => unknown` | none | Convert otherwise unsupported values. |

```ts
jpcl.dumps(data, {
  default: (value) => (value instanceof Date ? value.toISOString() : String(value)),
});
```

### `DumpOptions`

Everything in `StringifyOptions`, plus `atomic` (default `true`): write a
temporary file and rename it into place.

### `LoadDirOptions`

Everything in `ParseOptions` except `filename`, plus:

| Option | Default | Meaning |
| --- | --- | --- |
| `pattern` | `"*.jp"` | Glob for file names: `*`, `?`, `[abc]`. |
| `recursive` | `false` | Descend into sub-folders. |

## Big numbers

JavaScript numbers lose precision past 2^53, which is where Discord snowflakes
and other 64-bit IDs live. With `integers: "auto"`, an integer that fits safely
is a `number` and one that does not is a `bigint`:

```ts
jpcl.loads("[s]\nsmall: 42\nid: 111111111111111111\n");
// { s: { small: 42, id: 111111111111111111n } }
```

- `"bigint"` returns a `bigint` for every integer.
- `"number"` always returns a `number`, accepting precision loss.

`bigint` values are written back as plain integers.

## `JPConfig`

A map-like object that remembers the file it came from. See
[Editing a config in place](/guides/editing/) for a walkthrough.

### Creating

| Member | Meaning |
| --- | --- |
| `new JPConfig(data?, { path?, ...options })` | Wrap existing data. |
| `JPConfig.load(path, { missingOk?, ...options })` | Read a file. |
| `JPConfig.loadSync(path, options?)` | Same, without a promise. |
| `JPConfig.loads(text, { path?, ...options })` | Parse text. |

`options` may hold any read option (`duplicateKeys`, `integers`) and any write
option (`indent`, `width`, `sortKeys`, `ensureAscii`, `default`). They are
remembered by `save()` and `reload()`.

### Reading and writing

| Member | Meaning |
| --- | --- |
| `data` | The underlying plain object. |
| `size` | Number of top-level keys. |
| `get`, `set`, `has`, `delete` | Top-level key access, like a `Map`. |
| `keys()`, `values()`, `entries()` | Iterators. `JPConfig` is itself iterable. |
| `getPath(path, fallback?, sep = ".")` | Read by dotted path. Never throws. |
| `setPath(path, value, sep = ".")` | Write by dotted path, creating sections. |
| `hasPath(path, sep = ".")` | Whether a dotted path exists. |
| `section(name, { create? })` | Get a top-level section, optionally creating it. |
| `merge(other, { deep = true })` | Merge another object in. |
| `toObject({ deep = true })` | A plain copy. |

### Saving

| Member | Meaning |
| --- | --- |
| `dumps(options?)` | Serialise to text. |
| `save(path?, options?)` | Write atomically. Resolves to the path written. |
| `saveSync(path?, options?)` | Same, without a promise. |
| `reload()` / `reloadSync()` | Re-read the bound file, discarding changes. |

## Errors

| Class | Thrown when |
| --- | --- |
| `JPError` | Base class of both below. |
| `JPDecodeError` | A document is malformed. Has `rawMessage`, `doc`, `pos`, `line`, `col` and `filename`. |
| `JPEncodeError` | A value cannot be serialised. |

## Constants

| Name | Value |
| --- | --- |
| `version` | The package version, e.g. `"2.0.0"`. |
| `SUFFIX` | `".jp"` |
| `ENCODING` | `"utf-8"` |
| `MAX_DEPTH` | `200`, the nesting limit. |
