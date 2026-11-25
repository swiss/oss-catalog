import { type CatalogSoftware, getDescription } from "@/lib/software";
import { RepositoryPlatformLogo } from "./RepositoryPlatformLogo.tsx";
import { safeHref } from "@/lib/repoUrl";
import { type Lang, useTranslations } from "@/i18n/utils";
import { getCantonFlag } from "@/utils/cantonFlags";
import schweizFlag from "@/images/Wappen-Schweiz.svg";
import {
  findOrganisation,
  getCantonOfMunicipality,
  getOrganisationKind,
  localizedName,
} from "@/lib/organisations";

export function SoftwareCard({
  software,
  detailUrl,
  lang,
}: {
  software: CatalogSoftware;
  detailUrl: string;
  lang: Lang;
}) {
  const t = useTranslations(lang);

  const toOrganisationName = (uri: string | undefined) =>
    localizedName(findOrganisation(uri)?.organisation.name, lang);

  const uri = software.publiccode.organisation?.uri;
  const kind = getOrganisationKind(uri);
  const cantonUri = kind === "canton" ? uri : getCantonOfMunicipality(uri);
  const flag =
    kind === "bund" ? schweizFlag : cantonUri && getCantonFlag(cantonUri);
  const flagLabel =
    kind === "bund"
      ? t("index.filter.option.bund")
      : toOrganisationName(cantonUri);
  const organisationName =
    toOrganisationName(uri) ?? software.publiccode.organisation?.name;

  return (
    <div className="card card--default">
      <div className="card__content">
        <div className="card__body">
          <div className="flex items-center">
            {flag && (
              <img src={flag.src} alt={flagLabel} className="logo__flag mr-6" />
            )}
            <p className="meta-info">
              {software.publiccode.releaseDate && (
                <span className="meta-info__item">
                  {new Date(software.publiccode.releaseDate).getUTCFullYear()}
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
              {organisationName}
            </span>
          </div>
          <p>{getDescription(software.publiccode, lang)?.shortDescription}</p>
        </div>
        <div className="card__footer">
          <div className="card__footer__info">
            <a
              href={safeHref(software.url)}
              target="_blank"
              rel="noreferrer"
              aria-label={t("software.source")}
            >
              <RepositoryPlatformLogo url={software.url} />
            </a>
          </div>
          <div className="card__footer__action">
            <a
              href={detailUrl}
              rel="noopener"
              className="btn btn--base btn--outline"
            >
              <span className="btn__text">
                {t("software.more")}
                <span className="sr-only"> {software.publiccode.name}</span>
              </span>
              <svg
                viewBox="0 0 24 24"
                className="btn__icon icon icon--base icon--ArrowRight"
              >
                <path d="m16.444 19.204 4.066-7.044-4.066-7.044-.65.375 3.633 6.294h-15.187v.75h15.187l-3.633 6.294z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
