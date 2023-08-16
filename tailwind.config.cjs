import { join } from "path";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import skeleton from "@skeletonlabs/skeleton/tailwind/skeleton.cjs";

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(
      require.resolve("@skeletonlabs/skeleton"),
      "../**/*.{html,js,svelte,ts}"
    ),
  ],
  theme: {
    extend: {
      screens: {
        xxs: "350px",
        xs: "475px",
      },
    },
  },
  plugins: [forms, typography, ...skeleton()],
};
