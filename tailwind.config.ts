import { skeleton } from "@skeletonlabs/skeleton/plugin";
import * as themes from "@skeletonlabs/skeleton/themes";
import forms from "@tailwindcss/forms";
import { join } from "path";
import type { Config } from "tailwindcss";

import * as CustomThemes from "./themes";
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(
      require.resolve("@skeletonlabs/skeleton-svelte"),
      "../**/*.{html,js,svelte,ts}",
    ),
  ],

  theme: {
    extend: {},
  },

  plugins: [
    forms,
    skeleton({
      themes: [
        themes.cerberus,
        themes.catppuccin,
        themes.pine,
        themes.rose,
        CustomThemes.halloween,
      ],
    }),
  ],
} as Config;
