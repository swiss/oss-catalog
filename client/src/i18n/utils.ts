import { locales, defaultLang, languages } from './locales.ts';
import { getRelativeLocaleUrl } from "astro:i18n";

export type Lang = keyof typeof locales;

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof locales[typeof defaultLang]) {
    return locales[lang] ? locales[lang][key] : locales[defaultLang][key];
  }
}

export function getLocalePaths(url: URL) {
  return Object.keys(languages).map((lang) => {
    return {
      lang: lang,
      path: getRelativeLocaleUrl(lang, url.pathname.replace(/^\/[a-zA-Z-]+/, ''))
    };
  });
}