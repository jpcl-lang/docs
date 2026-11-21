// astro.config.mjs
// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";


// Static output only: Cloudflare Pages serves dist/ as plain files
export default defineConfig({
  site: "https://jpcl.has-a.wiki",
  integrations: [
    starlight({
      title: "JPCL",
      description: "Documentation for JPCL, the .jp configuration language: TOML's sections, JSON's nesting.",
      logo: {
        light: "./src/assets/icon-light.svg",
        dark: "./src/assets/icon-dark.svg",
      },
      favicon: "/favicon.svg",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/jpcl-lang/jpcl",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/jpcl-lang/docs/edit/main/",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "Installation", slug: "start/installation" },
            { label: "Quick start", slug: "start/quick-start" },
            { label: "Upgrading to 2.0", slug: "guides/upgrading" },
          ],
        },
        {
          label: "The format",
          items: [
            { label: "Syntax", slug: "format/syntax" },
            { label: "Values", slug: "format/values" },
            { label: "Comments", slug: "format/comments" },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Editing a config in place", slug: "guides/editing" },
            { label: "Loading a folder", slug: "guides/folders" },
            { label: "Errors", slug: "guides/errors" },
            { label: "Round trips", slug: "guides/round-trips" },
            { label: "Organising your configs", slug: "guides/organising" },
          ],
        },
        {
          label: "Command line",
          items: [{ label: "The jpcl command", slug: "cli" }],
        },
        {
          label: "API reference",
          items: [
            { label: "TypeScript / JavaScript", slug: "reference/typescript" },
            { label: "Python", slug: "reference/python" },
            { label: "Go", slug: "reference/go" },
          ],
        },
      ],
    }),
  ],
});
