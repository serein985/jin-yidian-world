import { describe, expect, it, vi } from "vitest";
import { addPresetAnimal, createWorldState } from "../domain/world";
import {
  WORLD_STORAGE_KEY,
  loadWorld,
  saveWorld,
  type WorldStorageLike,
} from "./world-storage";

const now = new Date("2026-10-31T02:00:00.000Z");

describe("world storage", () => {
  it("round-trips the versioned world state", () => {
    const values = new Map<string, string>();
    const storage: WorldStorageLike = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => {
        values.set(key, value);
      },
    };
    const state = addPresetAnimal(createWorldState(now), "panda", now);

    expect(saveWorld(storage, state)).toBe(true);
    expect(values.has(WORLD_STORAGE_KEY)).toBe(true);
    expect(loadWorld(storage, now).state.animals).toHaveLength(4);
  });

  it("recovers from malformed data and failed writes", () => {
    const storage: WorldStorageLike = {
      getItem: vi.fn(() => "{bad"),
      setItem: vi.fn(() => {
        throw new DOMException("Blocked", "SecurityError");
      }),
    };

    expect(loadWorld(storage, now).persisted).toBe(false);
    expect(saveWorld(storage, createWorldState(now))).toBe(false);
  });
});
