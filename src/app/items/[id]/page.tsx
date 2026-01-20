"use client";

import { useEffect, useState, use } from "react";
import { fetchItem, Item } from "@/lib/api";
import { ArrowLeft, Heart, Box, Weight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CachedImage } from "@/components/CachedImage";

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchItem(id)
            .then(data => {
                setItem(data);
                console.log("Item Details Data:", data);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
            Loading item data...
        </div>
    );

    if (error || !item) return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-destructive">Error: {error || "Item not found"}</p>
            <button onClick={() => router.back()} className="text-sm underline hover:text-primary">
                Go Back
            </button>
        </div>
    );

    const rarity = item.rarity?.toLowerCase() || "common";
    const rarityColors: Record<string, string> = {
        common: "text-zinc-400 border-zinc-500/30",
        uncommon: "text-green-400 border-green-500/30",
        rare: "text-blue-400 border-blue-500/30",
        epic: "text-purple-400 border-purple-500/30",
        legendary: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    };
    const rarityStyle = rarityColors[rarity] || rarityColors.common;

    const stackSize = item.stat_block?.stackSize ?? 1;
    const weight = item.stat_block?.weight ?? item.weight ?? 0;
    const value = item.value ?? item.stat_block?.value ?? 0;
    const displayStats = item.stat_block ? Object.entries(item.stat_block).filter(([key, val]) => {
        if (key === 'weight' || key === 'stackSize' || key === 'value') return false;
        if (typeof val === 'number' && val === 0) return false;
        if (val === null || val === "") return false;
        return true;
    }) : [];

    return (
        <div className="min-h-full bg-background flex flex-col">
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                    <Box className="w-4 h-4" />
                    <span>Item:</span>
                    <span className="text-foreground font-semibold">{item.name}</span>
                </div>
            </div>

            <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className={cn("p-6 rounded-lg border bg-card/40 backdrop-blur-sm space-y-6 self-start", rarityStyle.split(' ')[1])}>
                    <div className="w-full aspect-square bg-black/20 rounded-md border border-white/5 flex items-center justify-center p-8 relative overflow-hidden group">
                        {item.icon ? (
                            <CachedImage
                                src={item.icon}
                                alt={item.name}
                                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                fallback={<span className="text-6xl grayscale opacity-20">📦</span>}
                            />
                        ) : (
                            <span className="text-6xl grayscale opacity-20">📦</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <h1 className="text-3xl font-bold uppercase tracking-tight text-foreground">{item.name}</h1>
                            <button className="text-muted-foreground hover:text-red-500 transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            {item.item_type && (
                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider rounded border border-yellow-500/30">
                                    {item.item_type}
                                </span>
                            )}
                            <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border", rarityStyle)}>
                                {rarity}
                            </span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description || "No description available."}
                        </p>

                        <div className="grid grid-cols-3 gap-4 pt-4 mt-2 border-t border-white/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-muted-foreground font-mono">Stack</span>
                                <div className="flex items-center gap-2 font-mono text-sm">
                                    <Box className="w-4 h-4 opacity-50" />
                                    {stackSize}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-muted-foreground font-mono">Weight</span>
                                <div className="flex items-center gap-2 font-mono text-sm">
                                    <Weight className="w-4 h-4 opacity-50" />
                                    {weight} kg
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-muted-foreground font-mono">Value</span>
                                <div className="flex items-center gap-2 font-mono text-sm text-primary font-bold">
                                    <img src="/iconCoins.svg" alt="Coins" className="w-4 h-4" />
                                    {value}
                                </div>
                            </div>
                        </div>

                        {item.updated_at && (
                            <div className="text-[10px] text-muted-foreground/40 mt-2">
                                Last updated: {new Date(item.updated_at).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {displayStats.length > 0 ? (
                        <div className="p-6 rounded-lg border border-border/50 bg-card/20 backdrop-blur-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                <Box className="w-4 h-4" />
                                Specifications
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {displayStats.map(([key, val]) => (
                                    <div key={key} className="flex flex-col p-3 rounded bg-background/50 border border-white/5">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className="font-mono text-sm">
                                            {String(val)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-lg border border-border/50 bg-card/10 border-dashed flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
                            <Box className="w-8 h-8 opacity-20 mb-2" />
                            <p className="text-sm">No additional statistics available.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}