"use client";

interface FilterSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    allLabel?: string;
}

export function FilterSelect({
    label,
    value,
    onChange,
    options,
    allLabel = "Wszystkie",
}: FilterSelectProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 px-3 rounded-lg bg-card/50 border border-border/50 text-foreground text-sm focus:border-primary/50 focus:outline-none transition-colors cursor-pointer"
            >
                <option value="all">{allLabel}</option>
                {options.map((option) => (
                    <option key={option} value={option} className="capitalize">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}