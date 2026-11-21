---
title: Organising your configs
description: A folder layout and habits that keep .jp configs safe.
---

Nothing is enforced, but this is the layout the folder loaders are built for:

```
your-project/
├─ data/
│  ├─ servers.jp            one file per concern
│  ├─ roles.jp
│  ├─ servers.example.jp    committed template, safe to publish
│  └─ guilds/               optional: one file per entity
│     ├─ 1234567890.jp
│     └─ 9876543210.jp
└─ src/
```

## Habits that save pain later

1. **One file per concern.** A parse error then takes out one feature, not
   everything.
2. **Keep live data out of git**, and commit a template instead:

   ```text
   data/*.jp
   !data/*.example.jp
   ```

3. **Use IDs as section names.** `[1234567890]` parses to the string key
   `"1234567890"`. Python also writes integer keys as strings, so
   `{1234567890: {...}}` round-trips.
4. **Write through `JPConfig`'s save** rather than by hand, so an interrupted
   write cannot truncate a live config.
5. **Validate in CI:**

   ```bash
   jpcl check data/*.jp
   ```

## In CI

A minimal GitHub Actions step using the Python package:

```yaml
- name: Validate .jp files
  run: |
    pip install jpcl
    jpcl check data/*.jp
```
