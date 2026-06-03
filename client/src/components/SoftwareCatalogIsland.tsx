import { useMemo } from "react";
import type { Software } from "@/types/software";
import { useTranslations } from "@/i18n/utils";
import { type Locale } from "./SoftwareFilters";
import { SoftwareList } from "./SoftwareList";
import { useStore } from "@nanostores/react";
import { CANTON_URI_PREFIX, nameQuery, organisationType, selectedOrganisations } from "@/stores/filters";

type Props = {
  lang: Locale;
  softwares: Software[];
};

export default function SoftwareCatalogIsland({
                                                lang,
                                                softwares,
                                              }: Props) {
  const $selectedOrganisations = useStore(selectedOrganisations);
  const $nameQuery = useStore(nameQuery);
  const $organisationType = useStore(organisationType);
  const t = useTranslations(lang);

  const filteredSoftwares = useMemo(() => {
    const hasOrganisationFilter =
      $selectedOrganisations && $selectedOrganisations.length > 0;
    const organisationSet = hasOrganisationFilter
      ? new Set($selectedOrganisations)
      : null;

    const trimmedNameQuery = $nameQuery.trim().toLowerCase();
    const hasNameFilter = trimmedNameQuery.length > 0;
    const hasTypeFilter = $organisationType !== "all";

    if (!hasOrganisationFilter && !hasNameFilter && !hasTypeFilter)
      return softwares;

    return softwares.filter((s) => {
      const organisationUri = s.publiccode?.organisation?.uri;

      let matchesType = true;
      if ($organisationType === "bund") {
        matchesType = !organisationUri.startsWith(CANTON_URI_PREFIX);
      } else if ($organisationType === "cantons") {
        matchesType = $selectedOrganisations.includes(organisationUri);
      }

      let matchesOrganisation = true;
      if (hasOrganisationFilter && organisationSet) {
        matchesOrganisation = organisationUri ? organisationSet.has(organisationUri) : false;
      }

      let matchesName = true;
      if (hasNameFilter) {
        const nameValue = (s.publiccode?.name ?? "").toString().toLowerCase();
        matchesName = nameValue.includes(trimmedNameQuery);
      }

      return matchesType && matchesOrganisation && matchesName;
    });
  }, [softwares, $selectedOrganisations, $nameQuery, $organisationType]);

  return (
    <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />
  );
}
