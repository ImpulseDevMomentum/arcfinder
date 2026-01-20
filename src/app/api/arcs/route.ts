import { NextResponse } from "next/server";
import { getCache, setCache, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

const METAFORGE_BASE_URL = process.env.METAFORGE_BASE_URL;

export async function GET() {

    try {
        const cached = await getCache<unknown[]>(CACHE_KEYS.ARCS);

        if (cached) {
            return NextResponse.json(cached);
        }

        const response = await fetch(`${METAFORGE_BASE_URL}/arcs`, {
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
        let data: unknown[] = [];

        if (Array.isArray(result)) {
            data = result;
        } else if (result.data && Array.isArray(result.data)) {
            data = result.data;
        } else {
            console.warn("Unexpected API response structure for arcs:", result);
            data = [];
        }

        await setCache(CACHE_KEYS.ARCS, data, CACHE_TTL);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch ARCs:", error);
        return NextResponse.json(
            { error: "Failed to fetch ARCs from MetaForge" },
            { status: 500 }
        );
    }
}