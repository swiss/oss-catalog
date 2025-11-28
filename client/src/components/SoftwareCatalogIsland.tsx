import { useMemo, useState } from "react";
import yaml from "js-yaml";
import type { Software } from "../types/software";
import { useTranslations } from "../i18n/utils";
import {
  SoftwareFilters,
  type Department,
  type Locale,
} from "./SoftwareFilters";
import { SoftwareList } from "./SoftwareList";

type Props = {
  lang: Locale;
  organisations: Department[];
  softwares: Software[];
};

export default function SoftwareCatalogIsland({
  lang,
  organisations,
  softwares,
}: Props) {
  const [selectedOrganisations, setSelectedOrganisations] = useState<string[]>(
    [],
  );
  const [nameQuery, setNameQuery] = useState("");
  const t = useTranslations(lang);

  const filteredSoftwares = useMemo(() => {
    const hasOrganisationFilter =
      selectedOrganisations && selectedOrganisations.length > 0;
    const organisationSet = hasOrganisationFilter
      ? new Set(selectedOrganisations)
      : null;

    const trimmedNameQuery = nameQuery.trim().toLowerCase();
    const hasNameFilter = trimmedNameQuery.length > 0;

    if (!hasOrganisationFilter && !hasNameFilter) return softwares;

    return softwares.filter((s) => {
      let content: any;
      try {
        content = yaml.load(s.publiccodeYml as unknown as string);
      } catch {
        // If we cannot parse publiccodeYml, we cannot reliably filter by name or organisation
        return false;
      }

      let matchesOrganisation = true;
      if (hasOrganisationFilter && organisationSet) {
        const orgUri: string | undefined = content?.organisation?.uri;
        matchesOrganisation = orgUri ? organisationSet.has(orgUri) : false;
      }

      let matchesName = true;
      if (hasNameFilter) {
        const nameValue = (content?.name ?? "").toString().toLowerCase();
        matchesName = nameValue.includes(trimmedNameQuery);
      }

      return matchesOrganisation && matchesName;
    });
  }, [softwares, selectedOrganisations, nameQuery]);

  return (
    <>
      <SoftwareFilters
        lang={lang}
        organisations={organisations}
        onSelectedOrganisationsChange={setSelectedOrganisations}
        nameQuery={nameQuery}
        onNameQueryChange={setNameQuery}
      />
      <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />
    </>
  );
}
