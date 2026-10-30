import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import '../app/katex.min.css'
import Latex from "react-latex-next";
interface ExplanationProps {
    internalEnergy: number,
    particleCount: number,
    config: {
        particlesPerMole: number
    }
}
const particleMass = 0.10579758;
export default function Explanation(props: ExplanationProps) {
    return <div className="w-full flex content-center align-center justify-center pr-24 pl-24 pb-4">
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Modelling Explanation</CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed">
                The simulation of an ideal gas above runs a 2D simulation of an ideal gas, and then uses mathematics to extrapolate the results to a 3D gas. <br /><br/>
                The particles per mole, or ppm, is set to 80, meaning that one mole of gas is represented by 80 particles. This value was chosen to prevent high computational requirements. <br /><br />

                There are currently 
                <Latex>{String.raw`\$${(props.particleCount / props.config.particlesPerMole).toString()} \,\text{moles}$`}</Latex>
                of gas, so there is a total of 
                <Latex>{String.raw`$N=80(${(props.particleCount / props.config.particlesPerMole).toString()})=${props.particleCount.toString()} \, \text{particles}$`}</Latex>.
                <br />

                From the simulation, the average kinetic energy per particle is currently <Latex>{String.raw`$\bar{K}=${Math.floor(props.internalEnergy / (props.particleCount)).toString()}\text{J}`}$</Latex>.
                <br />
                <br />
                We can find the internal energy of the 2D gas, <Latex>{String.raw`$U_{\text{2D}}=K_{total} = N\bar{K} = ${props.particleCount.toString()}(${Math.floor(props.internalEnergy / (props.particleCount)).toString()}) = ${(props.particleCount * Math.floor(props.internalEnergy / (props.particleCount))).toString()}\text{J}$`}</Latex>.
                <br />
                To find the equivalent for a 3D gas, we can multiply by 
                <Latex>{String.raw`$\frac{3}{2}$`}</Latex> as follows: <Latex>{String.raw`$N_{\text{3D}}=\frac{3}{2}U_{\text{2D}}=\frac{3}{2}(${(props.particleCount * Math.floor(props.internalEnergy / (props.particleCount))).toString()})=${Math.floor((3/2)*props.internalEnergy).toString()}\text{J}$`}</Latex> <br /><br />

                We can find the pressure in a similar fashion. <br />
                <Latex>{String.raw`$P_{\text{3D}}=\frac{3}{2}P_{\text{2D}}=\frac{3U_{\text{2D}}}{2V}$`}</Latex>



            </CardContent>
        </Card>
    </div>
}