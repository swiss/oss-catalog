import React, { useMemo, useState } from "react";

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
};

export default function OrganisationFilterIsland({ lang, i18n, organisations }: Props) {
  const [query, setQuery] = useState("");

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
      <div className="select">
        {filtered.map((dept: Department) => (
          <div key={dept.id} className="form__group">
            <strong>{dept.name[lang] || dept.name.en || ""}</strong>
            <ul className="select__options">
              {dept.organisations.map((org: Organisation) => (
                <li key={org.id} className="select__option">
                  {(org.name[lang] || org.name.en || "")}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
