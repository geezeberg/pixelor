import { WorkspaceError } from '../types/errors';
import { createPaletteLibrary, type PaletteLibrary } from '../../domain/palettes/palette-library';

const LOCAL_STORAGE_KEY = 'pixelor:palette-library:v1';
const IDB_DATABASE = 'pixelor-palette-db';
const IDB_STORE = 'palette-library';
const IDB_KEY = 'active';

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export interface PaletteStorage {
  load(): Promise<PaletteLibrary>;
  save(library: PaletteLibrary): Promise<void>;
  clear(): Promise<void>;
}

function hasIndexedDb() {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(IDB_DATABASE, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(IDB_STORE)) {
        database.createObjectStore(IDB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readFromIndexedDb(): Promise<PaletteLibrary | null> {
  if (!hasIndexedDb()) {
    return null;
  }

  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(IDB_STORE, 'readonly');
    const store = transaction.objectStore(IDB_STORE);
    const request = store.get(IDB_KEY);

    request.onsuccess = () => {
      database.close();
      if (!request.result) {
        resolve(null);
        return;
      }

      const parsed = request.result as PaletteLibrary;
      resolve(createPaletteLibrary(parsed.palettes, parsed.libraryVersion));
    };

    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}

async function writeToIndexedDb(library: PaletteLibrary): Promise<void> {
  if (!hasIndexedDb()) {
    return;
  }

  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(IDB_STORE, 'readwrite');
    const store = transaction.objectStore(IDB_STORE);
    const request = store.put(library, IDB_KEY);

    request.onsuccess = () => {
      database.close();
      resolve();
    };

    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}

async function clearIndexedDb(): Promise<void> {
  if (!hasIndexedDb()) {
    return;
  }

  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(IDB_STORE, 'readwrite');
    const store = transaction.objectStore(IDB_STORE);
    const request = store.delete(IDB_KEY);

    request.onsuccess = () => {
      database.close();
      resolve();
    };

    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}

export function createPaletteStorage(): PaletteStorage {
  return {
    async load() {
      try {
        const indexedDbResult = await readFromIndexedDb();
        if (indexedDbResult) {
          return indexedDbResult;
        }

        if (!hasLocalStorage()) {
          return createPaletteLibrary();
        }

        const serialized = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!serialized) {
          return createPaletteLibrary();
        }

        const parsed = JSON.parse(serialized) as PaletteLibrary;
        return createPaletteLibrary(parsed.palettes, parsed.libraryVersion);
      } catch (error) {
        throw new WorkspaceError('palette-persistence-failed', 'Failed to load persisted palette library.', {
          cause: error instanceof Error ? error.message : String(error),
        });
      }
    },

    async save(library: PaletteLibrary) {
      try {
        if (hasIndexedDb()) {
          await writeToIndexedDb(library);
          return;
        }

        if (hasLocalStorage()) {
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(library));
        }
      } catch (error) {
        throw new WorkspaceError('palette-persistence-failed', 'Failed to persist palette library.', {
          cause: error instanceof Error ? error.message : String(error),
        });
      }
    },

    async clear() {
      if (hasIndexedDb()) {
        await clearIndexedDb();
      }

      if (hasLocalStorage()) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    },
  };
}
