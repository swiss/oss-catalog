import { useMemo } from "react";
import { useStore } from "@nanostores/react";
import { Combobox } from "@/components/Combobox.tsx";
import { useTranslations } from "@/i18n/utils";
import { selectedOrganisations } from "@/stores/filters.ts";
import {
  isCantonGroup,
  isMunicipalityGroup,
  organisationLabel,
  organisations,
} from "@/lib/organisations";

export type Locale = "en" | "de" | "fr" | "it";

type Props = {
  lang: Locale;
};

export function SoftwareFilters({ lang }: Props) {
  const t = useTranslations(lang);
  const $selectedOrganisations = useStore(selectedOrganisations);

  const groupedOptions = useMemo(() => {
    return organisations
      .filter((d) => !isCantonGroup(d) && !isMunicipalityGroup(d))
      .map((departement) => ({
        id: departement.id,
        label: organisationLabel(departement, lang),
        organisations: departement.organisations.map((organisation) => ({
          value: organisation.id,
          label: organisationLabel(organisation, lang),
        })),
      }))
      .filter((d) => d.organisations.length > 0);
  }, [lang]);

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
