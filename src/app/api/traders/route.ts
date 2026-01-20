import { NextResponse } from "next/server";
import { getCache, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

const METAFORGE_BASE_URL = process.env.METAFORGE_BASE_URL;

export async function GET() {
    try {

        const cached = await getCache<unknown[]>(CACHE_KEYS.TRADERS);

        if (cached) {
            return NextResponse.json(cached);
        }

        const response = await fetch(`${METAFORGE_BASE_URL}/traders`, {
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `MetaForge API error: ${response.status}` },
                { status: response.status }
            );
        }

        const result = await response.json();
        let traders: unknown[] = [];

        if (result.success && result.data && typeof result.data === 'object') {
            traders = Object.entries(result.data).map(([name, items]) => ({
                id: name.toLowerCase(),
                name: name,
                items: items,
                description: `Trader ${name}`,
            }));
        } else if (Array.isArray(result)) {
            traders = result;
        } else if (result.data && Array.isArray(result.data)) {
            traders = result.data;
        } else {
            console.warn("Unexpected API response structure for traders:", result);
            traders = [];
        }

        await setCache(CACHE_KEYS.TRADERS, traders, CACHE_TTL);

        return NextResponse.json(traders);
    } catch (error) {
        console.error("Failed to fetch traders:", error);
        return NextResponse.json(
            { error: "Failed to fetch traders from MetaForge" },
            { status: 500 }
        );
    }
}