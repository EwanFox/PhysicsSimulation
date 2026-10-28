"use client"
import Image from "next/image";
import UI from "../components/Inputs";
import Simulation from "@/components/Simulation";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const config = {
  particlesPerMole: 100
}




export default function Home() {
  const [particleCount, setParticleCount] = useState(200);
  const [initialTemp, setInitialTemp] = useState(300);
  const [resetKey, setResetKey] = useState(0);
  const [volume, setVolume] = useState(0.1);
  const [heatingRate, setHeatingRate] = useState(1);
  const [finalTemperature, setFinalTemperature] = useState(450);
  const [internalEnergy, setInternalEnergy] = useState(0);

  function handleReset() {
    setResetKey(key => key + 1);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black w-screen h-screen">


          <CardTitle>Heating of an Ideal Gas Simulation</CardTitle>

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
      <div className="flex flex-row">
        <Button variant="link" onClick={() => window.location.replace("https://github.com/EwanFox/PhysicsSimulation")}>Click here for source code.</Button>
      </div>
    </div>
  );
}
