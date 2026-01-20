import { NextResponse } from "next/server";

const METAFORGE_BASE_URL = "https://metaforge.app/api/arc-raiders";

interface MetaForgeResponse {
    data: unknown[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export async function GET() {
    try {
        // Fetch all pages to get complete item list
        const allItems: unknown[] = [];
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
            const response = await fetch(`${METAFORGE_BASE_URL}/items?page=${page}&limit=50`, {
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

            const result: MetaForgeResponse = await response.json();
            allItems.push(...result.data);
            hasNextPage = result.pagination.hasNextPage;
            page++;

            // Safety limit to prevent infinite loops
            if (page > 20) break;
        }

        return NextResponse.json(allItems);
    } catch (error) {
        console.error("Failed to fetch items:", error);
        return NextResponse.json(
            { error: "Failed to fetch items from MetaForge" },
            { status: 500 }
        );
    }
}