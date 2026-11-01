"use client"

import { CartesianGrid, Line, LineChart, Scatter, ScatterChart, TooltipProps, XAxis, YAxis, ZAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Log } from "./table-columns";
import { NativeSelect, NativeSelectOption } from "./ui/native-select";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Field, FieldLabel } from "./ui/field";
import { useState } from "react";

const chartConfig = {
    pressure: {
        label: "Pressure",
        color: "var(--chart-1)"
    },
    volume: {
        label: "Volume",
        color: "var(--chart-1)"
    },
    temperature: {
        label: "Temperature",
        color: "var(--chart-1)"
    },
    moles: {
        label: "Moles of Gas",
        color: "var(--chart-1)"
    },
    internalEnergy: {
        label: "Internal Energy",
        color: "var(--chart-1)"
    }
} satisfies ChartConfig

type ChartProps = {
    data: Log[]
}

const axisOptions = [
    { label: "Pressure (pa)", value: "pressure" },
    { label: "Volume (m^3)", value: "volume" },
    { label: "Temperature (K)", value: "temperature" },
    { label: "Internal Energy (J)", value: "internalEnergy" },
    { label: "Moles of Gas (m)", value: "moles" }
]


export function Chart(props: ChartProps) {
    console.log(props.data)
    const [xAxis, setXAxis] = useState("temperature");
    const [yAxis, setYAxis] = useState('pressure');
    return <div className="w-full flex content-center align-center justify-center pr-24 pl-24 pb-4"><Card className="w-full">
        <CardHeader>
            <CardTitle>Data Graph</CardTitle>
            <CardDescription>Graphed from recorded table values.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-row">
                <Field>
                    <FieldLabel>X-Axis</FieldLabel>
                    <Select items={axisOptions} value={xAxis} onValueChange={(value) => {
                        if (value) {
                            setXAxis(value)
                        }
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {axisOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <Field>
                    <FieldLabel>Y-Axis</FieldLabel>
                    <Select items={axisOptions} value={yAxis} onValueChange={(value) => {
                        if (value) {
                            setYAxis(value)
                        }
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {axisOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </div>
            <ChartContainer config={chartConfig}>
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 30,
                        left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey={xAxis}
                        name={axisOptions.find(x => x.value === xAxis)?.label}
                        domain={["auto", "auto"]}
                        label={{
                            value: axisOptions.find(x => x.value === xAxis)?.label,
                            position: "insideBottom",
                            offset: -15,
                        }}
                    />
                    <YAxis
                        type="number"
                        dataKey={yAxis}
                        name={axisOptions.find(x => x.value === yAxis)?.label}
                        domain={["auto", "auto"]}
                        label={{
                            value: axisOptions.find(x => x.value === yAxis)?.label,
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <ChartTooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={<CustomTooltip />}
                    />
                    <Scatter
                        name="Recorded States"
                        data={props.data}
                        fill="var(--color-pressure)"
                        shape="circle"
                        line={{ stroke: "var(--color-pressure)", strokeWidth: 2 }}
                    />
                </ScatterChart>
            </ChartContainer>
        </CardContent>
    </Card></div>
}


type CustomTooltipProps = {
    active?: boolean;
    payload?: {
        payload: Log;
    }[];
};

function CustomTooltip({
    active,
    payload,
}: CustomTooltipProps) {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
            <p className="mb-2 font-semibold">
                Thermodynamic State
            </p>
            <div className="space-y-1 text-sm">
                <p>Volume: {point.volume.toFixed(4)} m³</p>
                <p>Pressure: {point.pressure.toFixed(2)} Pa</p>
                <p>Temperature: {point.temperature.toFixed(2)} K</p>
                <p>Moles: {point.moles.toFixed(4)} mol</p>
                <p>Internal Energy: {point.internalEnergy.toFixed(2)} J</p>
            </div>
        </div>
    );
}