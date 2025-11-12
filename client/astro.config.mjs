// @ts-check
import {defineConfig} from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  i18n: {
      locales: ["en", "de", "fr", "it"],
      defaultLocale: "en",
      fallback: {
          de: "en",
          fr: "en",
          it: "en"
      },
      routing: {
          prefixDefaultLocale: false,
          redirectToDefaultLocale: false,
          fallbackType: "rewrite"
      }
  },

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});