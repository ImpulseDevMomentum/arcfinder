"use client";

import { useState, useEffect } from "react";
import { Loader2, Radio, AlertCircle } from "lucide-react";
import { Arc, fetchArcs } from "@/lib/api";
import { ArcCard } from "@/components/ArcCard";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ArcsPage() {
    const [arcs, setArcs] = useState<Arc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await fetchArcs();
                setArcs(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load ARCs");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    return (
        <div className="min-h-full flex flex-col">
            <PageHeader
                title="ARCs"
                description="System signals and points of interest"
            />

            <main className="container mx-auto px-6 py-8 flex-1">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-muted-foreground font-mono">Loading ARCs...</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {arcs.map((arc) => (
                            <ArcCard key={arc.id} arc={arc} />
                        ))}
                        {arcs.length === 0 && (
                            <div className="col-span-full text-center py-20 text-muted-foreground">
                                No ARCs found.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}