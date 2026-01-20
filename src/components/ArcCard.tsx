"use client";

import { Arc } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Radio } from "lucide-react";

interface ArcCardProps {
    arc: Arc;
}

export function ArcCard({ arc }: ArcCardProps) {
    return (
        <div className={cn(
            "group relative flex flex-col p-6 overflow-hidden transition-all duration-300 aspect-video",
            "bg-card/30 backdrop-blur-md border border-border/50",
            "hover:bg-card/50 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_rgba(255,85,0,0.15)]"
        )}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                }}
            />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center gap-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <Radio className="w-8 h-8" />
                </div>

                <div>
                    <h3 className="font-bold text-xl uppercase tracking-widest font-mono text-foreground/90 group-hover:text-primary transition-colors">
                        {arc.name}
                    </h3>
                    {arc.description && (
                        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                            {arc.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/30" />
        </div>
    );
}