import { locales, defaultLang, languages } from "./locales.ts";
import { getRelativeLocaleUrl } from "astro:i18n";

export type Lang = keyof typeof locales;
type TranslationKey = keyof (typeof locales)[typeof defaultLang];

export function useTranslations(lang: Lang) {
  return function t(
    key: TranslationKey,
    params?: Record<string, string | number>,
  ): string {
    let template =
      locales[lang]?.[key] ?? locales[defaultLang][key] ?? (key as string);

    if (params) {
      for (const [paramKey, value] of Object.entries(params)) {
        template = template.replace(`{${paramKey}}`, String(value));
      }
    }

    return template;
  };
}

export function getLocalePaths(url: URL) {
  return Object.keys(languages).map((lang) => {
    // Strip the current locale prefix from the pathname
    // e.g., /de/about -> /about, /en/about -> /about
    const pathWithoutLocale = url.pathname.replace(
      /^\/(en|de|fr|it)(\/|$)/,
      "/",
    );

    return {
      lang: lang,
      path: getRelativeLocaleUrl(lang, pathWithoutLocale),
    };
  });
}

export function resolveLanguage(lang: Lang, availableLanguages: string[]) {
  return (
    availableLanguages.find((l) => l.startsWith(lang)) ??
    availableLanguages.find((l) => l.startsWith(defaultLang)) ??
    availableLanguages[0]
  );
}

export function toFullLocale(lang: Lang): string {
  return lang === "de"
    ? "de-CH"
    : lang === "fr"
      ? "fr-CH"
      : lang === "it"
        ? "it-CH"
        : "de-CH";
}
