"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Map, List } from "lucide-react";
import { Quest, fetchQuests } from "@/lib/api";
import { QuestCard } from "@/components/QuestCard";
import { QuestMap } from "@/components/QuestMap";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

export default function QuestsPage() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"map" | "list">("map");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await fetchQuests();
                setQuests(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load quests");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <div className="min-h-full flex flex-col">
            <PageHeader
                title="Quests"
                description="Interactive quest map - drag to pan, scroll to zoom"
            >
                <div className="flex items-center gap-1 p-1 bg-background/50 rounded-lg border border-border/30">
                    <button
                        onClick={() => setViewMode("map")}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            viewMode === "map"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        <Map className="w-4 h-4" />
                        Map
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            viewMode === "list"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        <List className="w-4 h-4" />
                        List
                    </button>
                </div>
            </PageHeader>

            <main className="container mx-auto px-6 py-8 flex-1">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-muted-foreground font-mono">Loading quests...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                        </div>
                        <p className="text-destructive font-medium">{error}</p>
                    </div>
                )}

                {!loading && !error && viewMode === "map" && (
                    <QuestMap quests={quests} />
                )}

                {!loading && !error && viewMode === "list" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {quests.map((quest) => (
                            <QuestCard key={quest.id} quest={quest} />
                        ))}
                        {quests.length === 0 && (
                            <div className="col-span-full text-center py-20 text-muted-foreground">
                                No quests found.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}