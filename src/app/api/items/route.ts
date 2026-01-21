import { NextResponse } from "next/server";
import { getItems } from "@/lib/itemsLoader";

export async function GET() {
    try {
        const items = await getItems();
        return NextResponse.json(items);
    } catch (error) {
        console.error("Failed to fetch items:", error);
        return NextResponse.json(
            { error: "Failed to fetch items from MetaForge" },
            { status: 500 }
        );
    }
}