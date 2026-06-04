import { useMemo } from "react";
import type { Software } from "@/lib/software";
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

  const trimmedNameQuery = $nameQuery.trim().toLowerCase();

  const filteredSoftwares = useMemo(() => {
    if (
      $organisationType === "all" &&
      !$selectedOrganisations?.length &&
      !$selectedCantons?.length &&
      !trimmedNameQuery
    ) {
      return softwares;
    }

    const selectedOrganisations = $selectedOrganisations?.length
      ? new Set($selectedOrganisations)
      : null;
    const selectedCantons = $selectedCantons?.length
      ? new Set($selectedCantons)
      : null;

    return softwares.filter((s) => {
      const organisationUri = s.publiccode?.organisation?.uri;

      const matchesCanton = selectedCantons
        ? organisationUri?.startsWith(CANTON_URI_PREFIX) && selectedCantons.has(organisationUri)
        : true;
      const matchesOrganisation = selectedOrganisations
        ? selectedOrganisations.has(organisationUri)
        : true;
      const matchesName = trimmedNameQuery
        ? (s.publiccode?.name ?? "").toString().toLowerCase().includes(trimmedNameQuery)
        : true;

      if ($organisationType === "cantons") {
        return matchesName && matchesCanton && organisationUri?.startsWith(CANTON_URI_PREFIX);
      }

      if ($organisationType === "bund") {
        return matchesName && matchesOrganisation && !organisationUri?.startsWith(CANTON_URI_PREFIX);
      }

      return matchesName && matchesOrganisation;
    });
  }, [softwares, $selectedOrganisations, $selectedCantons, trimmedNameQuery, $organisationType]);

  return (
    <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />
  );
}
