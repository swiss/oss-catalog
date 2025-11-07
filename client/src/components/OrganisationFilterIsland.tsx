import React, { useEffect, useMemo, useRef, useState } from "react";
import yaml from "js-yaml";
import type { Software } from "../types/software";

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
      .map((dept) => ({
        id: dept.id,
        label: dept.name[lang] || dept.name.en || "",
        organisations: dept.organisations.filter((o) => {
          if (!q) return true;
          return (o.name[lang] || o.name.en || "").toLowerCase().includes(q);
        }),
      }))
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
    <div className="container">
      <div
        className="form__group"
        ref={dropdownRef}
        style={{ position: "relative" }}
      >
        <label className="text--base" htmlFor="org-input">
          {i18n.filterLabel}
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="org-input"
            className="input--outline input--base"
            type="text"
            placeholder={i18n.searchPlaceholder}
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
          />
          <button
            type="button"
            aria-label="toggle"
            className="btn btn--ghost"
            onClick={() => setOpen((o) => !o)}
            style={{ position: "absolute", right: 6, top: 6, padding: 4 }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
        </div>

        {open && (
          <div
            className="card"
            style={{
              position: "absolute",
              zIndex: 2000,
              width: "100%",
              height: "10rem",
              backgroundColor: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            <div
              className="card__body"
              style={{
                maxHeight: "10rem",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div
                className="select"
                role="listbox"
                aria-label={i18n.filterLabel}
              >
                <ul className="select__options">
                  <li className="select__option">
                    <label className="radio">
                      <input
                        type="radio"
                        name="org"
                        checked={selectedOrgId === null}
                        onChange={() => {
                          setSelectedOrgId(null);
                          setOpen(false);
                        }}
                      />
                      <span className="radio__label">{i18n.allOption}</span>
                    </label>
                  </li>
                </ul>
                {groupedOptions.map((dept) => (
                  <div key={dept.id} className="form__group">
                    <strong>{dept.label}</strong>
                    <ul className="select__options">
                      {dept.organisations.map((org) => (
                        <li key={org.id} className="select__option">
                          <label className="radio">
                            <input
                              type="radio"
                              name="org"
                              checked={selectedOrgId === org.id}
                              onChange={() => {
                                setSelectedOrgId(org.id);
                                setOpen(false);
                              }}
                            />
                            <span className="radio__label">
                              {org.name[lang] || org.name.en || ""}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
    </div>
  );
}
