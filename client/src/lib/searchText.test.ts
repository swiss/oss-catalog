import { describe, it, expect } from "vitest";
import { buildSearchText } from "./searchText";
import { getDescription, type Software } from "./software";

const software = {
  url: "https://github.com/example/app",
  categories: [],
  publiccode: {
    name: "App",
    description: {
      en: { shortDescription: "Tax calculator", features: ["Export"] },
      "fr-CH": { shortDescription: "Calculateur fiscal" },
    },
  },
} as unknown as Software;

describe("getDescription", () => {
  it("falls back to another language when the page language is missing", () => {
    expect(getDescription(software.publiccode, "de")?.shortDescription).toBe(
      "Tax calculator",
    );
  });

  it("matches regional keys like fr-CH", () => {
    expect(getDescription(software.publiccode, "fr")?.shortDescription).toBe(
      "Calculateur fiscal",
    );
  });

  it("returns undefined without descriptions", () => {
    expect(getDescription({ name: "x" }, "de")).toBeUndefined();
  });
});

describe("buildSearchText", () => {
  it("finds the English description on the German page", () => {
    expect(buildSearchText(software, "de")).toContain("tax calculator");
  });
});
