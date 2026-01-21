"use client";

import { Trader } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ShoppingBag, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CachedImage } from "./CachedImage";
import { useState, useEffect } from "react";

interface TraderCardProps {
    trader: Trader;
}

interface TraderItem {
    id?: string;
    name?: string;
    icon?: string;
    rarity?: string;
    value?: number;
    trader_price?: number;
    item_type?: string;
}

interface TraderIconMap {
    [key: string]: { icon: string };
}

const TRADER_COLORS: Record<string, string> = {
    "Apollo": "#a855f7",
    "Celeste": "#3b82f6",
    "Lance": "#ef4444",
    "Shani": "#22c55e",
    "TianWen": "#f59e0b",
};

const TRADER_DESCRIPTIONS: Record<string, string> = {
    "Apollo": "Tactical Equipment & Explosives",
    "Celeste": "Crafting Materials & Parts",
    "Lance": "Medical Supplies & Augments",
    "Shani": "Keys & Gadgets",
    "TianWen": "Weapons & Modifications",
};

const IMAGE_POSITIONS: Record<string, string> = {
    "Apollo": "left top",
    "Celeste": "center top",
    "Lance": "center top",
    "Shani": "center top",
    "TianWen": "center 20%",
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

const RARITY_COLORS: Record<string, string> = {
    "Common": "bg-gray-500/20 text-gray-400 border-gray-500/30",
    "Uncommon": "bg-green-500/20 text-green-400 border-green-500/30",
    "Rare": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Epic": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Legendary": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

let traderIconsCache: TraderIconMap | null = null;

export function TraderCard({ trader }: TraderCardProps) {
    const [traderIcon, setTraderIcon] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const items = (trader.items || []) as TraderItem[];
    const itemCount = items.length;
    const color = TRADER_COLORS[trader.name] || "#6b7280";
    const description = TRADER_DESCRIPTIONS[trader.name] || trader.description || "Trader";
    const currencyType = TRAIDER_TR[trader.name] || "coin";
    const currencyIcon = CURRENCY_ICONS[currencyType] || CURRENCY_ICONS["coin"];

    useEffect(() => {
        async function loadIcon() {
            try {
                if (!traderIconsCache) {
                    const res = await fetch('/traderIconsMap.json');
                    traderIconsCache = await res.json();
                }
                const iconUrl = traderIconsCache?.[trader.id]?.icon || traderIconsCache?.[trader.name.toLowerCase()]?.icon;
                if (iconUrl) {
                    setTraderIcon(iconUrl);
                }
            } catch (e) {
                console.error('Failed to load trader icons:', e);
            }
        }
        loadIcon();
    }, [trader.id, trader.name]);

    return (
        <div
            className={cn(
                "relative flex flex-col overflow-hidden transition-all duration-300 rounded-xl",
                "bg-card/30 backdrop-blur-md border border-border/50",
                "hover:bg-card/50"
            )}
            style={{ borderColor: `${color}30` }}
        >
            <Link href={`/traders/${trader.id}`} className="relative h-32 overflow-hidden group cursor-pointer">
                {traderIcon ? (
                    <>
                        <CachedImage
                            src={traderIcon}
                            alt={trader.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)` }}
                        />
                    </>
                ) : (
                    <div
                        className="w-full h-full"
                        style={{ background: `linear-gradient(135deg, ${color}30 0%, transparent 60%)` }}
                    />
                )}

                <div
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                    style={{ backgroundColor: `${color}90`, color: 'white' }}
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {itemCount}
                </div>

                <div className="absolute top-3 left-3 p-1.5 rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-white" />
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-xl tracking-wide text-white drop-shadow-lg group-hover:underline">
                        {trader.name}
                    </h3>
                    <p className="text-sm text-white/70">{description}</p>
                </div>
            </Link>

            {itemCount > 0 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        "flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                        "hover:bg-background/50",
                        expanded ? "border-b border-border/30" : ""
                    )}
                    style={{ color }}
                >
                    {expanded ? (
                        <>
                            <span>Hide Items</span>
                            <ChevronUp className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            <span>Show All {itemCount} Items</span>
                            <ChevronDown className="w-4 h-4" />
                        </>
                    )}
                </button>
            )}

            {itemCount > 0 && (
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-300",
                        expanded ? "max-h-[600px] overflow-y-auto" : "max-h-0"
                    )}
                >
                    <div className="p-3 space-y-2">
                        {items.map((item, i) => (
                            <Link
                                key={item.id || i}
                                href={`/items/${item.id}`}
                                className="flex items-center gap-3 p-2 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 hover:border-primary/30 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg border border-border/50 overflow-hidden bg-background/50 flex-shrink-0">
                                    {item.icon && (
                                        <CachedImage
                                            src={item.icon}
                                            alt={item.name || "Item"}
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                                            {item.name}
                                        </span>
                                        {item.rarity && (
                                            <span className={cn(
                                                "text-[9px] px-1.5 py-0.5 rounded border flex-shrink-0",
                                                RARITY_COLORS[item.rarity] || "bg-muted text-muted-foreground border-border"
                                            )}>
                                                {item.rarity}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                        {item.item_type && <span>{item.item_type}</span>}
                                        {item.trader_price && (
                                            <span className="flex items-center gap-1.5 font-mono font-semibold text-sm" style={{ color }}>
                                                <img src={currencyIcon} alt="" className="w-4 h-4" />
                                                {item.trader_price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}