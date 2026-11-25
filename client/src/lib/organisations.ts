import data from "../data/organisations.json";
import type { OrganisationType } from "../stores/filters";

export type LocalizedString = Partial<Record<string, string>>;

export type Organisation = {
  id: string;
  name: LocalizedString;
  alternativeName?: LocalizedString;
};

export type Department = {
  id: string;
  name: LocalizedString;
  abbreviation?: LocalizedString;
  organisations: Organisation[];
};

export type OrganisationKind = "bund" | "canton" | "municipality";

export const CANTON_URI_PREFIX = "https://ld.admin.ch/canton/";
export const MUNICIPALITY_URI_PREFIX = "https://ld.admin.ch/municipality/";
const CANTONS_GROUP_ID = "https://ld.admin.ch/canton";
// Group ids only, not LINDAS URIs: https://ld.admin.ch/municipality/canton/<canton number>
const MUNICIPALITY_GROUP_PREFIX = `${MUNICIPALITY_URI_PREFIX}canton/`;

export const organisations = data as Department[];

type Found = { organisation: Organisation | Department; group: Department };

const byUri = new Map<string, Found>();
for (const group of organisations) {
  byUri.set(group.id, { organisation: group, group });
  for (const organisation of group.organisations) {
    // first group wins, like the former linear lookups
    if (!byUri.has(organisation.id))
      byUri.set(organisation.id, { organisation, group });
  }
}

/** For organisation URIs from publiccode.yml, not for group ids. Missing URIs count as "bund". */
export function getOrganisationKind(uri: string | undefined): OrganisationKind {
  if (uri?.startsWith(CANTON_URI_PREFIX)) return "canton";
  if (uri?.startsWith(MUNICIPALITY_URI_PREFIX)) return "municipality";
  return "bund";
}

export function findOrganisation(uri: string | undefined): Found | undefined {
  return uri ? byUri.get(uri) : undefined;
}

export function isCantonGroup(group: Department) {
  return group.id === CANTONS_GROUP_ID;
}

export function isMunicipalityGroup(group: Department) {
  return group.id.startsWith(MUNICIPALITY_GROUP_PREFIX);
}

export function isKnownMunicipality(uri: string) {
  const found = byUri.get(uri);
  return (
    !!found &&
    found.organisation !== found.group &&
    isMunicipalityGroup(found.group)
  );
}

export function isKnownCanton(uri: string) {
  const found = byUri.get(uri);
  return (
    !!found && isCantonGroup(found.group) && found.organisation !== found.group
  );
}

export function getCantonOfMunicipality(
  uri: string | undefined,
): string | undefined {
  const group = findOrganisation(uri)?.group;
  if (!group || !isMunicipalityGroup(group)) return undefined;
  return CANTON_URI_PREFIX + group.id.slice(MUNICIPALITY_GROUP_PREFIX.length);
}

/** Current language → de → first available. */
export function localizedName(
  name: LocalizedString | undefined,
  lang: string,
): string | undefined {
  if (!name) return undefined;
  return name[lang] || name.de || Object.values(name).find(Boolean);
}

/** Catalog filter type that lists organisations of each kind. */
export const ORGANISATION_TYPE_BY_KIND = {
  bund: "bund",
  canton: "cantons",
  municipality: "municipalities",
} as const satisfies Record<OrganisationKind, OrganisationType>;

/** "Name (alternative name or abbreviation)". */
export function organisationLabel(
  entry: Organisation | Department,
  lang: string,
): string {
  const name = localizedName(entry.name, lang) ?? "";
  const suffix = localizedName(
    "organisations" in entry ? entry.abbreviation : entry.alternativeName,
    lang,
  );
  return suffix ? `${name} (${suffix})` : name;
}

/** Organisation type and selection of the catalog filter. */
export function matchesOrganisationFilter(
  uri: string | undefined,
  type: OrganisationType,
  selection: Set<string> | null,
): boolean {
  const selected = !selection || (uri !== undefined && selection.has(uri));
  return (
    selected &&
    (type === "all" ||
      ORGANISATION_TYPE_BY_KIND[getOrganisationKind(uri)] === type)
  );
}
