"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    allLabel?: string;
    className?: string;
}

export function FilterSelect({
    label,
    value,
    onChange,
    options,
    allLabel = "Wszystkie",
    className
}: FilterSelectProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <label className="text-sm text-muted-foreground whitespace-nowrap">{label}</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[180px] bg-card/50 backdrop-blur-sm border-white/10 h-8 text-xs font-medium uppercase tracking-wider">
                    <SelectValue placeholder={allLabel} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all" className="capitalize text-sm font-medium">
                        {allLabel}
                    </SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option} value={option} className="capitalize text-sm font-medium">
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}