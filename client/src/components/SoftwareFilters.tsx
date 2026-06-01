import { useEffect, useMemo, useRef, useState } from "react";
import { Combobox } from "@/components/Combobox.tsx";
import { useTranslations } from "../i18n/utils";
import { selectedOrganisations as selectedOrganisations$ } from "@/stores/filters.ts";

export type Locale = "en" | "de" | "fr" | "it";

export type LocalizedString = Partial<Record<Locale | string, string>>;

export type Organisation = {
  id: string;
  name: LocalizedString;
  alternativeName?: LocalizedString;
};

export type Department = {
  id: string;
  name: LocalizedString;
  abbreviation?: LocalizedString;
  organisations: Organisation[];
};

type Props = {
  lang: Locale;
  organisations: Department[];
};

export function SoftwareFilters({
  lang,
  organisations,
}: Props) {
  const [query] = useState("");
  const [_open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations(lang);

  const toLabel = (unit: Organisation | Department, suffix: Organisation['alternativeName'] | Department['abbreviation']) => {
    return `${unit.name[lang] || unit.name.de || ""} ${suffix ? ` (${suffix[lang] || suffix.de})` : ""}`;
  };

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
          label: toLabel(departement, departement.abbreviation),
          organisations: filteredOrganisations.map((organisation) => ({
            value: organisation.id,
            label: toLabel(organisation, organisation.alternativeName),
          })),
        };
      })
      .filter((d) => d.organisations.length > 0);
  }, [organisations, query, lang]);

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
      <label className="text--base" htmlFor="organization-filter">
        {t("index.filterByOrganisation")}
      </label>
      <Combobox
        groups={groupedOptions}
        lang={lang}
        onChange={(values) => selectedOrganisations$.set(values)}
      />
    </>
  );
}
