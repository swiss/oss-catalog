import { describe, it, expect } from "vitest";
import { getPubliccodeYmlUrl, safeHref } from "./repoUrl";

describe("getPubliccodeYmlUrl", () => {
  it("returns undefined when the repo URL is missing", () => {
    expect(getPubliccodeYmlUrl(undefined)).toBeUndefined();
  });

  it("returns undefined for unsupported hosts", () => {
    expect(getPubliccodeYmlUrl("https://example.com/repo.git")).toBeUndefined();
  });

  it("builds a GitHub publiccode.yml URL", () => {
    expect(getPubliccodeYmlUrl("https://github.com/swiss/oss-catalog")).toBe(
      "https://github.com/swiss/oss-catalog/blob/HEAD/publiccode.yml",
    );
  });

  it("strips the .git suffix from a GitHub URL", () => {
    expect(
      getPubliccodeYmlUrl("https://github.com/swiss/oss-catalog.git"),
    ).toBe("https://github.com/swiss/oss-catalog/blob/HEAD/publiccode.yml");
  });

  it("strips a trailing slash from a GitHub URL", () => {
    expect(getPubliccodeYmlUrl("https://github.com/swiss/oss-catalog/")).toBe(
      "https://github.com/swiss/oss-catalog/blob/HEAD/publiccode.yml",
    );
  });

  it("builds a GitLab publiccode.yml URL", () => {
    expect(getPubliccodeYmlUrl("https://gitlab.com/owner/project")).toBe(
      "https://gitlab.com/owner/project/-/blob/HEAD/publiccode.yml",
    );
  });

  it("strips the .git suffix from a GitLab URL", () => {
    expect(getPubliccodeYmlUrl("https://gitlab.com/owner/project.git")).toBe(
      "https://gitlab.com/owner/project/-/blob/HEAD/publiccode.yml",
    );
  });
});

describe("safeHref", () => {
  it("keeps http and https links", () => {
    expect(safeHref("https://github.com/a/b")).toBe("https://github.com/a/b");
    expect(safeHref("HTTP://example.ch")).toBe("HTTP://example.ch");
  });

  it("drops other schemes", () => {
    expect(safeHref("javascript:alert(1)")).toBeUndefined();
    expect(safeHref(" javascript:alert(1)")).toBeUndefined();
    expect(safeHref("data:text/html,x")).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
  });
});
