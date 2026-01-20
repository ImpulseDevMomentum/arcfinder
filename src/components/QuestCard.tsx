"use client";

import { Quest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Scroll, Trophy, Target } from "lucide-react";

interface QuestCardProps {
    quest: Quest;
}

export function QuestCard({ quest }: QuestCardProps) {
    return (
        <div className={cn(
            "group relative flex flex-col p-5 overflow-hidden transition-all duration-300",
            "bg-card/30 backdrop-blur-md border border-border/50",
            "hover:bg-card/50 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_rgba(255,85,0,0.15)]"
        )}>
            <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Scroll className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg uppercase tracking-wide text-foreground/90 group-hover:text-primary transition-colors">
                        {quest.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                        {quest.description || "No description available."}
                    </p>
                </div>
            </div>

            {quest.objectives && quest.objectives.length > 0 && (
                <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground/70">
                        <Target className="w-3 h-3" />
                        <span>Objectives</span>
                    </div>
                    <ul className="space-y-1">
                        {quest.objectives.slice(0, 2).map((obj, i) => (
                            <li key={i} className="text-sm text-foreground/80 pl-2 border-l-2 border-primary/20">
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

            <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
        </div>
    );
}