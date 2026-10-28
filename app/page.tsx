"use client"
import Image from "next/image";
import UI from "../components/Inputs";
import Simulation from "@/components/Simulation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const config = {
  particlesPerMole: 80
}




export default function Home() {
  const [particleCount, setParticleCount] = useState(200);
  const [initialTemp, setInitialTemp] = useState(300);
  const [resetKey, setResetKey] = useState(0);
  const [volume, setVolume] = useState(0.1);
  const [heatingRate, setHeatingRate] = useState(0.1);
  const [finalTemperature, setFinalTemperature] = useState(450);
  const [internalEnergy, setInternalEnergy] = useState(0);

  function handleReset() {
    setResetKey(key => key + 1);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black w-screen h-screen">
      <CardTitle>Heating of an Ideal Gas Simulation</CardTitle>
      <CardDescription>by Ewan Fox</CardDescription>
      <div className="flex flex-row items-center justify-center">
        <main className="flex p-10 gap-4 content-center flex-row justify-center h-full w-full">
          <UI
            particleCount={particleCount}
            onParticleCountChange={setParticleCount}
            onReset={handleReset}
            config={config}
            initialTemperature={initialTemp}
            onInitialTemperatureChange={setInitialTemp}
            resetKey={resetKey}
            volume={volume}
            onVolumeChange={setVolume}
            onFinalTemperatureChange={setFinalTemperature}
            finalTemperature={finalTemperature}
            onHeatingRateChange={setHeatingRate}
            heatingRate={heatingRate}
            internalEnergy={internalEnergy}
          />
          <Simulation
            particleCount={particleCount}
            resetKey={resetKey}
            initialTemperature={initialTemp}
            config={config}
            heatingRate={heatingRate}
            finalTemperature={finalTemperature}
            reportInternalEnergy={setInternalEnergy}
            volume={volume}
          />
        </main>
      </div>
      <div className="flex flex-col">
        <Button variant="link" onClick={() => window.location.replace("https://github.com/EwanFox/PhysicsSimulation")}>Click here for source code.</Button>
        <CardDescription>This project makes use of matter.js for rendering & shadcn for user interface.</CardDescription>
      </div>
      <CardDescription>Note: This simulation is a 2D approximation of a 3D gas. Displayed values of Internal Energy & Pressure are multipled by 3/2.</CardDescription>
    </div>
  );
}
