"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft, ShoppingBag, Filter } from "lucide-react";
import { Trader, fetchTraders } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { CachedImage } from "@/components/CachedImage";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TraderItem {
    id: string;
    name: string;
    icon: string;
    value: number;
    rarity: string;
    item_type: string;
    description: string;
    trader_price: number;
}

const TRADER_COLORS: Record<string, string> = {
    "Apollo": "#a855f7",
    "Celeste": "#3b82f6",
    "Lance": "#ef4444",
    "Shani": "#22c55e",
    "TianWen": "#f59e0b",
};

const RARITY_COLORS: Record<string, string> = {
    "Common": "bg-gray-500/20 text-gray-400 border-gray-500/30",
    "Uncommon": "bg-green-500/20 text-green-400 border-green-500/30",
    "Rare": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Epic": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Legendary": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const TRAIDER_TR: Record<string, string> = {
    "Apollo": "coin",
    "Celeste": "seed",
    "Lance": "coin",
    "Shani": "cred",
    "TianWen": "coin",
};

const CURRENCY_ICONS: Record<string, string> = {
    "coin": "/iconCoins.svg",
    "cred": "/iconsCred.webp",
    "seed": "/iconsNature.png",
};

export default function TraderPage() {
    const params = useParams();
    const traderId = params.id as string;

    const [trader, setTrader] = useState<Trader | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>("all");
    const [selectedRarity, setSelectedRarity] = useState<string>("all");
    const [traderIcon, setTraderIcon] = useState<string | null>(null);
    const [traderAvatar, setTraderAvatar] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const traders = await fetchTraders();
                const found = traders.find(t => t.id === traderId || t.name.toLowerCase() === traderId);
                if (found) {
                    setTrader(found);
                    try {
                        const res = await fetch('/traderIconsMap.json');
                        const iconMap = await res.json();
                        const mapData = iconMap[found.id] || iconMap[found.name.toLowerCase()];
                        if (mapData) {
                            setTraderIcon(mapData.icon);
                            if (mapData.avatar) {
                                setTraderAvatar(mapData.avatar);
                            }
                        }
                    } catch { }
                } else {
                    setError("Trader not found");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load trader");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [traderId]);

    const items = (trader?.items || []) as TraderItem[];

    const itemTypes = useMemo(() => {
        const types = new Set(items.map(item => item.item_type));
        return ["all", ...Array.from(types).sort()];
    }, [items]);

    const rarities = useMemo(() => {
        const rars = new Set(items.map(item => item.rarity));
        return ["all", ...Array.from(rars).sort()];
    }, [items]);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            if (selectedType !== "all" && item.item_type !== selectedType) return false;
            if (selectedRarity !== "all" && item.rarity !== selectedRarity) return false;
            return true;
        });
    }, [items, selectedType, selectedRarity]);

    const traderColor = trader ? TRADER_COLORS[trader.name] || "#6b7280" : "#6b7280";

    if (loading) {
        return (
            <div className="min-h-full flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground font-mono">Loading trader...</p>
            </div>
        );
    }

    if (error || !trader) {
        return (
            <div className="min-h-full flex flex-col items-center justify-center py-20 gap-4">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                </div>
                <p className="text-destructive font-medium">{error || "Trader not found"}</p>
                <Link href="/traders" className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Traders
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col">
            <PageHeader
                title={trader.name}
                description={`${items.length} items available for trade`}
            >
                <Link
                    href="/traders"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/30 text-sm hover:bg-background/80 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    All Traders
                </Link>
            </PageHeader>

            <main className="container mx-auto px-6 py-8 flex-1">
                <div
                    className="mb-8 rounded-2xl border overflow-hidden relative"
                    style={{ borderColor: `${traderColor}30` }}
                >
                    <div className="h-48 relative">
                        {traderIcon ? (
                            <>
                                <CachedImage
                                    src={traderIcon}
                                    alt={trader.name}
                                    className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                            </>
                        ) : (
                            <div
                                className="w-full h-full"
                                style={{ background: `linear-gradient(135deg, ${traderColor}30 0%, transparent 60%)` }}
                            />
                        )}
                    </div>

                    <div className="px-8 pb-8 -mt-12 relative flex items-end gap-6">
                        <div
                            className="w-32 h-32 rounded-full border-4 border-card overflow-hidden shadow-xl flex-shrink-0 bg-card"
                            style={{ borderColor: `${traderColor}30` }}
                        >
                            {traderAvatar ? (
                                <CachedImage
                                    src={traderAvatar}
                                    alt={trader.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center text-4xl font-bold"
                                    style={{ backgroundColor: `${traderColor}20`, color: traderColor }}
                                >
                                    {trader.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 pb-2">
                            <h2 className="text-4xl font-bold text-white drop-shadow-md" style={{ textShadow: `0 2px 10px ${traderColor}` }}>
                                {trader.name}
                            </h2>
                            <p className="text-white/80 mt-1 text-lg">{trader.description}</p>
                            <div className="flex items-center gap-2 mt-3 text-sm text-white/60">
                                <ShoppingBag className="w-4 h-4" />
                                <span className="font-mono">{items.length} items available</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Filter:</span>
                    </div>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-background/50 border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        {itemTypes.map(type => (
                            <option key={type} value={type}>
                                {type === "all" ? "All Types" : type}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedRarity}
                        onChange={(e) => setSelectedRarity(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-background/50 border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        {rarities.map(rarity => (
                            <option key={rarity} value={rarity}>
                                {rarity === "all" ? "All Rarities" : rarity}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-muted-foreground ml-auto">
                        Showing {filteredItems.length} of {items.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/items/${item.id}`}
                            className={cn(
                                "group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
                                "bg-card/30 border-border/50 hover:bg-card/50 hover:border-primary/50",
                                "hover:shadow-[0_0_20px_-5px_rgba(255,85,0,0.15)]"
                            )}
                        >
                            <div className="w-16 h-16 rounded-lg border border-border/50 overflow-hidden bg-background/50 flex-shrink-0">
                                {item.icon && (
                                    <CachedImage
                                        src={item.icon}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                                    {item.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded border",
                                        RARITY_COLORS[item.rarity] || "bg-muted text-muted-foreground border-border"
                                    )}>
                                        {item.rarity}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground truncate">
                                        {item.item_type}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs">
                                        <span className="text-muted-foreground">Value: </span>
                                        <span className="font-mono text-foreground">{item.value.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: traderColor }}>
                                        <img
                                            src={CURRENCY_ICONS[TRAIDER_TR[trader.name] || "coin"] || CURRENCY_ICONS["coin"]}
                                            alt=""
                                            className="w-4 h-4"
                                        />
                                        <span className="font-mono">{item.trader_price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No items match the selected filters.
                    </div>
                )}
            </main>
        </div>
    );
}