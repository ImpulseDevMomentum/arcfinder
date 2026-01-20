"use client";

import { Item } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ItemCardProps {
    item: Item;
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

export function ItemCard({ item }: ItemCardProps) {
    const rarity = item.rarity?.toLowerCase() || "common";
    const config = rarityConfig[rarity] || rarityConfig.common;

    return (
        <div className={cn(
            "group relative flex flex-col overflow-hidden transition-all duration-300",
            "bg-card/30 backdrop-blur-md border border-border/50",
            config.border,
            config.glow,
            "hover:-translate-y-1 hover:bg-card/50"
        )}>
            <div className={cn("h-0.5 w-full transition-colors duration-300", config.text.replace('text-', 'bg-'))} />
            <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-black/20 to-transparent p-4">
                {item.icon ? (
                    <img
                        src={item.icon}
                        alt={item.name}
                        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="text-4xl opacity-20 grayscale">📦</div>
                )}

                {item.item_type && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md border border-white/5 text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                        {item.item_type}
                    </div>
                )}
            </div>

            <div className="p-3 flex-1 flex flex-col gap-2 relative">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm uppercase tracking-wide leading-tight line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">
                        {item.name}
                    </h3>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/5">
                    <span className={cn("text-[10px] font-mono uppercase tracking-widest opacity-70", config.text)}>
                        {rarity}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                        {item.weight !== undefined && (
                            <span title="Weight">
                                {item.weight}kg
                            </span>
                        )}
                        {item.value !== undefined && (
                            <span className="text-primary/80 flex items-center gap-1" title="Value">
                                <span>$</span>{item.value}
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
    );
}