import type { Software } from "@/lib/software";
import { LinkButton } from "./LinkButton.tsx";
import { RepositoryPlatformLogo } from "./RepositoryPlatformLogo.tsx";
import { getYear } from "date-fns";
import { type Lang, useTranslations } from "@/i18n/utils";
import organisations from "@/data/organisations.json";
import { getCantonFlag } from "@/utils/cantonFlags";
import  schweizFlag  from "@/images/Wappen-Schweiz.svg";
import { CANTON_URI_PREFIX } from "@/stores/filters";

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

  const uri = software.publiccode.organisation?.uri;
  const flag = uri?.startsWith(CANTON_URI_PREFIX)
    ? getCantonFlag(uri)
    : schweizFlag;
  const flagLabel = uri?.startsWith(CANTON_URI_PREFIX)
    ? toOrganisationName(uri)
    : t('index.filter.option.bund');

  return (
    <div className="card card--default" has-icon="false">
      <div className="card__content">
        <div className="card__body">
          <div className="flex items-center">
            {flag && (
              <img src={flag.src} alt={flagLabel} className="logo__flag mr-6" />
            )}
            <p className="meta-info">
              {software.publiccode.releaseDate && (
                <span className="meta-info__item">
                  {getYear(software.publiccode.releaseDate)}
                </span>
              )}
              {software.publiccode.legal?.license && (
                <span className="meta-info__item">
                  {software.publiccode.legal?.license}
                </span>
              )}
            </p>
          </div>
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
              <RepositoryPlatformLogo url={software.url} />
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