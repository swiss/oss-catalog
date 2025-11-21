import React, { useEffect, useMemo, useRef, useState } from "react";
import yaml from "js-yaml";
import type { Software } from "../types/software";
import { Combobox } from "@/components/Combobox.tsx";

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
  i18n: {
    filterLabel: string;
    searchPlaceholder: string;
    allOption: string;
  };
  organisations: Department[];
  softwares: Software[];
};

export default function OrganisationFilterIsland({
  lang,
  i18n,
  organisations,
  softwares,
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    if (!selectedOrgId) return softwares;
    return softwares.filter((s) => {
      try {
        const content: any = yaml.load(s.publiccodeYml as unknown as string);
        const orgUri: string | undefined = content?.organisation?.uri;
        return orgUri === selectedOrgId;
      } catch {
        return false;
      }
    });
  }, [softwares, selectedOrgId]);

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
        <label className="text--base" htmlFor="organization-filter">
          {i18n.filterLabel}
        </label>
        <div
          className="form__group__select"
          ref={dropdownRef}
          style={{ position: "relative" }}
        >
          <Combobox
            groups={groupedOptions}
            onChange={(value) => setSelectedOrgId(value)}
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
            const detailUrl = `/softwares/${s.id}`;
            return (
              <div key={s.id} className="card card--default" has-icon="false">
                <div className="card__content">
                  <div className="card__body">
                    <div className="card__title">
                      <h2>{content?.name || s.name}</h2>
                    </div>
                    <p>{content?.description?.en?.shortDescription || ""}</p>
                  </div>
                  <div className="card__footer">
                    <div className="card__footer__action">
                      <a
                        href={detailUrl}
                        className="btn btn--base btn--outline"
                      >
                        <span className="btn__text">More</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredSoftwares.length === 0 && (
          <div id="no-results-message">
            <p>No results</p>
          </div>
        )}
      </div>
    </>
  );
}
