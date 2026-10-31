import { describe, expect, it } from "vitest";
import { createMemoryArtworkStore } from "./artwork-store";

describe("memory artwork store", () => {
  it("saves, loads and deletes artwork by animal id", async () => {
    const store = createMemoryArtworkStore();
    const blob = new Blob(["hello"], { type: "image/webp" });

    await store.save("custom-a", blob);
    expect(await store.load("custom-a")).toBe(blob);
    expect(await store.load("custom-b")).toBeNull();

    await store.delete("custom-a");
    expect(await store.load("custom-a")).toBeNull();
  });
});
