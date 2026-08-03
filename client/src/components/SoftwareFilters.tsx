import { useMemo } from "react";
import { Combobox } from "@/components/Combobox.tsx";
import { useTranslations } from "@/i18n/utils";
import { CANTON_URI_PREFIX, selectedOrganisations } from "@/stores/filters.ts";

export type Locale = "en" | "de" | "fr" | "it";

export type LocalizedString = Partial<Record<Locale | string, string>>;

export type Organisation = {
  id: string;
  name: LocalizedString;
  alternativeName?: LocalizedString;
};

export type Department = {
  id: string;
  name: LocalizedString;
  abbreviation?: LocalizedString;
  organisations: Organisation[];
};

type Props = {
  lang: Locale;
  organisations: Department[];
};

export function SoftwareFilters({ lang, organisations }: Props) {
  const t = useTranslations(lang);

  const toLabel = (
    unit: Organisation | Department,
    suffix: Organisation["alternativeName"] | Department["abbreviation"],
  ) => {
    return `${unit.name[lang] || unit.name.de || ""} ${suffix ? ` (${suffix[lang] || suffix.de})` : ""}`;
  };

  const groupedOptions = useMemo(() => {
    return organisations
      .filter((departement) => !departement.id.startsWith(CANTON_URI_PREFIX))
      .map((departement) => ({
        id: departement.id,
        label: toLabel(departement, departement.abbreviation),
        organisations: departement.organisations.map((organisation) => ({
          value: organisation.id,
          label: toLabel(organisation, organisation.alternativeName),
        })),
      }))
      .filter((d) => d.organisations.length > 0);
  }, [organisations, lang]);

  return (
    <>
      <label className="text--base" htmlFor="organization-filter">
        {t("index.filterByOrganisation")}
      </label>
      <Combobox
        groups={groupedOptions}
        lang={lang}
        onChange={(values) => selectedOrganisations.set(values)}
      />
    </>
  );
}
