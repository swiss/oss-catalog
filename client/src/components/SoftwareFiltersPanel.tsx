import { useEffect, useMemo, useRef, useState } from "react";
import { Combobox } from "@/components/Combobox.tsx";
import { Input } from "@/components/ui/input";
import { useTranslations } from "../i18n/utils";

export type Locale = "en" | "de" | "fr" | "it";

export type LocalizedString = Partial<Record<Locale | string, string>>;

export type Organisation = {
  id: string;
  name: LocalizedString;
};

export type Department = {
  id: string;
  name: LocalizedString;
  organisations: Organisation[];
};

type Props = {
  lang: Locale;
  organisations: Department[];
  selectedOrganisations: string[];
  onSelectedOrganisationsChange: (values: string[]) => void;
  nameQuery: string;
  onNameQueryChange: (value: string) => void;
};

export function SoftwareFiltersPanel({
  lang,
  organisations,
  selectedOrganisations,
  onSelectedOrganisationsChange,
  nameQuery,
  onNameQueryChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations(lang);

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
          onChange={(values) => onSelectedOrganisationsChange(values)}
        />
      </div>

      <div className="form__group" style={{ marginTop: "1rem" }}>
        <label className="text--base" htmlFor="software-name-filter">
          {t("index.filterByName")}
        </label>
        <Input
          id="software-name-filter"
          value={nameQuery}
          onChange={(e) => onNameQueryChange(e.target.value)}
          placeholder={t("index.filterByName.placeholder")}
        />
      </div>
    </div>
  );
}
