"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useApp } from "@/context/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { MAPS } from "@/lib/maps";
import { Map as MapIcon, ExternalLink, ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function MapsPage() {
    const { t } = useApp();

    return (
        <div className="min-h-full flex flex-col">
            <PageHeader
                title={t("mapsAll")}
                description="Select a map to explore"
            >
                <SettingsMenu />
            </PageHeader>

            <main className="container mx-auto px-6 py-8 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MAPS.map((map) => (
                        <MapCard key={map.id} map={map} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function MapCard({ map }: { map: typeof MAPS[0] }) {
    const { t } = useApp();
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/maps/${map.slug}`}
            className={cn(
                "group relative flex flex-col overflow-hidden transition-all duration-300",
                "bg-card/30 backdrop-blur-md border border-border/50 rounded-xl h-64",
                "hover:bg-card/50 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_rgba(255,85,0,0.15)]"
            )}
        >
            <div className="flex-1 bg-muted/20 flex items-center justify-center relative overflow-hidden">
                {!imageError ? (
                    <Image
                        src={map.image}
                        alt={t(map.nameKey)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        onError={() => setImageError(true)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                        <MapIcon className="w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
                        <span className="text-xs uppercase tracking-widest font-mono">No Preview</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-90" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-xl uppercase tracking-wide text-foreground/90 group-hover:text-primary transition-colors truncate pr-4">
                        {t(map.nameKey)}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <MapIcon className="w-3 h-3" />
                    Interactive Map
                </p>
            </div>
        </Link>
    );
}