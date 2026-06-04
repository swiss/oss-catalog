import { useMemo } from "react";
import type { Software } from "@/types/software";
import { useTranslations } from "@/i18n/utils";
import { type Locale } from "./SoftwareFilters";
import { SoftwareList } from "./SoftwareList";
import { useStore } from "@nanostores/react";
import {
  CANTON_URI_PREFIX,
  nameQuery,
  organisationType,
  selectedCantons,
  selectedOrganisations,
} from "@/stores/filters";

type Props = {
  lang: Locale;
  softwares: Software[];
};

export default function SoftwareCatalogIsland({ lang, softwares }: Props) {
  const $organisationType = useStore(organisationType);
  const $selectedOrganisations = useStore(selectedOrganisations);
  const $selectedCantons = useStore(selectedCantons);
  const $nameQuery = useStore(nameQuery);
  const t = useTranslations(lang);

  const filteredSoftwares = useMemo(() => {
    const hasOrganisationFilter =
      $selectedOrganisations && $selectedOrganisations.length > 0;
    const selectedOrganisationUnits = hasOrganisationFilter
      ? new Set($selectedOrganisations)
      : null;

    const hasCantonFilter = $selectedCantons && $selectedCantons.length > 0;
    const selectedCantons = hasCantonFilter ? new Set($selectedCantons) : null;

    const trimmedNameQuery = $nameQuery.trim().toLowerCase();
    const hasNameFilter = trimmedNameQuery.length > 0;

    if (
      $organisationType === "all" &&
      !hasOrganisationFilter &&
      !hasCantonFilter &&
      !hasNameFilter
    )
      return softwares;

    return softwares.filter((s) => {
      const organisationUri = s.publiccode?.organisation?.uri;

      let matchesCanton = true;
      if (hasCantonFilter && selectedCantons) {
        matchesCanton = organisationUri
          ? selectedCantons.has(organisationUri)
          : false;
      }

      let matchesOrganisation = true;
      if (hasOrganisationFilter && selectedOrganisationUnits) {
        matchesOrganisation = organisationUri
          ? selectedOrganisationUnits.has(organisationUri)
          : false;
      }

      let matchesName = true;
      if (hasNameFilter) {
        const nameValue = (s.publiccode?.name ?? "").toString().toLowerCase();
        matchesName = nameValue.includes(trimmedNameQuery);
      }

      if ($organisationType === "cantons") {
        return (
          matchesName &&
          matchesCanton &&
          organisationUri.startsWith(CANTON_URI_PREFIX)
        );
      }

      if ($organisationType === "bund") {
        return (
          matchesName &&
          matchesOrganisation &&
          !organisationUri.startsWith(CANTON_URI_PREFIX)
        );
      }

      if ($organisationType === "all") {
        return matchesName && matchesOrganisation;
      }

      return true;
    });
  }, [softwares, $selectedOrganisations, $selectedCantons, $nameQuery, $organisationType]);

  return (
    <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />
  );
}
