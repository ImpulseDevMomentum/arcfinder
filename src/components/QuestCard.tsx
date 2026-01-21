"use client";

import { Quest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Target, Gift } from "lucide-react";
import { CachedImage } from "./CachedImage";

interface QuestCardProps {
    quest: Quest;
}

const TRADER_COLORS: Record<string, string> = {
    "Celeste": "#3b82f6",
    "Shani": "#22c55e",
    "TianWen": "#f59e0b",
    "Apollo": "#a855f7",
    "Lance": "#ef4444",
};

export function QuestCard({ quest }: QuestCardProps) {
    const traderColor = quest.trader_name ? TRADER_COLORS[quest.trader_name] || "#6b7280" : "#6b7280";

    return (
        <div className={cn(
            "group relative flex flex-col overflow-hidden transition-all duration-300",
            "bg-card/30 backdrop-blur-md border border-border/50 rounded-xl",
            "hover:bg-card/50 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_rgba(255,85,0,0.15)]"
        )}>
            {quest.image && (
                <div className="relative h-32 overflow-hidden">
                    <CachedImage
                        src={quest.image}
                        alt={quest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />

                    {quest.trader_name && (
                        <div
                            className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white"
                            style={{ backgroundColor: traderColor }}
                        >
                            {quest.trader_name}
                        </div>
                    )}
                </div>
            )}

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg uppercase tracking-wide text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
                    {quest.name}
                </h3>

                {!quest.image && quest.trader_name && (
                    <div
                        className="text-sm font-medium mt-1"
                        style={{ color: traderColor }}
                    >
                        {quest.trader_name}
                    </div>
                )}

                {quest.objectives && quest.objectives.length > 0 && (
                    <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground/70">
                            <Target className="w-3 h-3" />
                            <span>Objectives</span>
                        </div>
                        <ul className="space-y-1">
                            {quest.objectives.slice(0, 2).map((obj, i) => (
                                <li key={i} className="text-sm text-foreground/80 pl-2 border-l-2 border-primary/20 line-clamp-1">
                                    {obj}
                                </li>
                            ))}
                            {quest.objectives.length > 2 && (
                                <li className="text-xs text-muted-foreground pl-2">
                                    +{quest.objectives.length - 2} more...
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {quest.rewards && quest.rewards.length > 0 && (
                    <div className="mt-auto pt-3 border-t border-border/30">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground/70 mb-2">
                            <Gift className="w-3 h-3" />
                            <span>Rewards</span>
                        </div>
                        <div className="flex gap-1">
                            {quest.rewards.slice(0, 4).map((reward) => (
                                <div
                                    key={reward.id}
                                    className="w-8 h-8 rounded border border-border/50 overflow-hidden bg-background/50"
                                    title={reward.item.name}
                                >
                                    {reward.item.icon && (
                                        <CachedImage
                                            src={reward.item.icon}
                                            alt={reward.item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                            ))}
                            {quest.rewards.length > 4 && (
                                <div className="w-8 h-8 rounded border border-border/50 bg-background/50 flex items-center justify-center text-xs text-muted-foreground">
                                    +{quest.rewards.length - 4}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}