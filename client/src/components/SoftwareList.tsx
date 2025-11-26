import yaml from "js-yaml";
import { getRelativeLocaleUrl } from "astro:i18n";
import type { Software } from "../types/software";
import { SoftwareCard } from "./SoftwareCard.tsx";
import type { Locale } from "./SoftwareFiltersPanel";
import { useTranslations } from "../i18n/utils";

type Props = {
  lang: Locale;
  softwares: Software[];
  t: ReturnType<typeof useTranslations>;
};

export function SoftwareList({ lang, softwares, t }: Props) {
  return (
    <div className="container">
      <div className="grid grid--responsive-cols-3 gap--responsive">
        {softwares.map((s) => {
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
      {softwares.length === 0 && (
        <div id="no-results-message">
          <p>{t("index.noresults.selectedOrganisations")}</p>
        </div>
      )}
    </div>
  );
}
