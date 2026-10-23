// The invitation builder's unsaved form, kept in this browser (IndexedDB, so
// picked photos and music files are kept too) until the invitation is saved.
// Every call swallows its errors: without storage (a private window, a full
// disk) the builder just works without drafts.

const DB_NAME = "taklifim";
const STORE = "builderDrafts";
/** Drafts left alone this long are dropped. */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface StoredDraft<T> {
  savedAt: number;
  /** The edited invitation's updatedAt: a draft of an older version is dropped. */
  base: string | null;
  data: T;
}

let opening: Promise<IDBDatabase> | null = null;

function openDb() {
  opening ??= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).catch((error) => {
    opening = null;
    throw error;
  });
  return opening;
}

async function run<R>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<R>,
) {
  const db = await openDb();
  return new Promise<R>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/** The draft under `key`, unless it's too old or of another `base`. */
export async function loadDraft<T>(
  key: string,
  base: string | null,
): Promise<T | null> {
  try {
    const draft = await run<StoredDraft<T> | undefined>("readonly", (s) =>
      s.get(key),
    );
    if (!draft) return null;
    if (draft.base !== base || Date.now() - draft.savedAt > MAX_AGE_MS) {
      await clearDraft(key);
      return null;
    }
    return draft.data;
  } catch {
    return null;
  }
}

/** Saves the draft; false if this browser can't keep it. */
export async function saveDraft<T>(key: string, base: string | null, data: T) {
  try {
    const draft: StoredDraft<T> = { savedAt: Date.now(), base, data };
    await run("readwrite", (s) => s.put(draft, key));
    return true;
  } catch {
    return false;
  }
}

export async function clearDraft(key: string) {
  try {
    await run("readwrite", (s) => s.delete(key));
  } catch {
    // Nothing to clear.
  }
}
