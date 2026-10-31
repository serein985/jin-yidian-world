import { describe, expect, it } from "vitest";
import { buildAnimalUrl, parseAnimalFromUrl } from "./qr-route";

const known = ["preset-tiger", "preset-rabbit", "custom-example"];

describe("animal QR routes", () => {
  it("parses park and relative animal links", () => {
    expect(parseAnimalFromUrl("?animal=preset-tiger", known)).toEqual({
      animalId: "preset-tiger",
      source: "park",
    });
    expect(
      parseAnimalFromUrl(
        "https://serein985.github.io/jin-yidian-zoo/?animal=preset-rabbit&source=park",
        known,
      ),
    ).toEqual({ animalId: "preset-rabbit", source: "park" });
  });

  it("parses raw ids and reports unknown animal ids", () => {
    expect(parseAnimalFromUrl("preset-tiger", known)).toEqual({
      animalId: "preset-tiger",
      source: "internal",
    });
    expect(parseAnimalFromUrl("?animal=preset-fox", known).source).toBe("invalid");
  });

  it("returns no animal when the payload is empty", () => {
    expect(parseAnimalFromUrl("", known)).toEqual({
      animalId: null,
      source: "internal",
    });
  });

  it("ignores unrelated page query parameters", () => {
    expect(parseAnimalFromUrl("?visit=habitat", known)).toEqual({
      animalId: null,
      source: "internal",
    });
  });

  it("builds a direct animal URL without losing the deployment path", () => {
    const url = buildAnimalUrl("preset-rabbit");
    expect(url).toContain("animal=preset-rabbit");
    expect(url.startsWith(window.location.href.split("?")[0])).toBe(true);
  });
});
