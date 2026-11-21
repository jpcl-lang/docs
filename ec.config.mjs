// ec.config.mjs
// Expressive Code settings, shared by the build and the <Code> component
import { defineEcConfig } from "@astrojs/starlight/expressive-code";

import jpGrammar from "./src/grammars/jp.tmLanguage.json" with { type: "json" };
import { jpclDark, jpclLight } from "./src/themes/jpcl-themes.mjs";

export default defineEcConfig({
  themes: [jpclDark, jpclLight],
  shiki: {
    langs: [jpGrammar],
  },
});
