"use client";

import { Sun, Moon, Globe } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function SettingsMenu() {
    const { locale, setLocale, theme, toggleTheme, t } = useApp();

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setLocale(locale === "pl" ? "en" : "pl")}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
                title={t("language")}
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{locale}</span>
            </button>

            <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-muted-foreground hover:text-foreground"
                title={theme === "dark" ? t("lightMode") : t("darkMode")}
            >
                {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                ) : (
                    <Moon className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}