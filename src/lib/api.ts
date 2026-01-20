// MetaForge ARC Raiders API wrapper
// https://metaforge.app/arc-raiders/

const BASE_URL = process.env.METAFORGE_BASE_URL

export interface Item {
    id: string;
    name: string;
    description?: string;
    rarity?: string;
    item_type?: string;
    category?: string;
    icon?: string;
    weight?: number;
    value?: number;
    workbench?: string;
    loot_area?: string;
    stat_block?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface Arc {
    id: string;
    name: string;
    description?: string;
    image?: string;
    [key: string]: unknown;
}

export interface Quest {
    id: string;
    name: string;
    description?: string;
    objectives?: string[];
    rewards?: unknown[];
    [key: string]: unknown;
}

export interface Trader {
    id: string;
    name: string;
    description?: string;
    image?: string;
    location?: string;
    [key: string]: unknown;
}

export interface ApiResponse<T> {
    data: T[];
    total?: number;
    page?: number;
    limit?: number;
}

export async function fetchItems(): Promise<Item[]> {
    const res = await fetch(`/api/items`);

    if (!res.ok) {
        throw new Error(`Failed to fetch items: ${res.status}`);
    }

    return res.json();
}

// Fetch all ARCs
export async function fetchArcs(): Promise<Arc[]> {
    const res = await fetch(`${BASE_URL}/arcs`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ARCs: ${res.status}`);
    }

    return res.json();
}

// Fetch all quests
export async function fetchQuests(): Promise<Quest[]> {
    const res = await fetch(`${BASE_URL}/quests`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch quests: ${res.status}`);
    }

    return res.json();
}

// Fetch all traders
export async function fetchTraders(): Promise<Trader[]> {
    const res = await fetch(`${BASE_URL}/traders`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch traders: ${res.status}`);
    }

    return res.json();
}

// Search items by name
export function searchItems(items: Item[], query: string): Item[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return items;

    return items.filter(
        (item) =>
            item.name?.toLowerCase().includes(lowerQuery) ||
            item.description?.toLowerCase().includes(lowerQuery) ||
            item.item_type?.toLowerCase().includes(lowerQuery) ||
            item.category?.toLowerCase().includes(lowerQuery)
    );
}

// Filter items by rarity
export function filterByRarity(items: Item[], rarity: string): Item[] {
    if (!rarity || rarity === "all") return items;
    return items.filter((item) => item.rarity?.toLowerCase() === rarity.toLowerCase());
}

// Filter items by type
export function filterByType(items: Item[], type: string): Item[] {
    if (!type || type === "all") return items;
    return items.filter((item) => item.item_type?.toLowerCase() === type.toLowerCase());
}

// Get unique rarities from items
export function getUniqueRarities(items: Item[]): string[] {
    const rarities = new Set<string>();
    items.forEach((item) => {
        if (item.rarity) rarities.add(item.rarity);
    });
    return Array.from(rarities).sort();
}

// Get unique types from items
export function getUniqueTypes(items: Item[]): string[] {
    const types = new Set<string>();
    items.forEach((item) => {
        if (item.item_type) types.add(item.item_type);
    });
    return Array.from(types).sort();
}