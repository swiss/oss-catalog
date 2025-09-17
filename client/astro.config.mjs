// @ts-check
import { defineConfig } from "astro/config";

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
    }
});
