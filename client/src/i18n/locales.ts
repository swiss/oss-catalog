import en from "./locales.en.json";
import de from "./locales.de.json";
import it from "./locales.it.json";
import fr from "./locales.fr.json";

export const languages = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
};

export const defaultLang = "en";

export const locales = {
  en,
  de,
  it,
  fr,
} as const;
