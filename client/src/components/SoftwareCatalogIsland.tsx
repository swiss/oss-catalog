import { useMemo } from "react";
import type { Software } from "@/lib/software";
import { useTranslations } from "@/i18n/utils";
import { SoftwareList } from "./SoftwareList";
import { useStore } from "@nanostores/react";
import {
  CANTON_URI_PREFIX,
  nameQuery,
  organisationType,
  selectedCantons,
  selectedOrganisations,
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
  const $nameQuery = useStore(nameQuery);
  const t = useTranslations(lang);

  const trimmedNameQuery = $nameQuery.trim().toLowerCase();

  const searchTexts = useMemo(
    () => new Map(softwares.map((s) => [s, buildSearchText(s, lang)])),
    [softwares, lang],
  );

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
        ? organisationUri?.startsWith(CANTON_URI_PREFIX) &&
          selectedCantons.has(organisationUri)
        : true;
      const matchesOrganisation = selectedOrganisations
        ? organisationUri !== undefined &&
          selectedOrganisations.has(organisationUri)
        : true;
      const matchesQuery = trimmedNameQuery
        ? (searchTexts.get(s)?.includes(trimmedNameQuery) ?? false)
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
    trimmedNameQuery,
    $organisationType,
    searchTexts,
  ]);

  return <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />;
}
