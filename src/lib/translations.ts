export type Locale = "pl" | "en";

export type TranslationKey =
    | "appName"
    | "appDescription"
    | "searchPlaceholder"
    | "rarity"
    | "type"
    | "all"
    | "foundItems"
    | "items"
    | "forQuery"
    | "noItemsFound"
    | "clearFilters"
    | "loading"
    | "tryAgain"
    | "dataFrom"
    | "propertyOf"
    | "darkMode"
    | "lightMode"
    | "language";

export type Translations = Record<TranslationKey, string>;

const translationsCache: Partial<Record<Locale, Translations>> = {};

export async function loadTranslations(locale: Locale): Promise<Translations> {
    if (translationsCache[locale]) {
        return translationsCache[locale]!;
    }

    try {
        const response = await fetch(`/lang/${locale}/basic.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${locale}`);
        }
        const translations = await response.json();
        translationsCache[locale] = translations;
        return translations;
    } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        return {} as Translations;
    }
}
export function preloadTranslations(locale: Locale): void {
    loadTranslations(locale);
}