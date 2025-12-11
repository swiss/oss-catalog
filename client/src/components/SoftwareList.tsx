import yaml from "js-yaml";
import { getRelativeLocaleUrl } from "astro:i18n";
import type { Software } from "../types/software";
import { SoftwareCard } from "./SoftwareCard.tsx";
import type { Locale } from "./SoftwareFilters.tsx";
import { useTranslations } from "../i18n/utils";

type Props = {
  lang: Locale;
  softwares: Software[];
  t: ReturnType<typeof useTranslations>;
};

export function SoftwareList({ lang, softwares, t }: Props) {
  return (
    <div className="container gap--responsive">
      <div
        className="search-results search-results--grid"
        aria-live="polite"
        aria-busy="false"
      >
        <div className="search-results__header">
          <div className="search-results__header__left">
            <strong>{softwares.length}</strong>
            {t("index.results")}
          </div>
        </div>
        <h2 className="sr-only">Results list</h2>
        <ul className="search-results-list">
          {softwares.map((s) => {
            let content: any = {};
            try {
              content = yaml.load(s.publiccodeYml as unknown as string) as any;
            } catch {}
            const detailUrl = `${getRelativeLocaleUrl(lang, "softwares")}${s.id}`;
            return (
              <li key={s.id}>
                <SoftwareCard
                  key={s.id}
                  software={s}
                  content={content}
                  detailUrl={detailUrl}
                  lang={lang}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
