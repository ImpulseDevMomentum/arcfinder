"use client";

import { Trader } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Users, Package, ShoppingBag } from "lucide-react";

interface TraderCardProps {
    trader: Trader;
}

export function TraderCard({ trader }: TraderCardProps) {
    const itemCount = trader.items?.length || 0;

    return (
        <div className={cn(
            "group relative flex flex-col overflow-hidden transition-all duration-300",
            "bg-card/30 backdrop-blur-md border border-border/50",
            "hover:bg-card/50 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_rgba(255,85,0,0.15)]"
        )}>
            <div className="h-20 bg-gradient-to-br from-primary/10 to-transparent relative p-4 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-background bg-zinc-800/80 flex items-center justify-center absolute -bottom-8 text-primary group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7" />
                </div>
            </div>

            <div className="pt-10 p-5 text-center flex-1 flex flex-col">
                <h3 className="font-bold text-lg uppercase tracking-wide text-foreground/90 group-hover:text-primary transition-colors">
                    {trader.name}
                </h3>

                <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-mono text-primary">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{itemCount} offers</span>
                    </div>
                </div>

                {trader.items && trader.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Recent Offers</div>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {(trader.items as Array<{ name?: string }>).slice(0, 3).map((item, i) => (
                                <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded text-foreground/70 truncate max-w-[80px]">
                                    {item?.name || 'Item'}
                                </span>
                            ))}
                            {itemCount > 3 && (
                                <span className="text-xs text-muted-foreground px-2 py-0.5">
                                    +{itemCount - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}