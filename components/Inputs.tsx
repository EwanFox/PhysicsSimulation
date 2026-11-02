"use client"

import * as React from "react"
import { Slider } from "./ui/slider";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useEffect } from "react";
import { calculateWidth } from "./Simulation";
const gasConstant = 8.314;

interface UIProps {
    config: { particlesPerMole: number },
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
    internalEnergy: number,
    onPausedChange: (paused: boolean) => void,
    isPaused: boolean

}

type NextSimData = {
    volume: number,
    particleCount: number,
    initialTemperature: number
}
export default function UI(props: UIProps) {
    const [canRunSimulation, setCanRunSimulation] = React.useState(true);
    const [nextSimulationData, setNextSimulationData] = React.useState<NextSimData>({ volume: props.volume, particleCount: props.particleCount, initialTemperature: props.initialTemperature })

    const pressure = Math.round(
        props.internalEnergy / props.volume
    );

    React.useEffect(() => {
        setNextSimulationData({
            volume: props.volume,
            particleCount: props.particleCount,
            initialTemperature: props.initialTemperature
        });
    }, [props.resetKey]);

    React.useEffect(() => {
        const max = getMaxParticleCount(nextSimulationData.volume);
        if (nextSimulationData.particleCount > max) {
            setCanRunSimulation(false);
        } else {
            setCanRunSimulation(true);
        }
    }, [nextSimulationData.volume, nextSimulationData.particleCount])

    return <div className="flex justify-center w-[350px] content-center m-auto">
        <Card className="w-full justify-center flex h-fit">
            <CardContent className="gap-4 flex flex-col">
                <CardTitle className="">Initial Parameters</CardTitle>
                <div className="flex gap-2 flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="sim-min-temp">Initial Temperature</Label>
                        <span className="text-sm text-muted-foreground">
                            {nextSimulationData.initialTemperature.toFixed(1) + " Kelvin"}
                        </span>

                    </div>
                    <Slider
                        id="sim-min-temp"
                        value={[nextSimulationData.initialTemperature]}
                        onValueChange={(value) => {
                            setNextSimulationData(prev => ({
                                ...prev,
                                initialTemperature: (value as number[])[0]
                            }))
                        }}
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
                            {nextSimulationData.volume.toFixed(3) + "m³"}
                        </span>

                    </div>
                    <Slider
                        id="sim-vol"
                        value={[nextSimulationData.volume]}
                        onValueChange={(value) => {
                            setNextSimulationData(prev => ({
                                ...prev,
                                volume: (value as number[])[0]
                            }))
                        }}
                        min={0.01}
                        max={0.250}
                        step={0.001}
                        className={""}
                    />
                </div>
                <div className="flex gap-2 flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="sim-amount">Moles of Gas</Label>
                        <span className="text-sm text-muted-foreground">
                            {(nextSimulationData.particleCount / props.config.particlesPerMole).toFixed(4) + " moles"}
                        </span>

                    </div>
                    <Slider
                        id="sim-amount"
                        value={[nextSimulationData.particleCount / props.config.particlesPerMole]}
                        onValueChange={(value) => {
                            const count = Math.round((value as number[][0] * props.config.particlesPerMole));

                            setNextSimulationData(prev => ({
                                ...prev,
                                particleCount: count
                            }))
                        }}
                        min={0.1}
                        max={5}
                        step={1 / props.config.particlesPerMole}
                        className={""}
                    />

                </div>
                <Separator />
                <CardTitle className="">Live Parameters</CardTitle>
                <div className="flex gap-2 flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="sim-final-temp">Final Temperature</Label>
                        <span className="text-sm text-muted-foreground">
                            {props.finalTemperature.toFixed(1) + " Kelvin"}
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
                        <Label htmlFor="sim-heating-rate">Heating Rate (W)</Label>
                        <span className="text-sm text-muted-foreground">
                            {"Heater Power:" + props.heatingRate.toFixed(0) + " W"}
                        </span>

                    </div>
                    <Slider
                        id="sim-heating-rate"
                        value={[props.heatingRate]}
                        onValueChange={(value) => props.onHeatingRateChange((value as number[])[0])}
                        min={1}
                        max={1000}
                        step={1}
                        className={""}
                    />

                </div>
                <Button onClick={() => {
                    props.onInitialTemperatureChange(nextSimulationData.initialTemperature)
                    props.onVolumeChange(nextSimulationData.volume)
                    props.onParticleCountChange(nextSimulationData.particleCount)
                    props.onReset()
                }} disabled={!canRunSimulation}>Reset Simulation</Button>
                {props.isPaused ? <Button onClick={() => props.onPausedChange(false)}>Play Simulation</Button> : <Button onClick={() => props.onPausedChange(true)}>Pause Simulation</Button>}
                <Separator />
                <p>Internal Energy: {Math.round(props.internalEnergy * (3 / 2)).toString()} Joules</p>
                <p>Pressure: {pressure.toString()} Pascals</p>
                <p>Current Temperature: {Math.round((props.internalEnergy / (gasConstant * (props.particleCount / props.config.particlesPerMole))) * 100) / 100} Kelvin</p>
            </CardContent>

        </Card>

    </div>
} 

function getMaxParticleCount(volume: number): number {
    const width = calculateWidth(volume);
    const margin = 22;
    const minDistance = 9;
    const availableW = width - margin * 2;
    const availableA = availableW ** 2;
    const packingDensity = 0.35;
    const exclusionR = minDistance / 2;
    const particleA = Math.PI * exclusionR ** 2;
    return Math.floor(
        packingDensity * availableA / particleA
    )
}