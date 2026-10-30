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

const chartConfig = {
    pressure: {
        label: "Pressure",
        color: "var(--chart-1)"
    }
} satisfies ChartConfig

type ChartProps = {
    data: Log[]
}

export function Chart(props: ChartProps) {
    console.log(props.data)
    return <div className="w-full flex content-center align-center justify-center pr-24 pl-24 pb-4"><Card className="w-full">
        <CardHeader>
            <CardTitle>PV Graph</CardTitle>
            <CardDescription>Graphed from recorded table values.</CardDescription>
        </CardHeader>
        <CardContent>
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
                        dataKey="volume"
                        name="Volume"
                        domain={["auto", "auto"]}
                        label={{
                            value: "Volume (m³)",
                            position: "insideBottom",
                            offset: -15,
                        }}
                    />
                    <YAxis
                        type="number"
                        dataKey="pressure"
                        name="Pressure"
                        domain={["auto", "auto"]}
                        label={{
                            value: "Pressure (Pa)",
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