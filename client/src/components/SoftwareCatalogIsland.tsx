import { useEffect, useMemo } from "react";
import type { Software } from "@/lib/software";
import { useTranslations } from "@/i18n/utils";
import { SoftwareList } from "./SoftwareList";
import { useStore } from "@nanostores/react";
import {
  CANTON_URI_PREFIX,
  applyFiltersFromUrl,
  searchTerm,
  organisationType,
  selectedCantons,
  selectedOrganisations,
  syncFiltersToUrl,
} from "@/stores/filters";
import { buildSearchText } from "@/lib/searchText";
import type { Lang } from "@/i18n/utils";

type Props = {
  lang: Lang;
  softwares: Software[];
};

export default function SoftwareCatalogIsland({ lang, softwares }: Props) {
  const $organisationType = useStore(organisationType);
  const $selectedOrganisations = useStore(selectedOrganisations);
  const $selectedCantons = useStore(selectedCantons);
  const $searchTerm = useStore(searchTerm);
  const t = useTranslations(lang);

  useEffect(() => {
    applyFiltersFromUrl();
    syncFiltersToUrl();
  }, []);

  const trimmedSearchTerm = $searchTerm.trim().toLowerCase();

  const queryTokens = useMemo(
    () => trimmedSearchTerm.split(/\s+/).filter(Boolean),
    [trimmedSearchTerm],
  );

  const searchTexts = useMemo(
    () => new Map(softwares.map((s) => [s, buildSearchText(s, lang)])),
    [softwares, lang],
  );

  const filteredSoftwares = useMemo(() => {
    if (
      $organisationType === "all" &&
      !$selectedOrganisations?.length &&
      !$selectedCantons?.length &&
      !trimmedSearchTerm
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
        ? organisationUri?.startsWith(CANTON_URI_PREFIX) &&
          selectedCantons.has(organisationUri)
        : true;
      const matchesOrganisation = selectedOrganisations
        ? organisationUri !== undefined &&
          selectedOrganisations.has(organisationUri)
        : true;
      const searchText = searchTexts.get(s);
      const matchesQuery = queryTokens.length
        ? queryTokens.every((token) => searchText?.includes(token) ?? false)
        : true;

      if ($organisationType === "cantons") {
        return (
          matchesQuery &&
          matchesCanton &&
          organisationUri?.startsWith(CANTON_URI_PREFIX)
        );
      }

      if ($organisationType === "bund") {
        return (
          matchesQuery &&
          matchesOrganisation &&
          !organisationUri?.startsWith(CANTON_URI_PREFIX)
        );
      }

      return matchesQuery && matchesOrganisation;
    });
  }, [
    softwares,
    $selectedOrganisations,
    $selectedCantons,
    trimmedSearchTerm,
    queryTokens,
    $organisationType,
    searchTexts,
  ]);

  return <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />;
}
