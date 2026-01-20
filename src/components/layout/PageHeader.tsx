import { Separator } from "@/components/ui/separator"
import { ReactNode } from "react"

interface PageHeaderProps {
    title: string
    description?: string
    children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md px-6 py-6 border-b border-border/50">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight uppercase font-mono text-primary">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground font-mono">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-4">
                {children}
            </div>
        </div>
    )
}