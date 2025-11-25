import { useEffect, useMemo, useRef, useState } from "react";
import yaml from "js-yaml";
import type { Software } from "../types/software";
import { Combobox } from "@/components/Combobox.tsx";
import { SoftwareCard } from "./SoftwareCard.tsx";
import { useTranslations } from "../i18n/utils";
import { getRelativeLocaleUrl } from "astro:i18n";

type Locale = "en" | "de" | "fr" | "it";

type LocalizedString = Partial<Record<Locale | string, string>>;

type Organisation = {
  id: string;
  name: LocalizedString;
};

type Department = {
  id: string;
  name: LocalizedString;
  organisations: Organisation[];
};

type Props = {
  lang: Locale;
  organisations: Department[];
  softwares: Software[];
};

export default function OrganisationFilterIsland({
  lang,
  organisations,
  softwares,
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedOrganisations, setSelectedOrganisations] = useState<string[]>(
    [],
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations(lang);

  // Grouped, filtered options by department
  const groupedOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return organisations
      .map((departement) => {
        const filteredOrganisations = departement.organisations.filter(
          (organisation) => {
            if (!q) return true;
            return (organisation.name[lang] || organisation.name.de || "")
              .toLowerCase()
              .includes(q);
          },
        );
        return {
          id: departement.id,
          label: departement.name[lang] || departement.name.de || "",
          organisations: filteredOrganisations.map((organisation) => ({
            value: organisation.id,
            label: organisation.name[lang] || organisation.name.de || "",
          })),
        };
      })
      .filter((d) => d.organisations.length > 0);
  }, [organisations, query, lang]);

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

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <div className="container">
        <div
          className="form__group__select"
          ref={dropdownRef}
          style={{ position: "relative" }}
        >
          <label className="text--base" htmlFor="organization-filter">
            {t("index.filter")}
          </label>
          <Combobox
            groups={groupedOptions}
            lang={lang}
            onChange={(values) => setSelectedOrganisations(values)}
          />
        </div>
      </div>

      <div className="container">
        <div className="grid grid--responsive-cols-3 gap--responsive">
          {filteredSoftwares.map((s) => {
            let content: any = {};
            try {
              content = yaml.load(s.publiccodeYml as unknown as string) as any;
            } catch {}
            const detailUrl = `${getRelativeLocaleUrl(lang, "softwares")}${s.id}`;
            return (
              <SoftwareCard
                key={s.id}
                software={s}
                content={content}
                detailUrl={detailUrl}
                lang={lang}
              />
            );
          })}
        </div>
        {filteredSoftwares.length === 0 && (
          <div id="no-results-message">
            <p>{t("index.noresults.selectedOrganisations")}</p>
          </div>
        )}
      </div>
    </>
  );
}
