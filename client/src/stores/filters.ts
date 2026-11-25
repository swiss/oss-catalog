import { atom } from "nanostores";
import {
  findOrganisation,
  getOrganisationKind,
  isKnownCanton,
  isKnownMunicipality,
} from "@/lib/organisations";

export type OrganisationType = "all" | "bund" | "cantons" | "municipalities";

export const selectedOrganisations = atom<string[]>([]);
export const selectedCantons = atom<string[]>([]);
export const selectedMunicipalities = atom<string[]>([]);
export const searchTerm = atom<string>("");
export const organisationType = atom<OrganisationType>("all");

const ALLOWED_TYPES: OrganisationType[] = [
  "all",
  "bund",
  "cantons",
  "municipalities",
];

function isOrganisationType(value: string): value is OrganisationType {
  return ALLOWED_TYPES.includes(value as OrganisationType);
}

/** Selection store, URL parameter and accepted URIs per organisation type. */
export const SELECTIONS = {
  bund: {
    store: selectedOrganisations,
    param: "organisations",
    isValid: (uri: string) =>
      !!findOrganisation(uri) && getOrganisationKind(uri) === "bund",
  },
  cantons: { store: selectedCantons, param: "cantons", isValid: isKnownCanton },
  municipalities: {
    store: selectedMunicipalities,
    param: "municipalities",
    isValid: isKnownMunicipality,
  },
};

/** "all" filters by the federal organisation selection. */
export function selectionStore(type: OrganisationType) {
  return SELECTIONS[type === "all" ? "bund" : type].store;
}

/** Keeps only the selection that belongs to the given type. */
export function clearSelectionsForType(type: OrganisationType) {
  const kept = selectionStore(type);
  for (const { store } of Object.values(SELECTIONS)) {
    if (store !== kept) store.set([]);
  }
}

let filtersAppliedFromUrl = false;

export function applyFiltersFromUrl() {
  if (filtersAppliedFromUrl || typeof window === "undefined") return;
  filtersAppliedFromUrl = true;

  const params = new URLSearchParams(window.location.search);

  const type = params.get("type");
  organisationType.set(type && isOrganisationType(type) ? type : "all");

  for (const { store, param, isValid } of Object.values(SELECTIONS)) {
    store.set(params.getAll(param).filter(isValid));
  }

  searchTerm.set(params.get("q") ?? "");

  clearSelectionsForType(organisationType.get());
}

function buildUrlParams(): URLSearchParams {
  const params = new URLSearchParams();
  const type = organisationType.get();

  if (type !== "all") {
    params.set("type", type);
  }

  for (const { store, param } of Object.values(SELECTIONS)) {
    store.get().forEach((uri) => params.append(param, uri));
  }

  const q = searchTerm.get();
  if (q) {
    params.set("q", q);
  }

  return params;
}

function updateUrl() {
  const query = buildUrlParams().toString();
  const newUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState(null, "", newUrl);
}

// A single user action can change several atoms (e.g. switching the
// organisation type also clears the opposite selection). Coalescing into a
// microtask keeps that a single history entry rewrite.
let updateScheduled = false;

function scheduleUrlUpdate() {
  if (updateScheduled) return;
  updateScheduled = true;
  queueMicrotask(() => {
    updateScheduled = false;
    updateUrl();
  });
}

let urlSyncInitialised = false;

// The subscriptions intentionally live for the lifetime of the page: the atoms
// are module singletons and every navigation is a full page load.
export function syncFiltersToUrl() {
  if (urlSyncInitialised || typeof window === "undefined") return;
  urlSyncInitialised = true;

  organisationType.subscribe(scheduleUrlUpdate);
  for (const { store } of Object.values(SELECTIONS)) {
    store.subscribe(scheduleUrlUpdate);
  }
  searchTerm.subscribe(scheduleUrlUpdate);
}
