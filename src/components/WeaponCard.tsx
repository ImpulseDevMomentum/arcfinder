"use client";

import { useState } from "react";
import { Item } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface WeaponCardProps {
    item: Item;
    variants: Item[];
}

const rarityConfig: Record<string, { border: string, text: string, bg: string, glow: string }> = {
    common: {
        border: "group-hover:border-zinc-500",
        text: "text-zinc-400",
        bg: "bg-zinc-950/40",
        glow: "group-hover:shadow-[0_0_20px_-5px_rgba(113,113,122,0.3)]"
    },
    uncommon: {
        border: "group-hover:border-green-500",
        text: "text-green-400",
        bg: "bg-green-950/20",
        glow: "group-hover:shadow-[0_0_20px_-5px_rgba(74,222,128,0.3)]"
    },
    rare: {
        border: "group-hover:border-blue-500",
        text: "text-blue-400",
        bg: "bg-blue-950/20",
        glow: "group-hover:shadow-[0_0_20px_-5px_rgba(96,165,250,0.3)]"
    },
    epic: {
        border: "group-hover:border-purple-500",
        text: "text-purple-400",
        bg: "bg-purple-950/20",
        glow: "group-hover:shadow-[0_0_20px_-5px_rgba(192,132,252,0.3)]"
    },
    legendary: {
        border: "group-hover:border-orange-500",
        text: "text-orange-400",
        bg: "bg-orange-950/20",
        glow: "group-hover:shadow-[0_0_20px_-5px_rgba(251,146,60,0.3)]"
    },
};

function extractLevel(name: string): { baseName: string; level: number } {
    const romanNumerals: Record<string, number> = {
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
        'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
    };

    const match = name.match(/\s+(I{1,3}|IV|V|VI{0,3}|IX|X)$/);
    if (match) {
        const numeral = match[1];
        const level = romanNumerals[numeral] || 1;
        const baseName = name.replace(/\s+(I{1,3}|IV|V|VI{0,3}|IX|X)$/, '');
        return { baseName, level };
    }

    return { baseName: name, level: 0 };
}

function getMetaForgeItemUrl(name: string): string {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `https://metaforge.app/arc-raiders/database/item/${slug}`;
}

export function groupWeaponsByBase(weapons: Item[]): Map<string, Item[]> {
    const groups = new Map<string, Item[]>();

    weapons.forEach(weapon => {
        const { baseName } = extractLevel(weapon.name);
        const existing = groups.get(baseName) || [];
        existing.push(weapon);
        groups.set(baseName, existing);
    });

    groups.forEach((items, key) => {
        items.sort((a, b) => {
            const levelA = extractLevel(a.name).level;
            const levelB = extractLevel(b.name).level;
            return levelA - levelB;
        });
        groups.set(key, items);
    });

    return groups;
}

export function WeaponCard({ item: initialItem, variants }: WeaponCardProps) {
    const { t } = useApp();
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentItem, setCurrentItem] = useState(initialItem);

    const rarity = currentItem.rarity?.toLowerCase() || "common";
    const config = rarityConfig[rarity] || rarityConfig.common;
    const hasVariants = variants.length > 1;
    const { level, baseName } = extractLevel(currentItem.name);

    return (
        <div
            className="relative"
            onMouseEnter={() => hasVariants && setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className={cn(
                "group relative flex flex-col overflow-hidden transition-all duration-300 transform-gpu",
                "bg-card/30 backdrop-blur-md border border-border/50",
                config.border,
                config.glow,
                "hover:-translate-y-1 hover:bg-card/50"
            )}>
                <div className={cn("h-0.5 w-full transition-colors duration-300", config.text.replace('text-', 'bg-'))} />
                <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-black/20 to-transparent p-4">
                    {currentItem.icon ? (
                        <img
                            src={currentItem.icon}
                            alt={currentItem.name}
                            className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                            style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
                        />
                    ) : (
                        <div className="text-4xl opacity-20 grayscale">📦</div>
                    )}

                    {currentItem.item_type && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md border border-white/5 text-[10px] uppercase font-mono tracking-wider text-muted-foreground mr-8">
                            {currentItem.item_type}
                        </div>
                    )}

                    {hasVariants && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-primary">
                            <ChevronRight className={cn(
                                "w-4 h-4 transition-transform duration-200",
                                isExpanded ? "rotate-90" : ""
                            )} />
                        </div>
                    )}
                </div>

                <div className="p-3 flex-1 flex flex-col gap-2 relative">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm uppercase tracking-wide leading-tight line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">
                            <a
                                href={getMetaForgeItemUrl(currentItem.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {baseName}
                            </a>
                            {level > 0 && (
                                <span className={cn("ml-1 font-mono", config.text)}>
                                    {['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][level]}
                                </span>
                            )}
                        </h3>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/5">
                        <span className={cn("text-[10px] font-mono uppercase tracking-widest opacity-70", config.text)}>
                            {rarity}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                            {currentItem.weight !== undefined && (
                                <span title="Weight">
                                    {currentItem.weight}kg
                                </span>
                            )}
                            {currentItem.value !== undefined && (
                                <span className="text-primary/80 flex items-center gap-1" title="Value">
                                    <span>$</span>{currentItem.value}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={cn("w-1.5 h-1.5", config.text.replace('text-', 'bg-'))} />
                </div>
                <div className="absolute bottom-0 left-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={cn("w-1.5 h-1.5", config.text.replace('text-', 'bg-'))} />
                </div>
            </div>

            {hasVariants && (
                <div className={cn(
                    "absolute left-full top-0 ml-2 z-50 min-w-[240px]",
                    "transition-all duration-300 ease-out",
                    isExpanded
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-4 pointer-events-none"
                )}>
                    <div className="bg-background/95 border border-border/50 rounded-lg shadow-2xl overflow-hidden">
                        <div className="px-3 py-2 bg-primary/10 border-b border-border/50">
                            <span className="text-xs font-mono uppercase tracking-wider text-primary">
                                {t("selectLevel")}
                            </span>
                        </div>
                        <div className="p-2 space-y-1">
                            {variants.map((variant) => {
                                const variantLevel = extractLevel(variant.name).level;
                                const variantRarity = variant.rarity?.toLowerCase() || "common";
                                const variantConfig = rarityConfig[variantRarity] || rarityConfig.common;
                                const isCurrent = variant.id === currentItem.id;

                                return (
                                    <button
                                        key={variant.id}
                                        onClick={() => setCurrentItem(variant)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left group/btn",
                                            isCurrent
                                                ? "bg-primary/10 border border-primary/30"
                                                : "hover:bg-muted/50 border border-transparent hover:border-border/30"
                                        )}
                                    >
                                        <div className="relative w-12 h-12 flex-shrink-0 bg-muted/20 rounded-md p-1">
                                            {variant.icon ? (
                                                <img
                                                    src={variant.icon}
                                                    alt={variant.name}
                                                    className="w-full h-full object-contain drop-shadow-md"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg opacity-20 grayscale">📦</div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold truncate group-hover/btn:text-primary transition-colors">
                                                {variantLevel > 0 ? (
                                                    <span>
                                                        Level {['', 'I', 'II', 'III', 'IV', 'V'][variantLevel]}
                                                    </span>
                                                ) : (
                                                    baseName
                                                )}
                                            </div>
                                            <div className={cn("text-[10px] font-mono uppercase", variantConfig.text)}>
                                                {variantRarity}
                                            </div>
                                        </div>

                                        {isCurrent && (
                                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(234,179,8,0.3)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}