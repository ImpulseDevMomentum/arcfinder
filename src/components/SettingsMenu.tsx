"use client";

import { Sun, Moon, Globe } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function SettingsMenu() {
    const { locale, setLocale, theme, toggleTheme, t } = useApp();

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setLocale(locale === "pl" ? "en" : "pl")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-all text-sm"
                title={t("language")}
            >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium">{locale}</span>
            </button>

            <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-all"
                title={theme === "dark" ? t("lightMode") : t("darkMode")}
            >
                {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                ) : (
                    <Moon className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}