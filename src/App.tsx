import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Field, FieldLabel } from "./components/ui/field";
import { Slider } from "./components/ui/slider";
import { Separator } from "./components/ui/separator";
import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { IconClipboardCheck, IconCopy, IconCopyCheckFilled } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/ui/tooltip";
import { useCopyToClipboard } from "./lib/hooks";

interface Configuration {
    size: number;
    startX: number;
    startY: number;
    p1x: number;
    p1y: number;
    p2x: number;
    p2y: number;
    endX: number;
    endY: number;
}
type ConfigurationAction<K extends keyof Configuration = keyof Configuration> = {
    key: K;
    value: Configuration[K];
}

type Point = {
    x: number;
    y: number;
}

type Size = {
    w: number;
    h: number;
}

const GRID_GAP = 8;
const OFFSET = 16;

export function App() {

    const [configuration, dispatch] = useReducer(<K extends keyof Configuration>(state: Configuration, action: ConfigurationAction<K>) => {
        return {
            ...state,
            [action.key]: action.value
        }
    }, {
        size: 40,
        startX: 4,
        startY: 4,
        p1x: 20,
        p1y: 4,
        p2x: 20,
        p2y: 36,
        endX: 36,
        endY: 36
    });
    const setConfig = <K extends keyof Configuration>(key: K, value: Configuration[K]) => {
        dispatch({ key, value });
    }

    const svgRef = useRef<SVGSVGElement>(null);
    const [scale, setScale] = useState(0);
    const [size, setSize] = useState<Size>({ w: 100, h: 100 })
    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect;
                // calculate scale based on width of the element and the size of the grid
                const scale = (width - OFFSET * 2) / configuration.size;
                setSize({ w: width, h: width });
                setScale(scale);
            }
        });
        resizeObserver.observe(svgRef.current!);
        return () => {
            resizeObserver.disconnect();
        }
    }, [configuration.size]);

    const transform = useCallback((point: Point) => {
        return {
            x: point.x * scale + OFFSET,
            y: point.y * scale + OFFSET
        }
    }, [scale]);

    const grid = useMemo(() => {
        const lines: [Point, Point][] = [];
        for (let i = 0; i <= configuration.size; i += GRID_GAP) {
            lines.push([transform({ x: 0, y: i }), transform({ x: configuration.size, y: i })]);
            lines.push([transform({ x: i, y: 0 }), transform({ x: i, y: configuration.size })]);
        }
        return lines;
    }, [configuration.size, transform]);

    const curve = useMemo(() => {
        const points: [Point, Point, Point, Point] = [
            transform({ x: configuration.startX, y: configuration.startY }),
            transform({ x: configuration.p1x, y: configuration.p1y }),
            transform({ x: configuration.p2x, y: configuration.p2y }),
            transform({ x: configuration.endX, y: configuration.endY })
        ]
        return points;
    }, [configuration, transform]);

    const d = useMemo(() => {
        const [p0, p1, p2, p3] = curve;
        return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
    }, [curve]);

    const code = useMemo(() => {
        // the svg code for the curve
        const { startX, startY, endX, endY, p1x, p1y, p2x, p2y, size } = configuration;
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <path d="M ${startX} ${startY} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${endX} ${endY}" fill="none" stroke="black" stroke-width="2" />
        </svg>
        `.trim();
    }, [configuration]);

    const { copy, copied } = useCopyToClipboard();

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col items-center flex-none lg:p-8 md:p-4 p-2">
                <h1 className="text-2xl font-bold">Bezier Curve</h1>
                <p className="text-sm text-gray-500 font-light">by <span className="font-bold">@a2coder</span></p>
            </div>
            <Separator className="flex-none" />
            <div className="container flex flex-col lg:p-8 md:p-4 p-2 flex-1 lg:gap-8 md:gap-4 gap-2 max-w-4xl">
                <div className="flex justify-center lg:gap-8 md:gap-4 gap-2">
                    <Card className="flex-1 gap-4">
                        <CardHeader className="border-b">
                            <CardTitle>Configuration</CardTitle>
                            <CardDescription>Adjust the properties of the curve in real-time</CardDescription>
                        </CardHeader>
                        <CardContent className="lg:space-y-8 space-y-4 pb-4">
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel>Size</FieldLabel>
                                    <div className="text-muted-foreground text-sm">{configuration.size}</div>
                                </div>
                                <Slider min={40} max={200} step={8} value={configuration.size} onValueChange={(value) => setConfig("size", value as number)} />
                            </Field>
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel>Start Point (x, y)</FieldLabel>
                                    <div className="text-muted-foreground text-sm">{configuration.startX}, {configuration.startY}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Slider min={0} max={configuration.size} step={1} value={configuration.startX} onValueChange={(value) => setConfig("startX", value as number)} />
                                    <Slider min={0} max={configuration.size} step={1} value={configuration.startY} onValueChange={(value) => setConfig("startY", value as number)} />
                                </div>
                            </Field>
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel>Control Point 1 (x, y)</FieldLabel>
                                    <div className="text-muted-foreground text-sm">{configuration.p1x}, {configuration.p1y}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Slider min={0} max={configuration.size} step={1} value={configuration.p1x} onValueChange={(value) => setConfig("p1x", value as number)} />
                                    <Slider min={0} max={configuration.size} step={1} value={configuration.p1y} onValueChange={(value) => setConfig("p1y", value as number)} />
                                </div>
                            </Field>
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel>Control Point 2 (x, y)</FieldLabel>
                                    <div className="text-muted-foreground text-sm">{configuration.p2x}, {configuration.p2y}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Slider min={0} max={configuration.size} step={1} value={configuration.p2x} onValueChange={(value) => setConfig("p2x", value as number)} />
                                    <Slider min={0} max={configuration.size} step={1} value={configuration.p2y} onValueChange={(value) => setConfig("p2y", value as number)} />
                                </div>
                            </Field>
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel>End Point (x, y)</FieldLabel>
                                    <div className="text-muted-foreground text-sm">{configuration.endX}, {configuration.endY}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Slider min={0} max={configuration.size} step={1} value={configuration.endX} onValueChange={(value) => setConfig("endX", value as number)} />
                                    <Slider min={0} max={configuration.size} step={1} value={configuration.endY} onValueChange={(value) => setConfig("endY", value as number)} />
                                </div>
                            </Field>
                        </CardContent>
                    </Card>
                    <Card className="flex-1 pb-0 gap-4">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Preview</CardTitle>
                                    <CardDescription>Preview the bezier curve</CardDescription>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button disabled={copied} onClick={() => copy(code)} variant="outline" size="icon-sm">
                                            {
                                                copied ? (
                                                    <IconCopyCheckFilled className="text-emerald-500" />
                                                ) : (
                                                    <IconCopy />
                                                )
                                            }
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {copied ? "Copied!" : "Copy SVG Code"}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="w-full aspect-square">
                                <svg ref={svgRef} viewBox={`0 0 ${size.w} ${size.h}`}>
                                    {/* grids */}
                                    {
                                        grid.map(([s, e], idx) => (
                                            <line key={`grid__${idx}`} x1={s.x} y1={s.y} x2={e.x} y2={e.y} className="stroke-border/50" />
                                        ))
                                    }
                                    {/* curve */}
                                    <path className="stroke-[8px] stroke-amber-500/50" fill="none" d={d} />
                                    {/* lines connecting control points */}
                                    <line x1={curve[0].x} y1={curve[0].y} x2={curve[1].x} y2={curve[1].y} className="stroke-gray-400 stroke-2" strokeDasharray="4 4" />
                                    <line x1={curve[3].x} y1={curve[3].y} x2={curve[2].x} y2={curve[2].y} className="stroke-gray-400 stroke-2" strokeDasharray="4 4" />
                                    {/* control points */}
                                    {
                                        curve.map((point, idx) => (
                                            <circle key={`control__${idx}`} cx={point.x} cy={point.y} r={6} className={cn(
                                                "fill-background stroke-4",
                                                {
                                                    "stroke-foreground": idx === 0 || idx === 3,
                                                    "stroke-gray-400": idx === 1 || idx === 2,
                                                }
                                            )} />
                                        ))
                                    }

                                </svg>
                            </div>
                        </CardContent>

                    </Card>
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