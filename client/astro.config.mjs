// @ts-check
import { defineConfig } from "astro/config";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://swiss.github.io",
  i18n: {
    locales: ["en", "de", "fr", "it"],
    defaultLocale: "en",
    fallback: {
      de: "en",
      fr: "en",
      it: "en",
    },
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
      fallbackType: "rewrite",
    },
  },
});
