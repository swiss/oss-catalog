import type { Lang } from "@/i18n/utils";
import type { Software } from "@/lib/software";
import { renderMarkdown } from "@/lib/markdown";
import {
  type Department,
  type Organisation,
  findOrganisation,
  getCantonOfMunicipality,
  localizedName,
} from "@/lib/organisations";

function labelForEntry(entry: Department | Organisation, lang: Lang): string {
  const name = localizedName(entry.name, lang) ?? "";
  const alternativeName =
    "alternativeName" in entry
      ? localizedName(entry.alternativeName, lang)
      : undefined;
  const abbreviation =
    "abbreviation" in entry
      ? localizedName(entry.abbreviation, lang)
      : undefined;
  const suffix = alternativeName ?? abbreviation;
  return suffix ? `${name} ${suffix}` : name;
}

function findOrganisationLabel(uri: string | undefined, lang: Lang): string {
  const found = findOrganisation(uri);
  return found ? labelForEntry(found.organisation, lang) : "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueCategoryCodes(software: Software): string[] {
  const codes = new Set<string>();
  for (const category of software.categories ?? []) {
    codes.add(category);
  }
  for (const category of software.publiccode?.categories ?? []) {
    codes.add(category);
  }
  return Array.from(codes);
}

export function buildSearchText(software: Software, lang: Lang): string {
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

  const description = publiccode?.description?.[lang];
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
