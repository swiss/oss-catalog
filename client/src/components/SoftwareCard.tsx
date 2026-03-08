import type { Software } from "@/types/software";
import { GithubLogo } from "./GithubLogo.tsx";
import { GitlabLogo } from "./Gitlab.logo.tsx";
import { LinkButton } from "./LinkButton.tsx";
import { getYear } from "date-fns";
import { type Lang, useTranslations } from "../i18n/utils";
import organisations from "../data/organisations.json";

export function SoftwareCard({
  software,
  detailUrl,
  lang,
}: {
  software: Software;
  detailUrl: string;
  lang: Lang;
  organisationName?: string;
}) {
  const t = useTranslations(lang);
  const toOrganisationName = (uri: string | undefined) => {
    return organisations
      .flatMap((o) => o.organisations ?? [])
      .find((o) => o.id === uri)?.name?.[lang];
  };

  const getRepositoryPlatform = (url?: string) => {
    if (!url) return "unknown";

    const normalized = url.toLowerCase();

    if (normalized.includes("gitlab")) return "gitlab";
    if (normalized.includes("github")) return "github";

    return "unknown";
  };

  const repositoryPlatform = getRepositoryPlatform(software.url);

  return (
    <div className="card card--default" has-icon="false">
      <div className="card__content">
        <div className="card__body">
          <p className="meta-info">
            {software.publiccode.releaseDate && (
              <span className="meta-info__item">
                {getYear(software.publiccode.releaseDate)}
              </span>
            )}
            {software.publiccode.softwareVersion && (
              <span className="meta-info__item">
                {software.publiccode.softwareVersion}
              </span>
            )}
            {software.publiccode.legal?.license && (
              <span className="meta-info__item">
                {software.publiccode.legal?.license}
              </span>
            )}
          </p>
          <div>
            <h2 className="card__title">{software.publiccode.name}</h2>
            <span className="meta-info meta-info__item">
              {toOrganisationName(software.publiccode.organisation?.uri)}
            </span>
          </div>
          <p>{software.publiccode.description[lang]?.shortDescription}</p>
        </div>
        <div className="card__footer">
          <div className="card__footer__info">
            <a
              href={software.url}
              target="_blank"
              rel="noreferrer"
              aria-label={t("software.source")}
            >
              {repositoryPlatform === "gitlab" ? <GitlabLogo /> : <GithubLogo />}
            </a>
          </div>
          <div className="card__footer__action">
            <LinkButton href={detailUrl} text={t("software.more")} />
          </div>
        </div>
      </div>
    </div>
  );
}
