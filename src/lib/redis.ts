import Redis from "ioredis";

let redis: Redis | null = null;

function getRedisClient(): Redis {
    if (!redis) {
        const serviceUri = process.env.SERVICE_URI;
        if (!serviceUri) {
            throw new Error("SERVICE_URI environment variable is not set");
        }
        redis = new Redis(serviceUri);
        redis.on("error", (err) => {
            console.error("[Redis] Connection error:", err.message);
        });
        redis.on("connect", () => {
            console.log("[Redis] Connected successfully");
        });
    }
    return redis;
}

export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const client = getRedisClient();
        const data = await client.get(key);
        if (data) {
            console.log(`[Redis] Cache hit for ${key}`);
            return JSON.parse(data) as T;
        }
        console.log(`[Redis] Cache miss for ${key}`);
        return null;
    } catch (error) {
        console.error(`[Redis] Error getting cache for ${key}:`, error);
        return null;
    }
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    try {
        const client = getRedisClient();
        await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
        console.log(`[Redis] Cached ${key} for ${ttlSeconds}s`);
    } catch (error) {
        console.error(`[Redis] Error setting cache for ${key}:`, error);
    }
}

export const CACHE_KEYS = {
    ITEMS: "arcfinder:items",
    ARCS: "arcfinder:arcs",
    TRADERS: "arcfinder:traders",
    QUESTS: "arcfinder:quests",
} as const;

export const CACHE_TTL = 300;