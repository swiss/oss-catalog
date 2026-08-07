import { atom } from "nanostores";

export type OrganisationType = "all" | "bund" | "cantons";

export const CANTON_URI_PREFIX = "https://ld.admin.ch/canton";

export const selectedOrganisations = atom<string[]>([]);
export const selectedCantons = atom<string[]>([]);
export const searchTerm = atom<string>("");
export const organisationType = atom<OrganisationType>("all");

const PARAM_KEYS = {
  type: "type",
  organisations: "organisations",
  cantons: "cantons",
  q: "q",
} as const;

const ALLOWED_TYPES: OrganisationType[] = ["all", "bund", "cantons"];

function isOrganisationType(value: string): value is OrganisationType {
  return ALLOWED_TYPES.includes(value as OrganisationType);
}

function normaliseFilters() {
  const type = organisationType.get();
  if (type === "cantons") {
    selectedOrganisations.set([]);
  } else {
    selectedCantons.set([]);
  }
}

let filtersAppliedFromUrl = false;

export function applyFiltersFromUrl() {
  if (filtersAppliedFromUrl || typeof window === "undefined") return;
  filtersAppliedFromUrl = true;

  const params = new URLSearchParams(window.location.search);

  const type = params.get(PARAM_KEYS.type);
  if (type && isOrganisationType(type)) {
    organisationType.set(type);
  } else if (type === null) {
    organisationType.set("all");
  }

  const organisations = params.get(PARAM_KEYS.organisations);
  selectedOrganisations.set(
    organisations ? organisations.split(",").filter(Boolean) : [],
  );

  const cantons = params.get(PARAM_KEYS.cantons);
  selectedCantons.set(cantons ? cantons.split(",").filter(Boolean) : []);

  const q = params.get(PARAM_KEYS.q);
  searchTerm.set(q ?? "");

  normaliseFilters();
}

function buildUrlParams(): URLSearchParams {
  const params = new URLSearchParams();
  const type = organisationType.get();

  if (type !== "all") {
    params.set(PARAM_KEYS.type, type);
  }

  const organisations = selectedOrganisations.get();
  if (organisations.length > 0) {
    params.set(PARAM_KEYS.organisations, organisations.join(","));
  }

  const cantons = selectedCantons.get();
  if (cantons.length > 0) {
    params.set(PARAM_KEYS.cantons, cantons.join(","));
  }

  const q = searchTerm.get();
  if (q) {
    params.set(PARAM_KEYS.q, q);
  }

  return params;
}

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

function updateUrl() {
  if (typeof window === "undefined") return;
  const params = buildUrlParams();
  const query = params.toString();
  const newUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState(null, "", newUrl);
}

function updateUrlDebounced() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(updateUrl, 300);
}

let urlSyncInitialised = false;

export function syncFiltersToUrl() {
  if (urlSyncInitialised || typeof window === "undefined") return;
  urlSyncInitialised = true;

  const unsubscribes = [
    organisationType.subscribe(updateUrl),
    selectedOrganisations.subscribe(updateUrl),
    selectedCantons.subscribe(updateUrl),
    searchTerm.subscribe(updateUrlDebounced),
  ];

  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
  };
}
