import { ConfigurationCard } from "@/components/elements/configuration-card";
import PreviewCard from "@/components/elements/preview-card";
import { IconBrandGithub, IconEaseInOutControlPointsFilled } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/ui/tooltip";
import type { Configuration } from "./lib/types";

export function App() {

    const [configuration, setConfiguration] = useState<Configuration>({
        size: 40,
        startX: 4,
        startY: 4,
        p1x: 20,
        p1y: 4,
        p2x: 20,
        p2y: 36,
        endX: 36,
        endY: 36,
        t: 0.5
    })

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="container flex items-center justify-between flex-none lg:p-4 md:p-2 p-2">
                <div className="flex items-center gap-4">
                    <div className="text-primary flex items-center justify-center size-10 border-2 border-primary">
                        <IconEaseInOutControlPointsFilled className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Bezier Curve</h1>
                        <p className="text-xs text-gray-500 font-light">by <span className="font-bold">@a2coder</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <a href="https://github.com/a2-coder/bezier-curve-playground" target="_blank" rel="noopener noreferrer">
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="outline" size="icon">
                                    <IconBrandGithub />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Open project on GitHub
                            </TooltipContent>
                        </Tooltip>
                    </a>
                </div>
            </div>
            <Separator className="flex-none" />
            <div className="container flex flex-col lg:p-8 md:p-4 p-2 flex-1 lg:gap-8 md:gap-4 gap-2 max-w-4xl">
                <div className="flex justify-center lg:gap-8 md:gap-4 gap-2">
                    <ConfigurationCard value={configuration} onChange={setConfiguration} />
                    <PreviewCard configuration={configuration} />
                </div>
            </div>
            <Separator className="flex-none" />
            <div className="flex items-center justify-center text-xs text-muted-foreground p-2">
                Copyright &copy; {new Date().getFullYear()} Arjun Palakkazhi. All rights reserved.
            </div>
        </div>
    )
}

export default App;