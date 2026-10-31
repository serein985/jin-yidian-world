import { describe, expect, it } from "vitest";
import { interpretScanResult } from "./scanner";

describe("QR scanner payloads", () => {
  it("accepts known raw and absolute animal routes", () => {
    expect(interpretScanResult("preset-tiger", ["preset-tiger"]).animalId).toBe(
      "preset-tiger",
    );
    expect(
      interpretScanResult(
        "https://example.com/?animal=preset-tiger&source=park",
        ["preset-tiger"],
      ).source,
    ).toBe("park");
  });

  it("marks unknown animals as invalid", () => {
    expect(interpretScanResult("preset-unknown", ["preset-tiger"]).source).toBe(
      "invalid",
    );
  });
});
