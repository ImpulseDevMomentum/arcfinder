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

export interface QuestRewardItem {
    id: string;
    icon: string;
    name: string;
    rarity: string;
    item_type: string;
}

export interface QuestReward {
    id: string;
    item: QuestRewardItem;
    item_id: string;
    quantity: string;
}

export interface QuestRequiredItem {
    id: string;
    item: QuestRewardItem;
    item_id: string;
    quantity: number;
}

export interface QuestGrantedItem {
    id: string;
    item: QuestRewardItem;
    item_id: string;
    quantity: number;
}

export interface QuestGuideLink {
    url: string;
    label: string;
}

export interface Quest {
    id: string;
    name: string;
    description?: string;
    objectives?: string[];
    xp?: number;
    image?: string;
    trader_name?: string;
    position?: { x: number; y: number };
    rewards?: QuestReward[];
    required_items?: QuestRequiredItem[];
    granted_items?: QuestGrantedItem[];
    guide_links?: QuestGuideLink[];
    created_at?: string;
    updated_at?: string;
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
    const [tradersRes, correctionRes] = await Promise.all([
        fetch(`/api/traders`),
        fetch(`/traders/traderCorrectionMap.json`).catch(() => null)
    ]);

    if (!tradersRes.ok) {
        throw new Error(`Failed to fetch traders: ${tradersRes.status}`);
    }

    const traders: Trader[] = await tradersRes.json();

    if (correctionRes && correctionRes.ok) {
        try {
            const corrections = await correctionRes.json();

            const neededItemIds = new Set<string>();

            Object.values(corrections).forEach((correction: any) => {
                if (correction.items) {
                    Object.keys(correction.items).forEach(key => neededItemIds.add(key));
                }
            });

            const itemsMap = new Map<string, Item>();

            await Promise.all(Array.from(neededItemIds).map(async (id) => {
                try {
                    const item = await fetchItem(id);
                    itemsMap.set(id, item);
                    itemsMap.set(item.name.toLowerCase(), item);
                } catch {
                }
            }));

            return traders.map(trader => {

                const traderCorrection = corrections[trader.name.toLowerCase()] || corrections[trader.id];

                if (traderCorrection && traderCorrection.items) {

                    const correctedItems = Object.entries(traderCorrection.items).map(([key, data]: [string, any]) => {

                        const baseItem = itemsMap.get(key) || itemsMap.get(key.toLowerCase());

                        return {
                            id: key,
                            name: baseItem?.name || key,
                            icon: baseItem?.icon || "",
                            description: baseItem?.description || "",
                            rarity: data.rarity || baseItem?.rarity || "Common",
                            item_type: data.type || baseItem?.item_type || "Misc",
                            value: data.value ? parseInt(data.value) : (baseItem?.value || 0),
                            trader_price: data.price ? parseInt(data.price) : 0,
                            ...data
                        };
                    });

                    return {
                        ...trader,
                        items: correctedItems
                    };
                }
                return trader;
            });
        } catch (e) {
            console.error("Failed to apply trader corrections:", e);
        }
    }

    return traders;
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