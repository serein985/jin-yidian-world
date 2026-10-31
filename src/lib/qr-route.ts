export interface AnimalRouteResult {
  animalId: string | null;
  source: "park" | "internal" | "invalid";
}

export function parseAnimalFromUrl(
  payload: string,
  knownAnimalIds: string[],
): AnimalRouteResult {
  const trimmed = payload.trim();
  if (!trimmed) {
    return { animalId: null, source: "internal" };
  }
  if (knownAnimalIds.includes(trimmed)) {
    return { animalId: trimmed, source: "internal" };
  }

  try {
    const url = new URL(trimmed, window.location.href);
    const animalId = url.searchParams.get("animal");
    if (!animalId) {
      if (
        !trimmed.includes("?") &&
        !trimmed.startsWith("http") &&
        !trimmed.includes("/")
      ) {
        return { animalId: trimmed, source: "invalid" };
      }
      return { animalId: null, source: "internal" };
    }
    return knownAnimalIds.includes(animalId)
      ? { animalId, source: "park" }
      : { animalId, source: "invalid" };
  } catch {
    return { animalId: trimmed, source: "invalid" };
  }
}

export function buildAnimalUrl(animalId: string): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("animal", animalId);
  return url.toString();
}
