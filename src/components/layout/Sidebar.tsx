"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    Package,
    Scroll,
    Users,
    Radio,
    Menu,
    X,
    FileCode,
    Key,
    Sword,
    Paintbrush,
    Smile,
    AlertTriangle,
    ChevronDown,
    Utensils,
    Settings,
    Database,
    Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { TranslationKey } from "@/lib/translations";
import { getCacheStats, clearImageCache } from "@/lib/imageCache";

const CONTROL_VERSION = process.env.CONTROL_VERSION

const navigation = [
    { name: "Quests", href: "/quests", icon: Scroll },
    { name: "Traders", href: "/traders", icon: Users },
    { name: "ARCs", href: "/arcs", icon: Radio },
];

const itemCategories: { nameKey: TranslationKey; href: string; icon: typeof FileCode }[] = [
    { nameKey: "itemsBlueprints", href: "/items?category=blueprint", icon: FileCode },
    { nameKey: "itemsKeys", href: "/items?category=key", icon: Key },
    { nameKey: "itemsWeap", href: "/items?category=weapon", icon: Sword },
    { nameKey: "itemsStyles", href: "/items?category=style", icon: Paintbrush },
    { nameKey: "itemsEmotes", href: "/items?category=emote", icon: Smile },
    { nameKey: "itemsItemsDamaged", href: "/items?category=damaged", icon: AlertTriangle },
    { nameKey: "itemsFoodCon", href: "/items?category=consumable", icon: Utensils },
];

export function Sidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [itemsExpanded, setItemsExpanded] = useState(pathname.startsWith("/items"));
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [cacheStats, setCacheStats] = useState<{ count: number; sizeBytes: number } | null>(null);
    const [clearing, setClearing] = useState(false);
    const { t } = useApp();

    const isItemsActive = pathname.startsWith("/items");

    useEffect(() => {
        if (settingsOpen) {
            getCacheStats().then(setCacheStats);
        }
    }, [settingsOpen]);

    const handleClearCache = async () => {
        setClearing(true);
        await clearImageCache();
        setCacheStats({ count: 0, sizeBytes: 0 });
        setClearing(false);
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <>
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="bg-background/80 backdrop-blur-md">
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:block",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-full flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-sidebar-foreground tracking-wider uppercase">
                            <span className="text-primary">ARC</span> Finder
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        <div>
                            <button
                                onClick={() => setItemsExpanded(!itemsExpanded)}
                                className={cn(
                                    "w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group relative",
                                    isItemsActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Package className={cn("h-5 w-5", isItemsActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                    {t("items")}
                                </div>
                                <ChevronDown className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    itemsExpanded ? "rotate-180" : ""
                                )} />
                                {isItemsActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                )}
                            </button>

                            <div className={cn(
                                "overflow-hidden transition-all duration-200 ease-in-out",
                                itemsExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                                    <Link
                                        href="/items"
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-1.5 text-sm font-medium rounded-md transition-colors group",
                                            pathname === "/items" && typeof window !== 'undefined' && !window.location.search
                                                ? "bg-sidebar-accent/50 text-sidebar-accent-foreground"
                                                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        {t("itemsAll")}
                                    </Link>

                                    {itemCategories.map((item) => {
                                        const queryCategory = searchParams.get('category');
                                        const itemCategory = new URLSearchParams(item.href.split('?')[1]).get('category');
                                        const isActive = pathname === "/items" && queryCategory === itemCategory;

                                        return (
                                            <Link
                                                key={item.nameKey}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-1.5 text-sm font-medium rounded-md transition-colors group relative",
                                                    isActive
                                                        ? "text-primary bg-primary/10"
                                                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                                {t(item.nameKey)}
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group relative",
                                        isActive
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                    {item.name}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-3 border-t border-sidebar-border">
                        <div className={cn(
                            "overflow-hidden transition-all duration-200 ease-in-out mb-2",
                            settingsOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                        )}>
                            <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    <Database className="w-4 h-4" />
                                    IndexedDB Cache
                                </div>

                                {cacheStats ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Images:</span>
                                            <span className="font-mono text-foreground">{cacheStats.count}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Size:</span>
                                            <span className="font-mono text-foreground">{formatBytes(cacheStats.sizeBytes)}</span>
                                        </div>
                                        <button
                                            onClick={handleClearCache}
                                            disabled={clearing || cacheStats.count === 0}
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 text-destructive text-xs font-mono uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            {clearing ? "Clearing..." : "Clear Cache"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground animate-pulse">
                                        Loading...
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                settingsOpen
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                        >
                            <Settings className={cn("h-5 w-5", settingsOpen ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                            Settings
                            <ChevronDown className={cn(
                                "h-4 w-4 ml-auto transition-transform duration-200",
                                settingsOpen ? "" : "rotate-180"
                            )} />
                        </button>

                        <div className="text-xs text-muted-foreground text-center pt-3">
                            {CONTROL_VERSION}
                        </div>
                    </div>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}