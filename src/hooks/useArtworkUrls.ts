import { useEffect, useState } from "react";
import type { AnimalProfile } from "../domain/world";
import type { ArtworkStore } from "../lib/artwork-store";

export function useArtworkUrls(
  animals: AnimalProfile[],
  store: ArtworkStore,
) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [missingIds, setMissingIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const created: string[] = [];
    const customAnimals = animals.filter(
      (animal) => animal.kind === "custom" && animal.artworkAssetId,
    );

    async function load() {
      const entries: [string, string][] = [];
      const missing: string[] = [];
      await Promise.all(
        customAnimals.map(async (animal) => {
          try {
            const blob = await store.load(animal.id);
            if (!blob) {
              missing.push(animal.id);
              return;
            }
            const url = URL.createObjectURL(blob);
            created.push(url);
            entries.push([animal.id, url]);
          } catch {
            missing.push(animal.id);
          }
        }),
      );
      if (active) {
        setUrls(Object.fromEntries(entries));
        setMissingIds(missing);
      }
    }

    void load();
    return () => {
      active = false;
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [animals, store]);

  return { urls, missingIds };
}
