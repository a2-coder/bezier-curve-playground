import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/lib/hooks";
import type { Configuration, Point, Size } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IconCopy, IconCopyCheckFilled } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GRID_GAP = 8;
const OFFSET = 16;

type Props = {
    configuration: Configuration;
}

export function PreviewCard({ configuration }: Props) {
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
    )
}

export default PreviewCard;