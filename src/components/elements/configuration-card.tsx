import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import type { Configuration, ConfigurationAction } from "@/lib/types";
import { useReducer } from "react";

type Props = {
    value: Configuration;
    onChange: (configuration: Configuration) => void;
}

export function ConfigurationCard({ value, onChange }: Props) {
    const [configuration, dispatch] = useReducer(<K extends keyof Configuration>(state: Configuration, action: ConfigurationAction<K>) => {
        const newState = {
            ...state,
            [action.key]: action.value
        }
        onChange(newState);
        return newState;
    }, value);
    const setConfig = <K extends keyof Configuration>(key: K, value: Configuration[K]) => {
        dispatch({ key, value });
    }

    return (
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
                <FieldSeparator className="my-4" />
                <Field>
                    <div className="flex items-center justify-between">
                        <FieldLabel>Curve Parameter (t)</FieldLabel>
                        <div className="text-muted-foreground text-sm">{configuration.t}</div>
                    </div>
                    <Slider min={0} max={1} step={0.01} value={configuration.t} onValueChange={(value) => setConfig("t", value as number)} />
                </Field>
            </CardContent>
        </Card>
    )
}

export default ConfigurationCard;