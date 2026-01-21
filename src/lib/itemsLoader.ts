import { getCache, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";
import { Item } from "@/lib/api";

const METAFORGE_BASE_URL = process.env.METAFORGE_BASE_URL

interface MetaForgeResponse {
    data: Item[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

let fetchPromise: Promise<Item[]> | null = null;

async function fetchFromMetaForge(): Promise<Item[]> {
    const allItems: Item[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const response = await fetch(`${METAFORGE_BASE_URL}/items?page=${page}&limit=50`, {
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`MetaForge API error: ${response.status}`);
        }

        const result: MetaForgeResponse = await response.json();
        allItems.push(...result.data);
        hasNextPage = result.pagination.hasNextPage;
        page++;

        if (page > 20) break;
    }

    await setCache(CACHE_KEYS.ITEMS, allItems, CACHE_TTL);
    return allItems;
}

export async function getItems(): Promise<Item[]> {

    const cached = await getCache<Item[]>(CACHE_KEYS.ITEMS);

    if (cached) {
        return cached;
    }

    if (fetchPromise) {
        console.log("[ItemsLoader] Waiting for existing fetch...");
        return fetchPromise;
    }

    fetchPromise = fetchFromMetaForge();

    try {
        const items = await fetchPromise;
        return items;
    } finally {
        fetchPromise = null;
    }
}

export async function getItemById(id: string): Promise<Item | null> {
    const items = await getItems();

    const item = items.find((i) =>
        i.id === id ||
        i.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase() ||
        i.id.toLowerCase() === id.toLowerCase()
    );

    return item || null;
}