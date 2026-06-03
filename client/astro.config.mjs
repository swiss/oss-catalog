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
    defaultLocale: "de",
    fallback: {
      fr: "de",
      en: "de",
      it: "de",
    },

    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
