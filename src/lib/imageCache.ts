const DB_NAME = 'imageCache';
const DB_VERSION = 1;
const STORE_NAME = 'images';

interface CachedImage {
    url: string;
    blob: Blob;
    timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

async function openDB(): Promise<IDBDatabase> {
    if (dbInstance) return dbInstance;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'url' });
            }
        };
    });
}

export async function getCachedImage(url: string): Promise<string | null> {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(url);

            request.onsuccess = () => {
                if (request.result) {
                    const cached = request.result as CachedImage;
                    const objectUrl = URL.createObjectURL(cached.blob);
                    resolve(objectUrl);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => resolve(null);
        });
    } catch {
        return null;
    }
}

export async function cacheImage(url: string, blob: Blob): Promise<void> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const data: CachedImage = {
                url,
                blob,
                timestamp: Date.now(),
            };

            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to cache image:', error);
    }
}

export async function fetchCachedImage(url: string): Promise<string> {

    const cached = await getCachedImage(url);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const blob = await response.blob();

        await cacheImage(url, blob);

        return URL.createObjectURL(blob);

    } catch (error) {
        console.error('Failed to fetch image:', error);
        return url;
    }
}

export async function clearImageCache(): Promise<void> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to clear image cache:', error);
    }
}

export async function getCacheStats(): Promise<{ count: number; sizeBytes: number }> {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const items = request.result as CachedImage[];
                const count = items.length;
                const sizeBytes = items.reduce((acc, item) => acc + item.blob.size, 0);
                resolve({ count, sizeBytes });
            };

            request.onerror = () => resolve({ count: 0, sizeBytes: 0 });
        });
    } catch {
        return { count: 0, sizeBytes: 0 };
    }
}