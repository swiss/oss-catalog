import type { Lang } from "@/i18n/utils";
import { type CatalogSoftware, getDescription } from "@/lib/software";
import { renderMarkdown } from "@/lib/markdown";
import {
  findOrganisation,
  getCantonOfMunicipality,
  organisationLabel,
} from "@/lib/organisations";

function findOrganisationLabel(uri: string | undefined, lang: Lang): string {
  const found = findOrganisation(uri);
  return found ? organisationLabel(found.organisation, lang) : "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueCategoryCodes(software: CatalogSoftware): string[] {
  const codes = new Set<string>();
  for (const category of software.categories ?? []) {
    codes.add(category);
  }
  for (const category of software.publiccode?.categories ?? []) {
    codes.add(category);
  }
  return Array.from(codes);
}

export function buildSearchText(software: CatalogSoftware, lang: Lang): string {
  const parts: string[] = [];
  const publiccode = software.publiccode;

  if (publiccode?.name) {
    parts.push(publiccode.name);
  }

  const organisationUri = publiccode?.organisation?.uri;
  const organisationName =
    publiccode?.organisation?.name ||
    findOrganisationLabel(organisationUri, lang);
  if (organisationName) {
    parts.push(organisationName);
  }
  // so "Bern" also finds software of Bernese municipalities
  const cantonLabel = findOrganisationLabel(
    getCantonOfMunicipality(organisationUri),
    lang,
  );
  if (cantonLabel) {
    parts.push(cantonLabel);
  }

  const description = getDescription(publiccode, lang);
  if (description?.shortDescription) {
    parts.push(description.shortDescription);
  }
  if (description?.longDescription) {
    parts.push(stripHtml(renderMarkdown(description.longDescription)));
  }
  if (description?.features?.length) {
    parts.push(...description.features);
  }

  for (const code of uniqueCategoryCodes(software)) {
    parts.push(code.replace(/-/g, " "));
  }

  return parts.join(" ").toLowerCase();
}
