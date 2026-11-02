"use client"
import Image from "next/image";
import UI from "../components/Inputs";
import Simulation from "@/components/Simulation";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Explanation from "@/components/Explanation";
import TableManager from "@/components/TableManager";
import { Log } from "@/components/table-columns";
import { Chart } from "@/components/Chart";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LimitationsAssumptions from "@/components/LimitationsAssumptions";
const gasConstant = 8.314;
const config = {
  particlesPerMole: 80
}




export default function Home() {
  const [particleCount, setParticleCount] = useState(200);
  const [initialTemp, setInitialTemp] = useState(300);
  const [resetKey, setResetKey] = useState(0);
  const [volume, setVolume] = useState(0.1);
  const [heatingRate, setHeatingRate] = useState(1);
  const [finalTemperature, setFinalTemperature] = useState(450);
  const [internalEnergy, setInternalEnergy] = useState(0);
  const [tableData, setTableData] = useState<Log[]>([]);
  const [paused, togglePause] = useState(true);
  

  function handleReset() {
    setResetKey(key => key + 1);
  }

  function recordValues() {
    let new_entry: Log = {
      internalEnergy: Math.floor(((3 / 2) * internalEnergy)),
      volume: volume,
      temperature: Math.round((internalEnergy / (gasConstant * (particleCount / config.particlesPerMole))) * 100) / 100,
      pressure: Math.ceil((2 / 3) * ((internalEnergy * (3 / 2)) / ((volume)))),
      moles: particleCount / config.particlesPerMole
    }
    setTableData(prev => [...prev, new_entry]);
  }

  function resetTable() {
    setTableData([]);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black w-screen h-screen p-2">
      <div className="flex flex-col flex-1 items-center justify-center flex-row w-full">
        <div className="mr-auto p-4 invisible">
          <Dialog>
            <DialogTrigger>Tutorial</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Usage Guide</DialogTitle>
              </DialogHeader>

            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col flex-1 items-center justify-center">
          <CardTitle>Heating of an Ideal Gas Simulation</CardTitle>
          <CardDescription>by Ewan Fox</CardDescription>
        </div>
        <div className="ml-auto p-4">
          <Dialog>
            <DialogTrigger>Tutorial</DialogTrigger>
            <DialogContent className={"sm:max-w-[600px]"}>
              <DialogHeader>
                <DialogTitle>Usage Guide</DialogTitle>
              </DialogHeader>
              <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 w-[1/2]">
                <p className="mb-4 leading-normal">
                  <b>Simulation</b>
                </p>
                <p className="mb-4 leading-normal">
                  This is an interactive simulation of the isovolumetric heating of an ideal gas. <br />
                  The simulation features both a reset button and a play / pause button. <br />
                  Press the reset button to start a new simulation after changing the initial parameters. < br />
                  The live parameters can be changed while the simulation is running or paused without resetting it. <br /> < br />
                  There are three initial parameters: <br />
                  1) Initial Temperature - The temperatureat which the gas begins in Kelvin. <br />
                  2) Volume - The volume of the rigid tank in m^3. <br />
                  3) Moles of Gas - The amount of gas particles in the tank in moles. <br /> <br />
                  Additionally, there are two live parameters. <br />
                  1) Final Temperature - The temperature to which the gas is heated in Kelvin. <br />
                  2) Heater Power - The rate at which the heater outputs heat energy in Watts (Joules / Simulated Second). <br />
                </p>
                <p className="mb-4 leading-normal">
                  <b>Data Table</b>
                </p>
                <p className="mb-4 leading-normal">
                  This is a data table in which the live values of the simulation can be recorded for inspection and analysis. <br />
                  Press the Record Values button to add the current state of the simulation to the table. <br />
                  Press the Clear Table button to remove all records from the table. <br />
                </p>
                <p className="mb-4 leading-normal">
                  <b>Data Graph</b>
                </p>
                <p className="mb-4 leading-normal">
                  This is a customizable graph graphed based on the data recorded in the table. <br />
                  As you add rows to the table, they will automatically be added to the graph. <br />
                  You can select the variables for both the X-Axis and the Y-Axis.<br /> 
                  The choices are as follows: <br /> <br />
                  1) Volume of the Tank. <br />
                  2) Temperature of the Gas. <br />
                  3) Pressure due to the Gas. <br />
                  4) Moles of Gas in the Tank. <br />
                  5) Internal Energy of the Gas. <br />
                </p>
                                <p className="mb-4 leading-normal">
                  <b>Assumptions, Limitation, & Explanation</b>
                </p>
                <p className="mb-4 leading-normal">
                  The assumptions, limitations, and explanation behind this simulation can be found in the accompanying document provided.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center">
        <main className="flex p-10 pt-4 gap-4 content-center flex-row justify-center h-full w-full">
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
            isPaused={paused}
            onPausedChange={togglePause}
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
            isPaused={paused}
          />
        </main>
      </div>
      <TableManager data={tableData} resetTableHandler={resetTable} recordValueHandler={recordValues}></TableManager>
      <Chart data={tableData} />
      <div className="flex flex-col">
        <Button variant="link" onClick={() => window.location.replace("https://github.com/EwanFox/PhysicsSimulation")}>Click here for source code.</Button>
        <CardDescription>This project makes use of matter.js for rendering & shadcn for user interface.</CardDescription>
      </div>
      <CardDescription >Note: This simulation is a 2D approximation of a 3D gas.</CardDescription>
    </div>
  );
}
