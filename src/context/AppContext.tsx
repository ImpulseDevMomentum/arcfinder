"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Locale, TranslationKey, Translations, loadTranslations } from "@/lib/translations";

interface AppContextType {

    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey) => string;
    isLoading: boolean;
    theme: "dark" | "light";
    setTheme: (theme: "dark" | "light") => void;
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("pl");
    const [translations, setTranslations] = useState<Translations | null>(null);
    const [theme, setThemeState] = useState<"dark" | "light">("dark");
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadLocaleTranslations = useCallback(async (loc: Locale) => {
        setIsLoading(true);
        const trans = await loadTranslations(loc);
        setTranslations(trans);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setMounted(true);
        const savedLocale = localStorage.getItem("locale") as Locale;
        const savedTheme = localStorage.getItem("theme") as "dark" | "light";

        const initialLocale = (savedLocale === "pl" || savedLocale === "en") ? savedLocale : "pl";
        setLocaleState(initialLocale);
        loadLocaleTranslations(initialLocale);

        if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
            setThemeState(savedTheme);
        }
    }, [loadLocaleTranslations]);

    useEffect(() => {
        if (!mounted) return;

        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    const setLocale = useCallback(async (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("locale", newLocale);
        await loadLocaleTranslations(newLocale);
    }, [loadLocaleTranslations]);

    const setTheme = (newTheme: "dark" | "light") => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const t = useCallback((key: TranslationKey): string => {
        if (!translations) return key;
        return translations[key] || key;
    }, [translations]);

    if (!mounted) {
        return null;
    }

    return (
        <AppContext.Provider value={{ locale, setLocale, t, isLoading, theme, setTheme, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}