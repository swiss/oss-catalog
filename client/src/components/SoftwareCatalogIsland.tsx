import { useEffect, useMemo } from "react";
import type { Software } from "@/lib/software";
import { useTranslations } from "@/i18n/utils";
import { SoftwareList } from "./SoftwareList";
import { useStore } from "@nanostores/react";
import {
  applyFiltersFromUrl,
  searchTerm,
  organisationType,
  selectionStore,
  syncFiltersToUrl,
} from "@/stores/filters";
import { buildSearchText } from "@/lib/searchText";
import { matchesOrganisationFilter } from "@/lib/organisations";
import type { Lang } from "@/i18n/utils";

type Props = {
  lang: Lang;
  softwares: Software[];
};

export default function SoftwareCatalogIsland({ lang, softwares }: Props) {
  const $organisationType = useStore(organisationType);
  const selectedUris = useStore(selectionStore($organisationType));
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
      !selectedUris.length &&
      !trimmedSearchTerm
    ) {
      return softwares;
    }

    const selection = selectedUris.length ? new Set(selectedUris) : null;

    return softwares.filter((s) => {
      const searchText = searchTexts.get(s);
      const matchesQuery = queryTokens.every(
        (token) => searchText?.includes(token) ?? false,
      );
      return (
        matchesQuery &&
        matchesOrganisationFilter(
          s.publiccode?.organisation?.uri,
          $organisationType,
          selection,
        )
      );
    });
  }, [
    softwares,
    selectedUris,
    trimmedSearchTerm,
    queryTokens,
    $organisationType,
    searchTexts,
  ]);

  return <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />;
}
