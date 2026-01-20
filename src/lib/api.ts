// MetaForge ARC Raiders API wrapper
// https://metaforge.app/arc-raiders/

export interface ItemStats {
    stackSize?: number;
    weight?: number;
    value?: number;
    [key: string]: unknown;
}

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
    stat_block?: ItemStats;
    updated_at?: string;
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
    items?: unknown[];
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

export async function fetchItem(id: string): Promise<Item> {

    const res = await fetch(`/api/items/${id}`);

    if (!res.ok) {
        throw new Error(`Failed to fetch item: ${res.status}`);
    }

    return res.json();
}

export async function fetchArcs(): Promise<Arc[]> {
    const res = await fetch(`/api/arcs`);

    if (!res.ok) {
        throw new Error(`Failed to fetch ARCs: ${res.status}`);
    }

    return res.json();
}

export async function fetchQuests(): Promise<Quest[]> {
    const res = await fetch(`/api/quests`);

    if (!res.ok) {
        throw new Error(`Failed to fetch quests: ${res.status}`);
    }

    return res.json();
}

export async function fetchTraders(): Promise<Trader[]> {
    const res = await fetch(`/api/traders`);

    if (!res.ok) {
        throw new Error(`Failed to fetch traders: ${res.status}`);
    }

    return res.json();
}

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

export function filterByRarity(items: Item[], rarity: string): Item[] {
    if (!rarity || rarity === "all") return items;
    return items.filter((item) => item.rarity?.toLowerCase() === rarity.toLowerCase());
}

export function filterByType(items: Item[], type: string): Item[] {
    if (!type || type === "all") return items;
    return items.filter((item) => item.item_type?.toLowerCase() === type.toLowerCase());
}

export function getUniqueRarities(items: Item[]): string[] {
    const rarities = new Set<string>();
    items.forEach((item) => {
        if (item.rarity) rarities.add(item.rarity);
    });
    return Array.from(rarities).sort();
}

export function getUniqueTypes(items: Item[]): string[] {
    const types = new Set<string>();
    items.forEach((item) => {
        if (item.item_type) types.add(item.item_type);
    });
    return Array.from(types).sort();
}