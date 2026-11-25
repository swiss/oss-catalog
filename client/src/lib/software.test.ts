import { afterEach, describe, it, expect, vi } from "vitest";
import { getSoftwares } from "./software";

afterEach(() => vi.unstubAllGlobals());

describe("getSoftwares", () => {
  it("follows links.next until the last page", async () => {
    const pages = [
      { data: [{ id: "1" }, { id: "2" }], links: { next: "?page[after]=abc" } },
      { data: [{ id: "3" }], links: { next: null } },
    ];
    const fetch = vi.fn(async () => Response.json(pages.shift()));
    vi.stubGlobal("fetch", fetch);

    const softwares = await getSoftwares();

    expect(softwares.map((s) => s.id)).toEqual(["1", "2", "3"]);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      "http://localhost:3000/v1/software?page[after]=abc",
    );
  });
});
