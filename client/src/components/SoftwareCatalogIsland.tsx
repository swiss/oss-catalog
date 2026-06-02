import { useMemo, useState } from "react";
import type { Software } from "@/lib/software";
import { useTranslations } from "@/i18n/utils";
import { type Locale } from "./SoftwareFilters";
import { SoftwareList } from "./SoftwareList";
import { useStore } from "@nanostores/react";
import { nameQuery, selectedOrganisations } from "@/stores/filters";

type Props = {
  lang: Locale;
  softwares: Software[];
};

export default function SoftwareCatalogIsland({ lang, softwares }: Props) {
  const $selectedOrganisations = useStore(selectedOrganisations);
  const $nameQuery = useStore(nameQuery);
  const t = useTranslations(lang);

  const filteredSoftwares = useMemo(() => {
    const hasOrganisationFilter =
      $selectedOrganisations && $selectedOrganisations.length > 0;
    const organisationSet = hasOrganisationFilter
      ? new Set($selectedOrganisations)
      : null;

    const trimmedNameQuery = $nameQuery.trim().toLowerCase();
    const hasNameFilter = trimmedNameQuery.length > 0;

    if (!hasOrganisationFilter && !hasNameFilter) return softwares;

    return softwares.filter((s) => {
      let matchesOrganisation = true;
      if (hasOrganisationFilter && organisationSet) {
        const orgUri: string | undefined = s.publiccode?.organisation?.uri;
        matchesOrganisation = orgUri ? organisationSet.has(orgUri) : false;
      }

      let matchesName = true;
      if (hasNameFilter) {
        const nameValue = (s.publiccode?.name ?? "").toString().toLowerCase();
        matchesName = nameValue.includes(trimmedNameQuery);
      }

      return matchesOrganisation && matchesName;
    });
  }, [softwares, $selectedOrganisations, $nameQuery]);

  return <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />;
}
