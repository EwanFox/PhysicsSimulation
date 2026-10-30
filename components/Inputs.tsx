"use client"

import * as React from "react"
import { Slider } from "./ui/slider";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useEffect } from "react";
const gasConstant = 8.314;

interface UIProps {
    config: {particlesPerMole: number},
    onParticleCountChange: (count: number) => void,
    particleCount: number,
    initialTemperature: number,
    onInitialTemperatureChange: (temperature: number) => void,
    onReset: () => void,
    resetKey: number,
    volume: number,
    onVolumeChange: (volume: number) => void,
    finalTemperature: number,
    onFinalTemperatureChange: (temperature: number) => void,
    heatingRate: number,
    onHeatingRateChange: (rate: number) => void,
    internalEnergy: number

}

type CurrentData = {
    volume: number,
    particleCount: number
}

export default function UI(props: UIProps) {

    const [pressure, setPressure] = React.useState(0);
    const currentData = React.useRef<CurrentData>({particleCount: props.particleCount, volume: props.volume});

    useEffect(() => {
        currentData.current = {
            volume: props.volume,
            particleCount: props.particleCount
        }
    }, [props.resetKey])

    useEffect(() => {
        setPressure(Math.ceil((2/3) * ((props.internalEnergy * (3/2)) / ((currentData.current.volume)))))
    }, [props.resetKey, props.internalEnergy])
    return <div className="flex justify-center w-[350px] content-center m-auto">
        <Card className="w-full justify-center flex h-fit">
            <CardContent className="gap-4 flex flex-col">
                <CardTitle className="">Initial Parameters</CardTitle>
                <div className="flex gap-2 flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="sim-min-temp">Initial Temperature</Label>
                        <span className="text-sm text-muted-foreground">
                            {props.initialTemperature + " Kelvin"}
                        </span>

                    </div>
                    <Slider
                        id="sim-min-temp"
                        value={[props.initialTemperature]}
                        onValueChange={(value) => props.onInitialTemperatureChange((value as number[])[0])}
                        min={50}
                        max={999}
                        step={0.5}
                        className={""}
                    />
                </div>
                <div className="flex gap-2 flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="sim-vol">Volume</Label>
                        <span className="text-sm text-muted-foreground">
                            {props.volume + "m^3"}
                        </span>

                    </div>
                    <Slider
                        id="sim-vol"
                        value={[props.volume]}
                        onValueChange={(value) => props.onVolumeChange((value as number[])[0])}
                        min={0.05}
                        max={0.250}
                        step={0.001}
                        className={""}
                    />
                </div>
                <div className="flex gap-2 flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="sim-amount">Moles of Gas</Label>
                        <span className="text-sm text-muted-foreground">
                            {(props.particleCount / props.config.particlesPerMole) + " moles"}
                        </span>

                    </div>
                    <Slider
                        id="sim-amount"
                        value={[props.particleCount / props.config.particlesPerMole]}
                        onValueChange={(value) => props.onParticleCountChange((value as number[])[0] * props.config.particlesPerMole)}
                        min={0.1}
                        max={5}
                        step={0.01}
                        className={""}
                    />

                </div>
                <Separator />
                <CardTitle className="">Live Parameters</CardTitle>
                <div className="flex gap-2 flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="sim-final-temp">Final Temperature</Label>
                        <span className="text-sm text-muted-foreground">
                            {props.finalTemperature + " Kelvin"}
                        </span>

                    </div>
                    <Slider
                        id="sim-final-temp"
                        value={[props.finalTemperature]}
                        onValueChange={(value) => props.onFinalTemperatureChange((value as number[])[0])}
                        min={50}
                        max={999}
                        step={0.5}
                        className={""}
                    />

                </div>
                <div className="flex gap-2 flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="sim-heating-rate">Heating Rate</Label>
                        <span className="text-sm text-muted-foreground">
                            {"x" + props.heatingRate}
                        </span>

                    </div>
                    <Slider
                        id="sim-heating-rate"
                        value={[props.heatingRate]}
                        onValueChange={(value) => props.onHeatingRateChange((value as number[])[0])}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className={""}
                    />

                </div>
                <Button onClick={props.onReset}>Reset Simulation</Button>
                <Separator />
                <p>Internal Energy: {Math.ceil(props.internalEnergy * (3/2)).toString()} Joules</p>
                <p>Pressure: {pressure.toString()} Pascals</p>
                <p>Current Temperature: {Math.round((props.internalEnergy/(gasConstant * (currentData.current.particleCount / props.config.particlesPerMole)))* 100) / 100} Kelvin</p>
            </CardContent>

        </Card>

    </div>
}