import { locales, defaultLang, languages } from "./locales.ts";
import { getRelativeLocaleUrl } from "astro:i18n";

export type Lang = keyof typeof locales;
type TranslationKey = keyof (typeof locales)[typeof defaultLang];

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return locales[lang]?.[key] ?? locales[defaultLang][key] ?? (key as string);
  };
}

export function getLocalePaths(url: URL) {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/g, "");
  const pathname = url.pathname;
  const pathWithoutBase = pathname.startsWith(base)
    ? pathname.slice(base.length) || "/"
    : pathname;

  return Object.keys(languages).map((lang) => {
    const localizedPath = getRelativeLocaleUrl(lang, pathWithoutBase);
    const normalizedLocalizedPath = localizedPath.startsWith("/")
      ? localizedPath.slice(1)
      : localizedPath;

    return {
      lang: lang,
      path: `${base}${normalizedLocalizedPath}`,
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
