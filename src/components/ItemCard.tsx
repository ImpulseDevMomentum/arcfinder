"use client";

import { Item } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
    item: Item;
}

// Map rarity to color classes
const rarityColors: Record<string, string> = {
    common: "bg-gray-500/20 text-gray-300 border-gray-500/50",
    uncommon: "bg-green-500/20 text-green-300 border-green-500/50",
    rare: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    epic: "bg-purple-500/20 text-purple-300 border-purple-500/50",
    legendary: "bg-amber-500/20 text-amber-300 border-amber-500/50",
};

export function ItemCard({ item }: ItemCardProps) {
    const rarityClass = item.rarity
        ? rarityColors[item.rarity.toLowerCase()] || rarityColors.common
        : rarityColors.common;

    return (
        <Card className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            {/* Item Image */}
            <div className="aspect-square relative bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center overflow-hidden">
                {item.icon ? (
                    <img
                        src={item.icon}
                        alt={item.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="text-4xl text-muted-foreground/30">📦</div>
                )}

                {/* Rarity badge */}
                {item.rarity && (
                    <Badge
                        variant="outline"
                        className={`absolute top-2 right-2 text-xs capitalize ${rarityClass}`}
                    >
                        {item.rarity}
                    </Badge>
                )}
            </div>

            {/* Item Info */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground truncate" title={item.name}>
                    {item.name}
                </h3>

                {item.item_type && (
                    <p className="text-xs text-muted-foreground capitalize">
                        {item.item_type}
                    </p>
                )}

                {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                    </p>
                )}

                {/* Additional info */}
                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                    {item.weight !== undefined && (
                        <span className="flex items-center gap-1">
                            ⚖️ {item.weight}
                        </span>
                    )}
                    {item.value !== undefined && (
                        <span className="flex items-center gap-1">
                            💰 {item.value}
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
}