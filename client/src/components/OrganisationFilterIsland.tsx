import React, { useMemo, useState } from "react";
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

export default function OrganisationFilterIsland({ lang, i18n, organisations, softwares }: Props) {
  const [query, setQuery] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return organisations;
    return organisations
      .map((dept) => ({
        ...dept,
        organisations: dept.organisations.filter((o) =>
          (o.name[lang] || o.name.en || "").toLowerCase().includes(q)
        ),
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

  return (
    <div className="container">
      <div className="form__group">
        <label htmlFor="org-search" className="text--base">
          {i18n.filterLabel}
        </label>
        <input
          id="org-search"
          className="input--outline input--base"
          type="text"
          placeholder={i18n.searchPlaceholder}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
      </div>

      <div className="form__group">
        <div className="select">
          <ul className="select__options">
            <li className="select__option">
              <label className="radio">
                <input
                  type="radio"
                  name="org"
                  checked={selectedOrgId === null}
                  onChange={() => setSelectedOrgId(null)}
                />
                <span className="radio__label">{i18n.allOption}</span>
              </label>
            </li>
            {filtered.map((dept: Department) => (
              <li key={dept.id} className="select__option">
                <strong>{dept.name[lang] || dept.name.en || ""}</strong>
                <ul className="select__options">
                  {dept.organisations.map((org: Organisation) => (
                    <li key={org.id} className="select__option">
                      <label className="radio">
                        <input
                          type="radio"
                          name="org"
                          checked={selectedOrgId === org.id}
                          onChange={() => setSelectedOrgId(org.id)}
                        />
                        <span className="radio__label">{org.name[lang] || org.name.en || ""}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
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
                      <a href={detailUrl} className="btn btn--base btn--outline">
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
