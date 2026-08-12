import type { Lang } from "@/i18n/utils";
import type { Software } from "@/lib/software";
import { renderMarkdown } from "@/lib/markdown";
import organisations from "@/data/organisations.json";

type Department = (typeof organisations)[number];
type Organisation = Department["organisations"][number];
type OrgEntry = Department | Organisation;

function pickLocalized(
  value: Record<string, string> | undefined,
  lang: Lang,
): string | undefined {
  return value?.[lang] ?? value?.de;
}

function labelForEntry(entry: OrgEntry, lang: Lang): string {
  const name = pickLocalized(entry.name, lang) ?? "";
  const alternativeName =
    "alternativeName" in entry
      ? pickLocalized(entry.alternativeName, lang)
      : undefined;
  const abbreviation =
    "abbreviation" in entry
      ? pickLocalized(entry.abbreviation, lang)
      : undefined;
  const suffix = alternativeName ?? abbreviation;
  return suffix ? `${name} ${suffix}` : name;
}

function findOrganisationLabel(uri: string | undefined, lang: Lang): string {
  if (!uri) return "";

  for (const department of organisations) {
    if (department.id === uri) {
      return labelForEntry(department, lang);
    }

    const organisation = department.organisations?.find((o) => o.id === uri);
    if (organisation) {
      return labelForEntry(organisation, lang);
    }
  }

  return "";
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

  const organisationName =
    publiccode?.organisation?.name ||
    findOrganisationLabel(publiccode?.organisation?.uri, lang);
  if (organisationName) {
    parts.push(organisationName);
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
