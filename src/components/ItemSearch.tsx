"use client";

import { useState, useEffect, useMemo } from "react";
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
import { SearchBar } from "@/components/SearchBar";
import { FilterSelect } from "@/components/FilterSelect";
import { SettingsMenu } from "@/components/SettingsMenu";
import { useApp } from "@/context/AppContext";

export function ItemSearch() {
    const { t } = useApp();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [rarityFilter, setRarityFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    // Fetch items on mount
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

    // Get unique filter options
    const rarities = useMemo(() => getUniqueRarities(items), [items]);
    const types = useMemo(() => getUniqueTypes(items), [items]);

    // Filter and search items
    const filteredItems = useMemo(() => {
        let result = items;
        result = searchItems(result, searchQuery);
        result = filterByRarity(result, rarityFilter);
        result = filterByType(result, typeFilter);
        return result;
    }, [items, searchQuery, rarityFilter, typeFilter]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col gap-6">
                        {/* Title and Settings */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                                    <Package className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">{t("appName")}</h1>
                                    <p className="text-sm text-muted-foreground">
                                        {t("appDescription")}
                                    </p>
                                </div>
                            </div>
                            <SettingsMenu />
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder={t("searchPlaceholder")}
                            />

                            <div className="flex gap-3">
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
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Loading state */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">{t("loading")}</p>
                    </div>
                )}

                {/* Error state */}
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

                {/* Results */}
                {!loading && !error && (
                    <>
                        {/* Results count */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-muted-foreground">
                                {t("foundItems")} <span className="font-semibold text-foreground">{filteredItems.length}</span> {t("items")}
                                {searchQuery && (
                                    <span> {t("forQuery")} &quot;{searchQuery}&quot;</span>
                                )}
                            </p>
                        </div>

                        {/* Items grid */}
                        {filteredItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {filteredItems.map((item) => (
                                    <ItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Package className="w-16 h-16 text-muted-foreground/30" />
                                <p className="text-muted-foreground">{t("noItemsFound")}</p>
                                {(searchQuery || rarityFilter !== "all" || typeFilter !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setRarityFilter("all");
                                            setTypeFilter("all");
                                        }}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {t("clearFilters")}
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-border/50 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>
                        {t("dataFrom")}{" "}
                        <a
                            href="https://metaforge.app/arc-raiders"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            MetaForge
                        </a>
                        . {t("propertyOf")}
                    </p>
                </div>
            </footer>
        </div>
    );
}