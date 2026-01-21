"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Store } from "lucide-react";
import { Trader, fetchTraders } from "@/lib/api";
import { TraderCard } from "@/components/TraderCard";
import { PageHeader } from "@/components/layout/PageHeader";

export default function TradersPage() {
    const [traders, setTraders] = useState<Trader[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await fetchTraders();
                setTraders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load traders");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const totalItems = traders.reduce((acc, t) => acc + (t.items?.length || 0), 0);

    return (
        <div className="min-h-full flex flex-col">
            <PageHeader
                title="Traders"
                description={`${traders.length} vendors with ${totalItems} items available`}
            />

            <main className="container mx-auto px-6 py-8 flex-1">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-muted-foreground font-mono">Loading traders...</p>
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
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                            {traders.map((trader) => (
                                <TraderCard key={trader.id} trader={trader} />
                            ))}
                        </div>

                        {traders.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                                <Store className="w-12 h-12" />
                                <p>No traders found.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}