import { useMemo, useState } from "react";
import yaml from "js-yaml";
import type { Software } from "../types/software";
import { useTranslations } from "../i18n/utils";
import {
  SoftwareFiltersPanel,
  type Department,
  type Locale,
} from "./SoftwareFiltersPanel";
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
  const t = useTranslations(lang);

  const filteredSoftwares = useMemo(() => {
    if (!selectedOrganisations || selectedOrganisations.length === 0)
      return softwares;
    const set = new Set(selectedOrganisations);
    return softwares.filter((s) => {
      try {
        const content: any = yaml.load(s.publiccodeYml as unknown as string);
        const orgUri: string | undefined = content?.organisation?.uri;
        return orgUri ? set.has(orgUri) : false;
      } catch {
        return false;
      }
    });
  }, [softwares, selectedOrganisations]);

  return (
    <>
      <SoftwareFiltersPanel
        lang={lang}
        organisations={organisations}
        selectedOrganisations={selectedOrganisations}
        onSelectedOrganisationsChange={setSelectedOrganisations}
      />
      <SoftwareList lang={lang} softwares={filteredSoftwares} t={t} />
    </>
  );
}
