"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useApp } from "@/context/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { useEffect, useState } from "react";
import { Arc } from "@/types/arc";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AlertCircle, Terminal } from "lucide-react";
import { CachedImage } from "@/components/CachedImage";

export default function ArcsPage() {
    const { t } = useApp();
    const [arcs, setArcs] = useState<Arc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArcs = async () => {
            try {
                const res = await fetch("/api/arcs");
                if (!res.ok) throw new Error("Failed to fetch ARCs");
                const data = await res.json();
                setArcs(Array.isArray(data) ? data : data.value || []);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArcs();
    }, []);

    return (
        <div className="min-h-full flex flex-col">
            <PageHeader
                title="ARCs"
                description="Database of known ARC machine threats"
            >
                <SettingsMenu />
            </PageHeader>

            <main className="container mx-auto px-6 py-8 flex-1">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-muted/20 rounded-xl border border-border/50" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-destructive/5 rounded-xl border border-destructive/20">
                        <AlertCircle className="w-12 h-12 mb-4 text-destructive/50" />
                        <h3 className="text-lg font-medium text-destructive">Failed to load ARC database</h3>
                        <p className="text-sm mt-2 opacity-70">Please check your connection and try again.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {arcs.map((arc) => (
                            <ArcCard key={arc.id} arc={arc} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

function ArcCard({ arc }: { arc: Arc }) {

    const [isHovered, setIsHovered] = useState(false);
    const mainImage = arc.image || arc.icon;

    return (
        <div
            className={cn(
                "group relative flex flex-col overflow-hidden transition-all duration-500",
                "bg-card/40 backdrop-blur-md border border-border/40 rounded-xl",
                "hover:bg-card/60 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(255,85,0,0.2)]",
                "h-[400px]"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 z-0">
                {mainImage ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={mainImage}
                            alt={arc.name}
                            fill
                            className={cn(
                                "object-cover transition-transform duration-700 ease-out",
                                isHovered ? "scale-110 blur-[2px] opacity-40" : "scale-100 opacity-60"
                            )}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.opacity = "0.1";
                            }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90" />
                    </div>
                ) : (
                    <div className="w-full h-full bg-muted/10 flex items-center justify-center">
                        <Terminal className="w-32 h-32 text-muted-foreground/10" />
                    </div>
                )}
            </div>

            <div className="relative z-10 flex flex-col h-full p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-2xl uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                            {arc.name}
                        </h3>
                        <span className="text-xs font-mono text-muted-foreground/70 uppercase tracking-widest mt-1">
                            ARC Unit
                        </span>
                    </div>
                    {arc.icon && (
                        <div className="relative w-12 h-12 rounded-lg bg-background/50 border border-border/50 p-1 backdrop-blur-sm shrink-0 group-hover:border-primary/50 transition-colors">
                            <CachedImage
                                src={arc.icon}
                                alt={arc.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <div className={cn(
                        "text-sm text-muted-foreground leading-relaxed transition-all duration-300 relative overflow-hidden",
                        isHovered ? "max-h-[200px] opacity-100" : "max-h-[100px] opacity-80"
                    )}>
                        <p className={cn(!isHovered && "line-clamp-4")}>
                            {arc.description}
                        </p>
                        {!isHovered && (
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
                        )}
                    </div>
                </div>

                <div className={cn(
                    "h-1 w-full mt-6 rounded-full bg-primary/20 overflow-hidden",
                    "transition-all duration-500 delay-100"
                )}>
                    <div className={cn(
                        "h-full bg-primary transition-all duration-500 ease-out",
                        isHovered ? "w-full" : "w-0"
                    )} />
                </div>
            </div>
        </div>
    );
}