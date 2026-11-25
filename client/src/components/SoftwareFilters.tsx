import { useMemo } from "react";
import { useStore } from "@nanostores/react";
import { Combobox } from "@/components/Combobox.tsx";
import { useTranslations } from "@/i18n/utils";
import { selectedOrganisations } from "@/stores/filters.ts";
import {
  type Department,
  type Organisation,
  isCantonGroup,
  isMunicipalityGroup,
  localizedName,
} from "@/lib/organisations";

export type { Department, Organisation };

export type Locale = "en" | "de" | "fr" | "it";

type Props = {
  lang: Locale;
  organisations: Department[];
};

export function SoftwareFilters({ lang, organisations }: Props) {
  const t = useTranslations(lang);
  const $selectedOrganisations = useStore(selectedOrganisations);

  const toLabel = (
    unit: Organisation | Department,
    suffix: Organisation["alternativeName"] | Department["abbreviation"],
  ) => {
    const name = localizedName(unit.name, lang) ?? "";
    const suffixText = localizedName(suffix, lang);
    return `${name}${suffixText ? ` (${suffixText})` : ""}`.trim();
  };

  const groupedOptions = useMemo(() => {
    return organisations
      .filter((d) => !isCantonGroup(d) && !isMunicipalityGroup(d))
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
        id="organization-filter"
        groups={groupedOptions}
        lang={lang}
        value={$selectedOrganisations}
        onChange={(values) => selectedOrganisations.set(values)}
      />
    </>
  );
}
