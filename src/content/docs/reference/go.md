---
title: Go
description: API reference for github.com/jpcl-lang/jpcl/go/v2.
---

```bash
go get github.com/jpcl-lang/jpcl/go/v2
```

Standard library only. Full Go doc on
[pkg.go.dev](https://pkg.go.dev/github.com/jpcl-lang/jpcl/go/v2).

The package is named `jpcl`, but the path ends in `/go/v2`, so import it with
an alias:

```go
import jpcl "github.com/jpcl-lang/jpcl/go/v2"
```

## Values

Documents parse into a small set of concrete types, carried as `any`:

| `.jp` type | Go type |
| --- | --- |
| Object / section | `*jpcl.Object` |
| Array | `[]any` |
| String | `string` |
| Integer | `int64` |
| Float | `float64` |
| Boolean | `bool` |
| Null / empty | `nil` |

### `Object`

An ordered map. Go's built-in `map` does not keep insertion order, and the
writer needs it.

| Member | Meaning |
| --- | --- |
| `NewObject() *Object` | An empty object. |
| `Set(key string, value any)` | Add or replace a key. New keys go last. |
| `Get(key string) (any, bool)` | Read a key. |
| `Keys() []string` | Keys in insertion order. |
| `Len() int` | Number of keys. |

```go
obj := jpcl.NewObject()
obj.Set("prefix", "!")
obj.Set("id", int64(1234567890))

value, ok := obj.Get("prefix")
```

The writer does not accept `map[string]any`, so its ordering guarantee always
holds. Build documents with `Set`.

## Reading

| Function | Meaning |
| --- | --- |
| `Parse(text string, opts ParseOptions) (*Object, error)` | Parse text. |
| `Load(path string, opts ParseOptions) (*Object, error)` | Read a file. |
| `LoadDir(dir, pattern string, recursive bool, opts ParseOptions) (map[string]*Object, error)` | Read every matching file. An empty pattern means `*.jp`. |

### `ParseOptions`

```go
type ParseOptions struct {
	// Used in error messages
	Filename string

	// DuplicateError (default), DuplicateFirst or DuplicateLast
	DuplicateKeys DuplicateKeys
}
```

## Writing

| Function | Meaning |
| --- | --- |
| `Dumps(obj *Object, opts StringifyOptions) (string, error)` | Serialise to text. |
| `Dump(obj *Object, path string, atomic bool, opts StringifyOptions) error` | Write a file. `atomic` writes via a temporary file and a rename. |
| `DefaultStringifyOptions() StringifyOptions` | `{Indent: 2, Width: 88}`. |

### `StringifyOptions`

```go
type StringifyOptions struct {
	// Spaces per level
	Indent int

	// Column budget for inline arrays
	Width int

	// Sort keys alphabetically instead of insertion order
	SortKeys bool

	// Escape non-ASCII characters
	EnsureASCII bool

	// Convert otherwise unsupported types
	Default func(value any) any
}
```

Always start from `DefaultStringifyOptions()`. A bare `StringifyOptions{}` means
`Indent: 0, Width: 0`, which Go cannot tell apart from a deliberate choice.

```go
opts := jpcl.DefaultStringifyOptions()
opts.SortKeys = true

text, err := jpcl.Dumps(obj, opts)
```

The writer accepts `nil`, `bool`, `string`, every integer type, `float32`,
`float64`, `*jpcl.Object` and `[]any`.

## `JPConfig`

Wraps an `*Object` and remembers its file. See
[Editing a config in place](/guides/editing/) for a walkthrough.

### Creating

| Function | Meaning |
| --- | --- |
| `NewJPConfig(data *Object, opts ConfigOptions) *JPConfig` | Wrap existing data. |
| `LoadJPConfig(path string, missingOK bool, opts ConfigOptions) (*JPConfig, error)` | Read a file. With `missingOK`, a missing file gives an empty config. |
| `LoadsJPConfig(text, path string, opts ConfigOptions) (*JPConfig, error)` | Parse text, bound to `path`. |

```go
type ConfigOptions struct {
	DuplicateKeys DuplicateKeys
	Write         StringifyOptions
}
```

### Methods

| Method | Meaning |
| --- | --- |
| `Data` | The underlying `*Object`, a public field. |
| `GetPath(path string, def any) any` | Read by dotted path, or `def`. |
| `SetPath(path string, value any) error` | Write by dotted path, creating sections. |
| `HasPath(path string) bool` | Whether a dotted path exists. |
| `Section(name string, create bool) (*Object, error)` | Get a top-level section. |
| `Merge(other *Object, deep bool)` | Merge another object in. |
| `ToDict() *Object` | A deep copy. |
| `Dumps() (string, error)` | Serialise with the stored options. |
| `Save(path string) (string, error)` | Write atomically. `""` means the bound path. Returns the path written. |
| `Reload() error` | Re-read the bound file. |
| `FilePath() (string, bool)` | The bound path, if any. |
| `SetFilePath(path string)` | Bind to another path. |

Write options are fixed when the config is created. Call
`jpcl.Dumps(cfg.Data, opts)` for a one-off format.

## Errors

| Type | Returned when |
| --- | --- |
| `*DecodeError` | A document is malformed. Fields: `Message`, `Doc`, `Pos`, `Line`, `Col`, `Filename`. |
| `*EncodeError` | A value cannot be serialised: an unsupported type, a circular reference, or `[]byte`. |

```go
var decodeErr *jpcl.DecodeError
if errors.As(err, &decodeErr) {
	fmt.Println(decodeErr.Line, decodeErr.Col)
}
```

## Constants

| Name | Value |
| --- | --- |
| `Version` | Set at build time by `-ldflags`. `"0.0.0-dev"` otherwise. |
| `Suffix` | `".jp"` |
| `MaxDepth` | `200`, the nesting limit. |
