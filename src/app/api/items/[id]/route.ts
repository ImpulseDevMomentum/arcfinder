import { NextRequest, NextResponse } from "next/server";
import { getCache, CACHE_KEYS } from "@/lib/redis";
import { Item } from "@/lib/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    try {
        let items = await getCache<Item[]>(CACHE_KEYS.ITEMS);

        if (!items) {
            const baseUrl = request.nextUrl.origin;
            const res = await fetch(`${baseUrl}/api/items`);
            if (res.ok) {
                items = await res.json();
            }
        }

        if (!items) {
            return NextResponse.json(
                { error: "Items not found" },
                { status: 404 }
            );
        }

        const item = items.find((i: any) =>
            i.id === id ||
            i.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase() ||
            i.id.toLowerCase() === id.toLowerCase()
        );

        if (!item) {
            return NextResponse.json(
                { error: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(item, {
            headers: {
                'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
            },
        });

    } catch (error) {
        console.error("Failed to fetch item:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}