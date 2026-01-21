"use client";

import { Quest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ZoomIn, ZoomOut, Maximize2, Gift, Package, ExternalLink, Check } from "lucide-react";
import { CachedImage } from "./CachedImage";

interface QuestMapProps {
    quests: Quest[];
}

const TRADER_COLORS: Record<string, string> = {
    "Celeste": "#3b82f6",
    "Shani": "#22c55e",
    "TianWen": "#f59e0b",
    "Apollo": "#a855f7",
    "Lance": "#ef4444",
};

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const NODE_SIZE = 60;

export function QuestMap({ quests }: QuestMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.3 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredQuest, setHoveredQuest] = useState<Quest | null>(null);
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
    const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());

    useEffect(() => {
        try {
            const saved = localStorage.getItem('questComTracker');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setCompletedQuests(new Set(parsed));
                }
            }
        } catch (e) {
            console.error('Failed to load quest completion data:', e);
        }
    }, []);

    const toggleQuestCompletion = useCallback((questId: string) => {
        setCompletedQuests(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questId)) {
                newSet.delete(questId);
            } else {
                newSet.add(questId);
            }
            localStorage.setItem('questComTracker', JSON.stringify([...newSet]));
            return newSet;
        });
    }, []);

    const bounds = useMemo(() => {
        if (quests.length === 0) return { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        quests.forEach(q => {
            if (q.position) {
                minX = Math.min(minX, q.position.x);
                maxX = Math.max(maxX, q.position.x);
                minY = Math.min(minY, q.position.y);
                maxY = Math.max(maxY, q.position.y);
            }
        });
        return { minX: minX - 100, maxX: maxX + 100, minY: minY - 100, maxY: maxY + 100 };
    }, [quests]);

    useEffect(() => {
        if (containerRef.current && quests.length > 0) {
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = (bounds.minX + bounds.maxX) / 2;
            const centerY = (bounds.minY + bounds.maxY) / 2;

            setTransform({
                x: rect.width / 2 - centerX * 0.3,
                y: rect.height / 2 - centerY * 0.3,
                scale: 0.3
            });
        }
    }, [quests.length, bounds]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
        }
    }, [transform.x, transform.y]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            setTransform(prev => ({
                ...prev,
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            }));
        }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const delta = e.deltaY > 0 ? 0.9 : 1.1;

            setTransform(prev => {
                const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.scale * delta));
                const scaleChange = newScale / prev.scale;
                return {
                    x: mouseX - (mouseX - prev.x) * scaleChange,
                    y: mouseY - (mouseY - prev.y) * scaleChange,
                    scale: newScale
                };
            });
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    const zoomIn = () => {
        setTransform(prev => ({ ...prev, scale: Math.min(MAX_ZOOM, prev.scale * 1.2) }));
    };

    const zoomOut = () => {
        setTransform(prev => ({ ...prev, scale: Math.max(MIN_ZOOM, prev.scale / 1.2) }));
    };

    const fitToScreen = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = bounds.maxX - bounds.minX;
        const height = bounds.maxY - bounds.minY;
        const scaleX = rect.width / width * 0.9;
        const scaleY = rect.height / height * 0.9;
        const scale = Math.min(scaleX, scaleY, MAX_ZOOM);

        setTransform({
            x: rect.width / 2 - ((bounds.minX + bounds.maxX) / 2) * scale,
            y: rect.height / 2 - ((bounds.minY + bounds.maxY) / 2) * scale,
            scale
        });
    };

    const getTraderColor = (trader?: string) => {
        return trader ? TRADER_COLORS[trader] || "#6b7280" : "#6b7280";
    };

    return (
        <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px] bg-background/50 rounded-xl border border-border/50 overflow-hidden">
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button onClick={zoomIn} className="p-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card transition-colors">
                    <ZoomIn className="w-5 h-5" />
                </button>
                <button onClick={zoomOut} className="p-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card transition-colors">
                    <ZoomOut className="w-5 h-5" />
                </button>
                <button onClick={fitToScreen} className="p-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg hover:bg-card transition-colors">
                    <Maximize2 className="w-5 h-5" />
                </button>
            </div>

            <div className="absolute top-4 left-4 z-20 p-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg max-w-[180px]">
                <div className="text-xs font-mono uppercase text-muted-foreground mb-2">Traders</div>
                <div className="space-y-1">
                    {Object.entries(TRADER_COLORS).map(([trader, color]) => (
                        <div key={trader} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                            <span>{trader}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 pt-2 border-t border-border/30 text-[10px] text-muted-foreground/70 leading-tight">
                    Lines connect quests by trader, not actual progression order
                </div>
            </div>

            <div
                ref={containerRef}
                className={cn("w-full h-full", isDragging ? "cursor-grabbing" : "cursor-grab")}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    style={{
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                        transformOrigin: "0 0",
                    }}
                >
                    <svg
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            width: bounds.maxX - bounds.minX + 200,
                            height: bounds.maxY - bounds.minY + 200,
                            left: bounds.minX - 100,
                            top: bounds.minY - 100,
                            overflow: 'visible'
                        }}
                    >
                        {Object.entries(TRADER_COLORS).map(([trader, color]) => {
                            const traderQuests = quests
                                .filter(q => q.trader_name === trader && q.position)
                                .sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0));

                            if (traderQuests.length < 2) return null;

                            return traderQuests.slice(0, -1).map((quest, i) => {
                                const nextQuest = traderQuests[i + 1];
                                if (!quest.position || !nextQuest.position) return null;

                                const x1 = quest.position.x - (bounds.minX - 100);
                                const y1 = quest.position.y - (bounds.minY - 100);
                                const x2 = nextQuest.position.x - (bounds.minX - 100);
                                const y2 = nextQuest.position.y - (bounds.minY - 100);

                                return (
                                    <g key={`${quest.id}-${nextQuest.id}`}>
                                        <line
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke={color}
                                            strokeWidth={2}
                                            strokeOpacity={0.4}
                                            strokeDasharray="8,4"
                                        />
                                    </g>
                                );
                            });
                        })}
                    </svg>
                    {quests.map(quest => {
                        if (!quest.position) return null;
                        const color = getTraderColor(quest.trader_name);

                        return (
                            <div
                                key={quest.id}
                                className="absolute group cursor-pointer"
                                style={{
                                    left: quest.position.x - NODE_SIZE / 2,
                                    top: quest.position.y - NODE_SIZE / 2,
                                    width: NODE_SIZE,
                                    height: NODE_SIZE,
                                }}
                                onMouseEnter={() => setHoveredQuest(quest)}
                                onMouseLeave={() => setHoveredQuest(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedQuest(quest);
                                }}
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    toggleQuestCompletion(quest.id);
                                }}
                            >
                                <div
                                    className={cn(
                                        "w-full h-full rounded-xl overflow-hidden border-2 transition-all duration-200",
                                        "hover:scale-110 hover:z-10 hover:shadow-lg",
                                        selectedQuest?.id === quest.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                                        completedQuests.has(quest.id) && "opacity-60"
                                    )}
                                    style={{
                                        borderColor: completedQuests.has(quest.id) ? '#22c55e' : color,
                                        boxShadow: hoveredQuest?.id === quest.id ? `0 0 20px ${color}40` : undefined
                                    }}
                                >
                                    {quest.image ? (
                                        <CachedImage
                                            src={quest.image}
                                            alt={quest.name}
                                            className={cn("w-full h-full object-cover", completedQuests.has(quest.id) && "grayscale")}
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center"
                                            style={{ backgroundColor: `${color}20` }}
                                        >
                                            <Gift className="w-6 h-6" style={{ color }} />
                                        </div>
                                    )}
                                    {completedQuests.has(quest.id) && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-green-500/30">
                                            <Check className="w-8 h-8 text-green-500 drop-shadow-lg" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {hoveredQuest && !selectedQuest && (
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl max-w-md">
                    <div className="flex items-start gap-3">
                        {hoveredQuest.image && (
                            <CachedImage
                                src={hoveredQuest.image}
                                alt={hoveredQuest.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate">{hoveredQuest.name}</h3>
                            <div
                                className="text-sm font-medium"
                                style={{ color: getTraderColor(hoveredQuest.trader_name) }}
                            >
                                {hoveredQuest.trader_name}
                            </div>
                            {hoveredQuest.objectives && hoveredQuest.objectives.length > 0 && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {hoveredQuest.objectives[0]}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {selectedQuest && (
                <div className="absolute top-0 right-0 bottom-0 w-96 z-30 bg-card/95 backdrop-blur-md border-l border-border/50 overflow-y-auto">
                    <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border/30 p-4 flex items-center justify-between">
                        <h3 className="font-bold text-lg">Quest Details</h3>
                        <button
                            onClick={() => setSelectedQuest(null)}
                            className="p-1 hover:bg-accent rounded"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {selectedQuest.image && (
                            <CachedImage
                                src={selectedQuest.image}
                                alt={selectedQuest.name}
                                className="w-full h-40 rounded-lg object-cover"
                            />
                        )}

                        <div>
                            <h2 className="font-bold text-xl">{selectedQuest.name}</h2>
                            <div
                                className="text-sm font-medium mt-1"
                                style={{ color: getTraderColor(selectedQuest.trader_name) }}
                            >
                                {selectedQuest.trader_name}
                            </div>
                        </div>

                        {selectedQuest.objectives && selectedQuest.objectives.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Objectives</h4>
                                <ul className="space-y-1">
                                    {selectedQuest.objectives.map((obj, i) => (
                                        <li key={i} className="text-sm pl-3 border-l-2 border-primary/30">
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedQuest.required_items && selectedQuest.required_items.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Required Items ({selectedQuest.required_items.length})
                                </h4>
                                <div className="space-y-2">
                                    {selectedQuest.required_items.map((req) => {
                                        const rarityColors: Record<string, string> = {
                                            "Common": "bg-gray-500/20 text-gray-400 border-gray-500/30",
                                            "Uncommon": "bg-green-500/20 text-green-400 border-green-500/30",
                                            "Rare": "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                            "Epic": "bg-purple-500/20 text-purple-400 border-purple-500/30",
                                            "Legendary": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                        };
                                        const rarityClass = rarityColors[req.item.rarity] || "bg-muted text-muted-foreground border-border";

                                        return (
                                            <div
                                                key={req.id}
                                                className="flex items-center gap-3 p-2 rounded-lg bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-lg border border-border/50 overflow-hidden bg-background/50 flex-shrink-0">
                                                    {req.item.icon && (
                                                        <CachedImage
                                                            src={req.item.icon}
                                                            alt={req.item.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm truncate">{req.item.name}</span>
                                                        <span className="text-destructive font-bold text-xs">×{req.quantity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {req.item.rarity && (
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${rarityClass}`}>
                                                                {req.item.rarity}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] text-muted-foreground truncate">
                                                            {req.item.item_type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedQuest.rewards && selectedQuest.rewards.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                                    <Gift className="w-4 h-4" />
                                    Rewards ({selectedQuest.rewards.length})
                                </h4>
                                <div className="space-y-2">
                                    {selectedQuest.rewards.map((reward) => {
                                        const rarityColors: Record<string, string> = {
                                            "Common": "bg-gray-500/20 text-gray-400 border-gray-500/30",
                                            "Uncommon": "bg-green-500/20 text-green-400 border-green-500/30",
                                            "Rare": "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                            "Epic": "bg-purple-500/20 text-purple-400 border-purple-500/30",
                                            "Legendary": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                        };
                                        const rarityClass = rarityColors[reward.item.rarity] || "bg-muted text-muted-foreground border-border";

                                        return (
                                            <div
                                                key={reward.id}
                                                className="flex items-center gap-3 p-2 rounded-lg bg-background/30 border border-border/30 hover:bg-background/50 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-lg border border-border/50 overflow-hidden bg-background/50 flex-shrink-0">
                                                    {reward.item.icon && (
                                                        <CachedImage
                                                            src={reward.item.icon}
                                                            alt={reward.item.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm truncate">{reward.item.name}</span>
                                                        <span className="text-primary font-bold text-xs">×{reward.quantity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {reward.item.rarity && (
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${rarityClass}`}>
                                                                {reward.item.rarity}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] text-muted-foreground truncate">
                                                            {reward.item.item_type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {selectedQuest.guide_links && selectedQuest.guide_links.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Guides</h4>
                                <div className="space-y-1">
                                    {selectedQuest.guide_links.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}