import { ConfigurationCard } from "@/components/elements/configuration-card";
import PreviewCard from "@/components/elements/preview-card";
import { useState } from "react";
import { Separator } from "./components/ui/separator";
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
        endY: 36
    })

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col items-center flex-none lg:p-8 md:p-4 p-2">
                <h1 className="text-2xl font-bold">Bezier Curve</h1>
                <p className="text-sm text-gray-500 font-light">by <span className="font-bold">@a2coder</span></p>
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