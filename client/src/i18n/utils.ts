import { locales, defaultLang, languages } from './locales.ts';
import { getRelativeLocaleUrl } from "astro:i18n";

export type Lang = keyof typeof locales;
type TranslationKey = keyof typeof locales[typeof defaultLang];

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return locales[lang]?.[key] ?? locales[defaultLang][key] ?? (key as string);
  }
}

export function getLocalePaths(url: URL) {
  return Object.keys(languages).map((lang) => {
    return {
      lang: lang,
      path: getRelativeLocaleUrl(lang, url.pathname)
    };
  });
}

export function resolveLanguage(lang: Lang, availableLanguages: string[]) {
  return availableLanguages.find(l => l.startsWith(lang)) ??
    availableLanguages.find(l => l.startsWith(defaultLang)) ??
    availableLanguages[0];
}

const mappings = [
  {url: "https://github.com/swiss/publiccode-editor.git", org: "https://ld.admin.ch/office/I.1.1"},
  {url: "https://github.com/swiss/oss-catalog", org: "https://ld.admin.ch/office/I.1.1"},
  {url: "https://github.com/sfa-siard/siard-suite.git", org:  "https://ld.admin.ch/office/II.1.4"},
  {url: "https://github.com/swiss/opensource-guidelines.git", org: "https://ld.admin.ch/office/I.1.1"},
  {url: "https://github.com/jeap-admin-ch/jeap-crypto.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-truststore-maven-plugin.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-internal-spring-boot-parent.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-spring-boot-parent.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-message-type-registry.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-test-message-type-registry.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-messaging.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-python-pipeline-lib.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-license-template.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-bptestagent-api.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-archrepo-service.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-spring-boot-starters.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-error-handling.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-bptest-orchestrator.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-message-contract-service.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-initializer.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-process-archive-service.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-oauth-mock-server.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-message-exchange-service.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-spring-boot-config-aws-starter.git", org: "https://ld.admin.ch/office/V.1.7"},
  {url: "https://github.com/jeap-admin-ch/jeap-process-archive-reader.git", org: "https://ld.admin.ch/office/V.1.7"}];

export function orgFromUrl(url: string): string {
  return mappings.find(m => m.url === url)?.org ?? "n/a";
}

