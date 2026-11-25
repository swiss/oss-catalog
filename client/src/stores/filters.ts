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

const PARAM_KEYS = {
  type: "type",
  organisations: "organisations",
  cantons: "cantons",
  municipalities: "municipalities",
  q: "q",
} as const;

const ALLOWED_TYPES: OrganisationType[] = [
  "all",
  "bund",
  "cantons",
  "municipalities",
];

function isOrganisationType(value: string): value is OrganisationType {
  return ALLOWED_TYPES.includes(value as OrganisationType);
}

/** Keeps only the selection that belongs to the given type. */
export function clearSelectionsForType(type: OrganisationType) {
  if (type !== "bund" && type !== "all") selectedOrganisations.set([]);
  if (type !== "cantons") selectedCantons.set([]);
  if (type !== "municipalities") selectedMunicipalities.set([]);
}

let filtersAppliedFromUrl = false;

export function applyFiltersFromUrl() {
  if (filtersAppliedFromUrl || typeof window === "undefined") return;
  filtersAppliedFromUrl = true;

  const params = new URLSearchParams(window.location.search);

  const type = params.get(PARAM_KEYS.type);
  organisationType.set(type && isOrganisationType(type) ? type : "all");

  selectedOrganisations.set(
    params
      .getAll(PARAM_KEYS.organisations)
      .filter(
        (uri) => findOrganisation(uri) && getOrganisationKind(uri) === "bund",
      ),
  );
  selectedCantons.set(params.getAll(PARAM_KEYS.cantons).filter(isKnownCanton));
  selectedMunicipalities.set(
    params.getAll(PARAM_KEYS.municipalities).filter(isKnownMunicipality),
  );

  searchTerm.set(params.get(PARAM_KEYS.q) ?? "");

  clearSelectionsForType(organisationType.get());
}

function buildUrlParams(): URLSearchParams {
  const params = new URLSearchParams();
  const type = organisationType.get();

  if (type !== "all") {
    params.set(PARAM_KEYS.type, type);
  }

  selectedOrganisations
    .get()
    .forEach((uri) => params.append(PARAM_KEYS.organisations, uri));
  selectedCantons
    .get()
    .forEach((uri) => params.append(PARAM_KEYS.cantons, uri));
  selectedMunicipalities
    .get()
    .forEach((uri) => params.append(PARAM_KEYS.municipalities, uri));

  const q = searchTerm.get();
  if (q) {
    params.set(PARAM_KEYS.q, q);
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
  selectedOrganisations.subscribe(scheduleUrlUpdate);
  selectedCantons.subscribe(scheduleUrlUpdate);
  selectedMunicipalities.subscribe(scheduleUrlUpdate);
  searchTerm.subscribe(scheduleUrlUpdate);
}
