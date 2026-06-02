import {atom} from "nanostores";

export const selectedOrganisations = atom<string[]>([]);
export const nameQuery = atom<string>("");
