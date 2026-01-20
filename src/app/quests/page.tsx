"use client";

import { useState, useEffect } from "react";
import { Loader2, Scroll, AlertCircle } from "lucide-react";
import { Quest, fetchQuests } from "@/lib/api";
import { QuestCard } from "@/components/QuestCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { useApp } from "@/context/AppContext";

export default function QuestsPage() {
    const { t } = useApp();
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                description="Active and available tasks"
            />

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

                {!loading && !error && (
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