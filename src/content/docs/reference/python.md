---
title: Python
description: API reference for the jpcl package on PyPI.
---

```bash
pip install jpcl
```

Python 3.14+. Fully typed, no runtime dependencies.

```python
import jpcl
```

## Text

### `loads(text, *, filename=None, duplicate_keys="error", dict_factory=None)`

Parse `.jp` text into a `dict`.

| Argument | Meaning |
| --- | --- |
| `filename` | Name used in error messages. |
| `duplicate_keys` | `"error"`, `"first"` or `"last"`. |
| `dict_factory` | Mapping type to build instead of `dict`. |

### `dumps(obj, *, indent=2, width=88, sort_keys=False, ensure_ascii=False, default=None)`

Serialise a mapping to `.jp` text.

| Argument | Meaning |
| --- | --- |
| `indent` | Spaces per level. |
| `width` | Column budget for inline arrays. |
| `sort_keys` | Sort keys alphabetically. |
| `ensure_ascii` | Escape non-ASCII characters. |
| `default` | Called for otherwise unsupported values, e.g. `default=str`. |

## Files

### `load(source, *, duplicate_keys="error", dict_factory=None)`

Read from a path or an open text file.

### `dump(obj, target, *, atomic=True, **options)`

Write to a path or an open text file. `options` are the `dumps` arguments. With
`atomic=True` a path is written via a temporary file and a rename.

### `load_dir(directory, *, pattern="*.jp", recursive=False, **options)`

Load every matching file into a `dict` keyed by file stem. With
`recursive=True`, nested files are keyed by relative path with `/` separators.
`options` are the `load` arguments.

```python
config = jpcl.load_dir("data")
```

## `JPConfig`

A `MutableMapping` of sections that remembers the file it came from. See
[Editing a config in place](/guides/editing/) for a walkthrough.

### Creating

| Member | Meaning |
| --- | --- |
| `JPConfig(data=None, *, path=None, **options)` | Wrap a mapping. It is copied, not aliased. |
| `JPConfig.load(path, *, missing_ok=False, **options)` | Read a file. |
| `JPConfig.loads(text, *, path=None, **options)` | Parse text. |

`options` may be any `loads` or `dumps` option. They are remembered by `save()`
and `reload()`. An unknown option raises `TypeError`.

### Reading and writing

| Member | Meaning |
| --- | --- |
| `cfg[key]`, `cfg[key] = …`, `del cfg[key]` | Plain dict-style access. |
| `get_path(path, default=None, *, sep=".")` | Read by dotted path. Never raises. |
| `set_path(path, value, *, sep=".")` | Write by dotted path, creating sections. |
| `has_path(path, *, sep=".")` | Whether a dotted path exists. |
| `section(name, *, create=False)` | Get a top-level section, optionally creating it. |
| `merge(other, *, deep=True)` | Merge another mapping in. Returns the config. |
| `to_dict(*, deep=True)` | A plain copy. |
| `path` | The bound file, as a `Path`, or `None`. |

### Saving

| Member | Meaning |
| --- | --- |
| `dumps(**options)` | Serialise to text. |
| `save(path=None, *, atomic=True, **options)` | Write, and return the `Path` written. |
| `reload()` | Re-read the bound file, discarding changes. |

## Errors

| Class | Raised when |
| --- | --- |
| `JPError` | Base class of both below. |
| `JPDecodeError` | A document is malformed. Also a `ValueError`. Has `raw_message`, `doc`, `pos`, `line`, `col` and `filename`. |
| `JPEncodeError` | A value cannot be serialised. Also a `TypeError`. |

Because they subclass the built-in errors, existing `except ValueError` and
`except TypeError` clauses keep working.

## Constants

| Name | Value |
| --- | --- |
| `__version__` | The installed version, e.g. `"2.0.0"`. |
| `SUFFIX` | `".jp"` |
| `ENCODING` | `"utf-8"` |
