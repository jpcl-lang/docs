<!-- README.md -->

# JPCL documentation

Source for **<https://jpcl.has-a.wiki>**, built with
[Astro Starlight](https://starlight.astro.build).

The libraries live in [`jpcl-lang/jpcl`](https://github.com/jpcl-lang/jpcl).
The landing page lives in [`jpcl-lang/web`](https://github.com/jpcl-lang/web).

## Develop

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>.

## Build

```bash
npm run build
```

The output is plain static files in `dist/`. There is no server code.

## Cloudflare Pages

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | from `.node-version` (22) |

## Layout

```
src/
├─ content/docs/          every page, as Markdown or MDX
│  ├─ start/              installation, quick start
│  ├─ format/             syntax, values, comments
│  ├─ guides/             editing, folders, errors, round trips, upgrading
│  ├─ reference/          TypeScript, Python, Go
│  └─ cli.md
├─ grammars/              .jp syntax highlighting (TextMate)
├─ styles/custom.css      palette and fonts from the website
└─ assets/                the JPCL icons
```

The sidebar order is set in `astro.config.mjs`.

## Writing `.jp` examples

Use ` ```jp ` fences. Every example should parse with the current release, and
every implementation should agree on it.
