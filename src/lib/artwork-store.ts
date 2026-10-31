export interface ArtworkStore {
  save(animalId: string, blob: Blob): Promise<void>;
  load(animalId: string): Promise<Blob | null>;
  delete(animalId: string): Promise<void>;
}

const DATABASE_NAME = "jin-yidian-assets";
const STORE_NAME = "animal-artwork";

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function createArtworkStore(): ArtworkStore {
  let databasePromise: Promise<IDBDatabase> | null = null;

  async function database() {
    databasePromise ??= openDatabase();
    return databasePromise;
  }

  return {
    async save(animalId, blob) {
      const db = await database();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      await requestResult(transaction.objectStore(STORE_NAME).put(blob, animalId));
    },
    async load(animalId) {
      const db = await database();
      const transaction = db.transaction(STORE_NAME, "readonly");
      const value = await requestResult(
        transaction.objectStore(STORE_NAME).get(animalId),
      );
      return value instanceof Blob ? value : null;
    },
    async delete(animalId) {
      const db = await database();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      await requestResult(transaction.objectStore(STORE_NAME).delete(animalId));
    },
  };
}

export function createMemoryArtworkStore(
  initial: Map<string, Blob> = new Map(),
): ArtworkStore {
  const values = new Map(initial);
  return {
    async save(animalId, blob) {
      values.set(animalId, blob);
    },
    async load(animalId) {
      return values.get(animalId) ?? null;
    },
    async delete(animalId) {
      values.delete(animalId);
    },
  };
}
