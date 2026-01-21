"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useApp } from "@/context/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { getMapBySlug } from "@/lib/maps";
import { notFound } from "next/navigation";
import { use } from "react";

interface MapPageProps {
    params: Promise<{ slug: string }>;
}

export default function DynamicMapPage({ params }: MapPageProps) {
    const { t } = useApp();
    const resolvedParams = use(params);
    const map = getMapBySlug(resolvedParams.slug);

    if (!map) {
        notFound();
    }

    const MAP_GENIE_URL = `https://mapgenie.io/arc-raiders/maps/${map.slug}?embed=light`;

    return (
        <div className="min-h-full flex flex-col h-screen">
            <PageHeader
                title={t(map.nameKey)}
                description="Interactive map provided by MapGenie.io"
            >
                <SettingsMenu />
            </PageHeader>

            <div className="flex-1 w-full bg-background relative">
                <iframe
                    src={MAP_GENIE_URL}
                    className="absolute inset-0 w-full h-full border-0"
                    title={`${t(map.nameKey)} - ARC Raiders Map`}
                    allow="fullscreen"
                    loading="lazy"
                />
            </div>
        </div>
    );
}