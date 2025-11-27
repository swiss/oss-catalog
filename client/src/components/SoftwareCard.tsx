import type { Software } from "@/types/software";
import { GithubLogo } from "./GithubLogo.tsx";
import { LinkButton } from "./LinkButton.tsx";
import { getYear } from "date-fns";
import { type Lang, useTranslations } from "../i18n/utils";

export function SoftwareCard({
  software,
  content,
  detailUrl,
  lang,
  organisationName,
}: {
  software: Software;
  content: any;
  detailUrl: string;
  lang: Lang;
  organisationName?: string;
}) {
  const t = useTranslations(lang);
  return (
    <div className="card card--default" has-icon="false">
      <div className="card__content">
        <div className="card__body">
          <p className="meta-info">
            {content.releaseDate && (
              <span className="meta-info__item">
                {getYear(content.releaseDate)}
              </span>
            )}
            {content.softwareVersion && (
              <span className="meta-info__item">{content.softwareVersion}</span>
            )}
            {content.legal?.license && (
              <span className="meta-info__item">{content.legal?.license}</span>
            )}
          </p>
          <div>
            <h2 className="card__title">{content.name}</h2>
            <span className="meta-info meta-info__item">{organisationName}</span>
          </div>
          <p>{content.description[lang]?.shortDescription}</p>
        </div>
        <div className="card__footer">
          <div className="card__footer__info">
            <a
              href={software.url}
              target="_blank"
              aria-label={t("software.source")}
            >
              <GithubLogo />
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
