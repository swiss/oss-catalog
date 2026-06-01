// @ts-check
import { defineConfig } from "astro/config";
import dotenv from "dotenv";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Load environment variables from .env file
dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://swiss.github.io",
  i18n: {
    locales: ["en", "de", "fr", "it"],
    defaultLocale: "en",
    fallback: {
      fr: "en",
      de: "en",
      it: "en",
    },

    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
      fallbackType: "rewrite",
    },
  },
  redirects: {
    "/impressum": "[locale]/impressum",
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
