import {atom} from "nanostores";

export type OrganisationType = "all" | "bund" | "cantons";

export const CANTON_URI_PREFIX = "https://ld.admin.ch/canton/";

export const selectedOrganisations = atom<string[]>([]);
export const nameQuery = atom<string>("");
export const organisationType = atom<OrganisationType>("all");
