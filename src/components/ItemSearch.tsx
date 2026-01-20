"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Package, AlertCircle } from "lucide-react";
import {
    Item,
    fetchItems,
    searchItems,
    filterByRarity,
    filterByType,
    getUniqueRarities,
    getUniqueTypes,
} from "@/lib/api";
import { ItemCard } from "@/components/ItemCard";
import { WeaponCard, groupWeaponsByBase } from "@/components/WeaponCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSelect } from "@/components/FilterSelect";
import { SettingsMenu } from "@/components/SettingsMenu";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { TranslationKey } from "@/lib/translations";

const filterConfig: Record<string, {
    types?: string[];
    keywords?: string[];
    exclude?: string[];
}> = {
    blueprint: { keywords: ["Blueprint"] },
    key: { keywords: ["Key", "Keycard"] },
    weapon: { types: ["Weapon"] },
    style: { keywords: ["Style", "Skin", "Camo", "Pattern"] },
    emote: {
        types: ["Emote", "Gesture"],
        keywords: ["Emote", "Dance", "Gesture"],
        exclude: ["Remote", "Guidance", "System", "Control"]
    },
    damaged: { keywords: ["Damaged", "Broken", "Worn"] },
    consumable: {
        types: ["Consumable", "Food", "Medical", "Quick Use"],
        keywords: ["Food", "Drink", "Med", "Stim", "Ration", "Water", "Bandage"],
        exclude: ["Trigger", "Zipline", "Wolfpack", "Noisemaker", "Cloak", "Recorder", "Remote Raider", "Hook", "Flame", "Fireworks", "Blaze", "Light", "Deadline", "Blocker", "Grenade", "Laser Trap", "Mine", "Firecracker", "Medium", "Intermediate", "Receiver", "Guitar", "Barricade", "Barrel", "Stock", "Mag", "Component", "Part", "Key", "Keycard", "Filter", "Pump", "Medal", "Charm", "Storage", "Rusted", "Shut", "Agave"]
    },
};

export function ItemSearch() {
    const { t } = useApp();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [rarityFilter, setRarityFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        async function loadItems() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchItems();
                setItems(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load items");
            } finally {
                setLoading(false);
            }
        }
        loadItems();
    }, []);

    const rarities = useMemo(() => getUniqueRarities(items), [items]);
    const types = useMemo(() => getUniqueTypes(items), [items]);

    const filterByCategory = (itemsList: Item[], category: string | null): Item[] => {
        if (!category || !filterConfig[category]) return itemsList;

        const config = filterConfig[category];

        return itemsList.filter(item => {

            if (config.exclude) {
                if (config.exclude.some(ex => item.name.toLowerCase().includes(ex.toLowerCase()))) {
                    return false;
                }
            }

            if (config.types) {
                if (config.types.some(t => item.item_type?.toLowerCase() === t.toLowerCase())) {
                    return true;
                }
            }

            if (config.keywords) {
                return config.keywords.some(k => item.name.toLowerCase().includes(k.toLowerCase()));
            }

            return false;
        });
    };

    const filteredItems = useMemo(() => {
        let result = items;

        result = filterByCategory(result, categoryParam);

        result = searchItems(result, searchQuery);
        result = filterByRarity(result, rarityFilter);
        result = filterByType(result, typeFilter);
        return result;
    }, [items, searchQuery, rarityFilter, typeFilter, categoryParam]);

    const getCategoryName = () => {
        if (!categoryParam) return null;
        const keyMap: Record<string, TranslationKey> = {
            blueprint: "itemsBlueprints",
            key: "itemsKeys",
            weapon: "itemsWeap",
            style: "itemsStyles",
            emote: "itemsEmotes",
            damaged: "itemsItemsDamaged",
            consumable: "itemsFoodCon",
        };
        return keyMap[categoryParam] ? t(keyMap[categoryParam]) : null;
    };

    const categoryName = getCategoryName();

    return (
        <div className="min-h-full flex flex-col">
            <PageHeader
                title={categoryName ? `${t("items")} - ${categoryName}` : t("items")}
                description={`${t("foundItems")} ${filteredItems.length}`}
            >
                <div className="flex items-center gap-2">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder={t("searchPlaceholder")}
                    />
                    <SettingsMenu />
                </div>
            </PageHeader>

            <div className="container mx-auto px-6 py-4 border-b border-border/40 mb-6 bg-background/40 backdrop-blur-sm sticky top-[89px] z-20">
                <div className="flex flex-wrap gap-4 items-center">
                    <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">{t("filters")}:</span>



                    <FilterSelect
                        label={t("rarity")}
                        value={rarityFilter}
                        onChange={setRarityFilter}
                        options={rarities}
                        allLabel={t("all")}
                    />
                    <FilterSelect
                        label={t("type")}
                        value={typeFilter}
                        onChange={setTypeFilter}
                        options={types}
                        allLabel={t("all")}
                    />

                    {(searchQuery || rarityFilter !== "all" || typeFilter !== "all" || categoryParam) && (
                        <a
                            href="/items"
                            className="ml-auto text-xs text-destructive hover:text-destructive/80 font-mono uppercase tracking-wider transition-colors"
                        >
                            [{t("clearFilters")}]
                        </a>
                    )}
                </div>
            </div>

            <main className="container mx-auto px-6 pb-20 flex-1">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-muted-foreground font-mono">{t("loading")}...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                        </div>
                        <p className="text-destructive font-medium">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            {t("tryAgain")}
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {filteredItems.length > 0 ? (
                            categoryParam === "weapon" ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {Array.from(groupWeaponsByBase(filteredItems)).map(([baseName, variants]) => (
                                        <WeaponCard
                                            key={baseName}
                                            item={variants[0]}
                                            variants={variants}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {filteredItems.map((item) => (
                                        <ItemCard key={item.id} item={item} />
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                                <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
                                    <Package className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-foreground">{t("noItemsFound")}</p>
                                    <p className="text-sm text-muted-foreground">{t("tryAdjustingFilters")}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}