---
title: Comments
description: Line comments with ~~ and block comments with ~* … *~.
---

| Kind | Syntax |
| --- | --- |
| Line comment | `~~` to the end of the line |
| Block comment | `~*` … `*~`, may span lines |

Both are allowed anywhere: before the first header, after a header, after a
value, between entries, and inside objects and arrays.

```jp
~* Server settings,
   one section per guild *~
[SERVER_ID]           ~~ after a header
prefix: "!"           ~~ after a value
limits: {
  ~~ inside an object
  rate: {per_minute: 30, burst: 5},
  slots: [1, ~* inside an array *~ 2]
}
```

## Rules

- A comment ends an unquoted value, so `a: hello ~~ note` is `"hello"`.
- Comment markers inside a quoted string are text: `a: "~~ not a comment"`.
- A block comment that spans lines counts as a line break, so it can separate
  two entries.
- An unclosed block comment is an error:

  ```
  servers.jp:2:6: unterminated block comment: missing '*~'
  ```

## Comments and rewriting

Comments are not part of the parsed data, so **a rewrite drops them**. This is
the main thing `dump`, `save` and `jpcl fmt -w` cannot keep. See
[Round trips](/guides/round-trips/).

## Before 2.0

JPCL 1.2 used `$$` and `$* … *$`. In 2.0 those are plain text, and `#` has not
been a comment marker since 1.2. See [Upgrading to 2.0](/guides/upgrading/).
