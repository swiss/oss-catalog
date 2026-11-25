import { describe, it, expect } from "vitest";
import {
  CANTON_URI_PREFIX,
  findOrganisation,
  getCantonOfMunicipality,
  getOrganisationKind,
  isCantonGroup,
  isKnownMunicipality,
  isMunicipalityGroup,
  localizedName,
  matchesOrganisationFilter,
  organisationLabel,
  organisations,
} from "./organisations";

const OFFICE = "https://ld.admin.ch/office/I.1.1"; // a federal office
const CANTON_BE = "https://ld.admin.ch/canton/2";
const MUNI_BERN = "https://ld.admin.ch/municipality/351";

describe("getOrganisationKind", () => {
  it("classifies federal, canton, municipality and unknown URIs", () => {
    expect(getOrganisationKind(OFFICE)).toBe("bund");
    expect(getOrganisationKind(CANTON_BE)).toBe("canton");
    expect(getOrganisationKind(MUNI_BERN)).toBe("municipality");
    expect(getOrganisationKind("https://example.com/x")).toBe("bund");
    expect(getOrganisationKind(undefined)).toBe("bund");
  });
});

describe("localizedName", () => {
  it("falls back current language → de → any", () => {
    expect(localizedName({ de: "D", fr: "F" }, "fr")).toBe("F");
    expect(localizedName({ de: "D", fr: "F" }, "it")).toBe("D");
    expect(localizedName({ fr: "F" }, "it")).toBe("F");
    expect(localizedName({ it: "", fr: "F" }, "it")).toBe("F");
    expect(localizedName(undefined, "de")).toBeUndefined();
  });
});

describe("municipalities", () => {
  it("finds a municipality and its canton", () => {
    expect(findOrganisation(MUNI_BERN)?.organisation.name.de).toBe("Bern (BE)");
    expect(getCantonOfMunicipality(MUNI_BERN)).toBe(CANTON_BE);
    expect(getCantonOfMunicipality(CANTON_BE)).toBeUndefined();
    expect(isKnownMunicipality(MUNI_BERN)).toBe(true);
    expect(
      isKnownMunicipality("https://ld.admin.ch/municipality/canton/2"),
    ).toBe(false);
  });
});

describe("matchesOrganisationFilter", () => {
  const uris = [OFFICE, CANTON_BE, MUNI_BERN, undefined];
  const match = (
    type: Parameters<typeof matchesOrganisationFilter>[1],
    sel?: string[],
  ) =>
    uris.filter((u) =>
      matchesOrganisationFilter(u, type, sel ? new Set(sel) : null),
    );

  it("filters by type", () => {
    expect(match("all")).toEqual(uris);
    expect(match("bund")).toEqual([OFFICE, undefined]);
    expect(match("cantons")).toEqual([CANTON_BE]);
    expect(match("municipalities")).toEqual([MUNI_BERN]);
  });

  it("filters by selection", () => {
    expect(match("municipalities", [MUNI_BERN])).toEqual([MUNI_BERN]);
    expect(
      match("municipalities", ["https://ld.admin.ch/municipality/1"]),
    ).toEqual([]);
    expect(match("bund", [OFFICE])).toEqual([OFFICE]);
    expect(match("all", [CANTON_BE])).toEqual([CANTON_BE]);
  });
});

describe("organisations.json guard", () => {
  it("has the cantons group as the only group id with the canton prefix", () => {
    const withPrefix = organisations.filter(
      (g) => isCantonGroup(g) || g.id.startsWith(CANTON_URI_PREFIX),
    );
    expect(withPrefix.map((g) => g.id)).toEqual(["https://ld.admin.ch/canton"]);
  });

  it("maps every municipality group to an existing canton", () => {
    const groups = organisations.filter(isMunicipalityGroup);
    expect(groups).toHaveLength(26);
    for (const group of groups) {
      const canton = getCantonOfMunicipality(group.organisations[0].id);
      expect(canton && findOrganisation(canton)?.group).toSatisfy(
        (g) => !!g && isCantonGroup(g),
      );
    }
  });

  it("has no federal group containing canton or municipality URIs", () => {
    for (const group of organisations) {
      if (isCantonGroup(group) || isMunicipalityGroup(group)) continue;
      for (const o of group.organisations) {
        expect(getOrganisationKind(o.id), o.id).toBe("bund");
      }
    }
  });
});

describe("organisationLabel", () => {
  it("adds the abbreviation of a department or the alternative name of an organisation", () => {
    expect(
      organisationLabel(
        {
          id: "d",
          name: { de: "Departement" },
          abbreviation: { de: "D" },
          organisations: [],
        },
        "fr",
      ),
    ).toBe("Departement (D)");
    expect(
      organisationLabel(
        {
          id: "o",
          name: { de: "Amt", fr: "Office" },
          alternativeName: { fr: "O" },
        },
        "fr",
      ),
    ).toBe("Office (O)");
    expect(organisationLabel({ id: "o", name: { de: "Amt" } }, "de")).toBe(
      "Amt",
    );
  });
});
