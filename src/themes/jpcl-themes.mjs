// src/themes/jpcl-themes.mjs
// Code themes built from the website's syntax palette (web/assets/css/main.css)

function makeTheme(name, type, colours) {
  return {
    name,
    type,
    colors: {
      "editor.background": colours.background,
      "editor.foreground": colours.text,
    },
    tokenColors: [
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: {
          foreground: colours.comment,
          fontStyle: "italic",
        },
      },
      {
        scope: [
          "entity.name.section",
          "entity.name.type",
          "entity.name.class",
          "support.class",
        ],
        settings: {
          foreground: colours.section,
          fontStyle: "bold",
        },
      },
      {
        scope: [
          "support.type.property-name",
          "meta.object-literal.key",
          "entity.name.tag",
          "entity.name.function",
          "support.function",
          "variable.other.property",
        ],
        settings: {
          foreground: colours.key,
        },
      },
      {
        scope: ["string", "constant.character.escape"],
        settings: {
          foreground: colours.string,
        },
      },
      {
        scope: ["constant.numeric"],
        settings: {
          foreground: colours.number,
        },
      },
      {
        scope: [
          "constant.language",
          "keyword",
          "storage",
          "storage.type",
          "storage.modifier",
          "variable.language",
        ],
        settings: {
          foreground: colours.keyword,
        },
      },
      {
        scope: ["punctuation", "meta.brace", "keyword.operator"],
        settings: {
          foreground: colours.punct,
        },
      },
      {
        scope: ["invalid", "markup.deleted"],
        settings: {
          foreground: colours.error,
        },
      },
    ],
  };
}

export const jpclDark = makeTheme("jpcl-dark", "dark", {
  background: "#0f2540",
  text: "#e7eef7",
  section: "#f596aa",
  key: "#dac9a6",
  string: "#fedfe1",
  number: "#83ccd2",
  keyword: "#a99cd6",
  comment: "#8496ad",
  punct: "#8fa3bc",
  error: "#ff8f9e",
});

export const jpclLight = makeTheme("jpcl-light", "light", {
  background: "#fedfe1",
  text: "#0f2540",
  section: "#0f2540",
  key: "#716246",
  string: "#c3183f",
  number: "#165e83",
  keyword: "#6f3381",
  comment: "#595857",
  punct: "#4a5a6e",
  error: "#c9171e",
});
