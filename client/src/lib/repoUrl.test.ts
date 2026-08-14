import { describe, it, expect } from "vitest";
import { getPubliccodeYmlUrl } from "./repoUrl";

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
