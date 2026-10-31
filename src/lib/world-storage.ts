import {
  createWorldState,
  sanitizeWorldState,
  type WorldState,
} from "../domain/world";

export const WORLD_STORAGE_KEY = "jin-yidian:v3:world";

export type WorldStorageLike = Pick<Storage, "getItem" | "setItem">;

export function loadWorld(
  storage: WorldStorageLike,
  now: Date,
): { state: WorldState; persisted: boolean } {
  try {
    const raw = storage.getItem(WORLD_STORAGE_KEY);
    if (!raw) {
      return { state: createWorldState(now), persisted: false };
    }
    return {
      state: sanitizeWorldState(JSON.parse(raw), now),
      persisted: true,
    };
  } catch {
    return { state: createWorldState(now), persisted: false };
  }
}

export function saveWorld(
  storage: WorldStorageLike,
  state: WorldState,
): boolean {
  try {
    storage.setItem(WORLD_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
