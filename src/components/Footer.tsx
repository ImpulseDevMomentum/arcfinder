import { Github, ExternalLink, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-md mt-auto z-10">
            <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                    <div className="md:col-span-4 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-primary/20 rounded-md flex items-center justify-center border border-primary/40">
                                <span className="font-bold text-primary">A</span>
                            </div>
                            <span className="font-bold text-xl tracking-widest text-foreground">ARC FINDER</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Your ultimate companion for ARC Raiders.
                            Advanced database for items, quests, and traders with real-time market data.
                        </p>
                    </div>

                    <div className="md:col-span-4 flex flex-col justify-center space-y-4 md:px-8">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-foreground/50 font-semibold mb-2">Data Sources</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://metaforge.app/arc-raiders/api"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                                    MetaForge API
                                    <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://lucide.dev/icons/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                                    Lucide (Icons)
                                    <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://arcraiders.wiki/wiki/Category:Currency_UI_icons"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                                    ARC Raiders Wiki (In-game icons)
                                    <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-4 md:items-end md:text-right">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-foreground/50 font-semibold mb-2 hidden md:block">Legal & Community</h3>

                        <div className="text-xs text-muted-foreground space-y-2 opacity-70">
                            <p>
                                Not affiliated with Embark Studios AB.
                            </p>
                            <p className="max-w-xs md:ml-auto">
                                All game content and materials are copyright of Embark Studios AB.
                                ARC RAIDERS and EMBARK trademarks are property of Embark Studios AB.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-auto pt-4">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                                <span>Built with</span>
                                <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                                <span>by</span>
                                <span className="font-medium text-foreground">ThxImpulse</span>
                            </div>
                            <a
                                href="https://github.com/ImpulseDevMomentum/arcfinder"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/50">
                    <span className="font-mono">V1.0.0 • BETA</span>
                    <span className="flex items-center gap-2">
                        &copy; {new Date().getFullYear()} ARC FINDER
                    </span>
                </div>
            </div>
        </footer>
    );
}