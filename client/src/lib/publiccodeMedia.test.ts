import { describe, it, expect } from "vitest";
import { resolveMediaUrl, getVideoEmbed } from "./publiccodeMedia";

describe("resolveMediaUrl", () => {
  it("returns absolute URLs unchanged", () => {
    expect(resolveMediaUrl(undefined, "https://example.com/logo.png")).toBe(
      "https://example.com/logo.png",
    );
  });

  it("returns data URLs unchanged", () => {
    expect(
      resolveMediaUrl(
        undefined,
        "data:image/png;base64,iVBORw0KGgo=",
      ),
    ).toBe("data:image/png;base64,iVBORw0KGgo=");
  });

  it("returns undefined when no repo url is provided for a relative path", () => {
    expect(resolveMediaUrl(undefined, "img/logo.png")).toBeUndefined();
  });

  it("resolves GitHub raw URLs", () => {
    expect(
      resolveMediaUrl(
        "https://github.com/swiss/oss-catalog.git",
        "img/logo.png",
      ),
    ).toBe(
      "https://raw.githubusercontent.com/swiss/oss-catalog/HEAD/img/logo.png",
    );
  });

  it("resolves GitHub raw URLs without .git suffix", () => {
    expect(
      resolveMediaUrl("https://github.com/swiss/oss-catalog", "img/logo.png"),
    ).toBe(
      "https://raw.githubusercontent.com/swiss/oss-catalog/HEAD/img/logo.png",
    );
  });

  it("strips leading slashes from relative paths", () => {
    expect(
      resolveMediaUrl(
        "https://github.com/swiss/oss-catalog.git",
        "/img/logo.png",
      ),
    ).toBe(
      "https://raw.githubusercontent.com/swiss/oss-catalog/HEAD/img/logo.png",
    );
  });

  it("resolves GitLab raw URLs", () => {
    expect(
      resolveMediaUrl(
        "https://gitlab.com/owner/project.git",
        "img/logo.png",
      ),
    ).toBe("https://gitlab.com/owner/project/-/raw/HEAD/img/logo.png");
  });

  it("returns undefined for unsupported hosts", () => {
    expect(
      resolveMediaUrl("https://example.com/repo.git", "img/logo.png"),
    ).toBeUndefined();
  });
});

describe("getVideoEmbed", () => {
  it("returns undefined for non-video URLs", () => {
    expect(getVideoEmbed("https://example.com")).toBeUndefined();
  });

  it("extracts YouTube watch URLs", () => {
    const embed = getVideoEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(embed).toEqual({
      type: "youtube",
      embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      watchUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });

  it("extracts YouTube short URLs", () => {
    const embed = getVideoEmbed("https://youtu.be/dQw4w9WgXcQ");
    expect(embed).toEqual({
      type: "youtube",
      embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      watchUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });

  it("extracts YouTube embed URLs", () => {
    const embed = getVideoEmbed("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(embed).toEqual({
      type: "youtube",
      embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      watchUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });

  it("extracts Vimeo URLs", () => {
    const embed = getVideoEmbed("https://vimeo.com/123456789");
    expect(embed).toEqual({
      type: "vimeo",
      embedUrl: "https://player.vimeo.com/video/123456789?dnt=1",
      watchUrl: "https://vimeo.com/123456789",
    });
  });

  it("extracts Vimeo player URLs", () => {
    const embed = getVideoEmbed("https://player.vimeo.com/video/123456789");
    expect(embed).toEqual({
      type: "vimeo",
      embedUrl: "https://player.vimeo.com/video/123456789?dnt=1",
      watchUrl: "https://vimeo.com/123456789",
    });
  });
});
