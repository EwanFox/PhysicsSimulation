import * as React from 'react';
import { Engine, Render, World, Bodies, Runner, Composite, Body, Vector, Resolver, Events, } from "matter-js";
var particleCategory = 0x0001;
const gasConstant = 8.314;
interface SimulationProps {
    particleCount: number,
    resetKey: number,
    initialTemperature: number,
    finalTemperature: number,
    config: { particlesPerMole: number },
    heatingRate: number,
    reportInternalEnergy: (energy: number) => void,
    volume: number
}

type Particle = {
    body: Body,
    x: number,
    y: number,
    vx: number,
    vy: number,
    radius: number,
    mass: number,
}

export default function Simulation(props: SimulationProps) {
    const canvas = React.useRef<HTMLDivElement>(null);
    const engine = React.useRef(Engine.create());
    const render = React.useRef<Render | null>(null);
    const animationRef = React.useRef<number | null>(null);
    const simWidth = React.useRef<number>(0);
    const finalEnergyRef = React.useRef(props.finalTemperature * (3 / 2) * (props.particleCount / props.config.particlesPerMole) * gasConstant)


    React.useEffect(() => { finalEnergyRef.current = props.finalTemperature * (3 / 2) * (props.particleCount / props.config.particlesPerMole) * gasConstant }, [props.finalTemperature])


    const initializeRenderer = () => {
        if (!canvas.current) return;
        simWidth.current = calculateWidth(props.volume);
        console.log("1");

        render.current = Render.create({
            element: canvas.current,
            engine: engine.current,
            options: {
                width: simWidth.current,
                height: simWidth.current,
                wireframes: false, //Enable for testing
                background: "#F6F2FF",
                showCollisions: false,
            }
        });

        // Disable Engine Physics - Don't need them

        engine.current.gravity.scale = 0;
        engine.current.gravity.x = 0;
        engine.current.gravity.y = 0;
        const atoms = spawnParticles(simWidth.current, simWidth.current, props.particleCount, props.initialTemperature);
        Composite.add(engine.current.world, atoms.map((p) => p.body));

        const initialEnergy = totalKineticEnergy(atoms);
        Render.run(render.current);
        let previousTime = performance.now();
        let accumulator = 0;
        const fixedDt = 1 / 120;
        let lastEnergyLog = 0;

        //Animation Loop

        const animate = (time: number) => {
            const elapsed = Math.min((time - previousTime) / 1000, 0.05);
            previousTime = time;
            accumulator += elapsed;

            while (accumulator >= fixedDt) {
                advanceGas(atoms, simWidth.current, simWidth.current, fixedDt);
                graduallyAdjustVelocity(atoms, finalEnergyRef.current, props.heatingRate, fixedDt)
                props.reportInternalEnergy(totalKineticEnergy(atoms));
                accumulator -= fixedDt;
            }

            for (const p of atoms) {
                Body.setPosition(p.body, { x: p.x, y: p.y });
            }

            if (time - lastEnergyLog >= 1000) {
                const energy = totalKineticEnergy(atoms);
                const absoluteError = energy - initialEnergy;
                const percentageError =
                    initialEnergy === 0
                        ? 0
                        : (absoluteError / initialEnergy) * 100;

                console.log(
                    `KE: ${energy.toFixed(6)} | ` +
                    `ΔE: ${absoluteError.toFixed(6)} | ` +
                    `Error: ${percentageError.toFixed(6)}%`
                );

                lastEnergyLog = time;
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
    }
    const clearRenderer = () => {
        if (!render.current) return;
        Render.stop(render.current);
        render.current.canvas.remove();
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        if (!engine.current) return;
        //Might need to change this later
        World.clear(engine.current.world, true);
        Engine.clear(engine.current);
    }

    //Reset Effects
    React.useEffect(() => {
        console.log("check")
        initializeRenderer();
        const newWidth = calculateWidth(props.volume);
        simWidth.current = newWidth;
        return () => {
            clearRenderer();
        }

    }, [props.resetKey]);


    return <div style={{ width: 1000 }} className='justify-center content-center flex flex-col items-center gap-1 outline-solid rounded-sm outline-1'>
        <div ref={canvas} className={`w-[${simWidth.current}px] h-[${simWidth.current}px] outline-solid`} style={{ width: simWidth.current, height: simWidth.current }}>
        </div>
        <div style={{ width: simWidth.current, height: 40 }} className='bg-slate-400 flex justify-center items-center text-center text-gray'>Heater</div>
    </div>
}

function scaleVelocities(particles: Particle[], targetEnergy: number): void {
    const currentEnergy = totalKineticEnergy(particles);

    if (currentEnergy === 0) {
        if (targetEnergy === 0) return;

        throw new Error("Cannot scale zero velocity")
    }

    const scale = Math.sqrt(targetEnergy / currentEnergy);

    for (const p of particles) {
        p.vx *= scale;
        p.vy *= scale;
    }
}

function graduallyAdjustVelocity(particles: Particle[], targetEnergy: number, rate: number, dt: number): void {
    console.log(targetEnergy)
    const currentEnergy = totalKineticEnergy(particles);
    if (currentEnergy <= 0 || targetEnergy < 0) return;

    const alpha = 1 - Math.exp(-rate * dt);

    const nextEnergy = currentEnergy + (targetEnergy - currentEnergy) * alpha;

    scaleVelocities(particles, nextEnergy);
}

function spawnParticles(width: number, height: number, particleCount: number, initialTemperature: number): Particle[] {
    const particles: Particle[] = [];
    const radius = 4;
    const margin = 10 + radius;
    const initialSpeed = 40 * (initialTemperature / 300);
    const diameter = radius * 2;

    const minX = margin + radius;
    const maxX = width - margin - radius;
    const minY = margin + radius;
    const maxY = height - margin - radius;

    const minDistance = radius * 2 + 1;
    const maxAttempts = 1000;

    for (let i = 0; i < particleCount; i++) {
        let x = 0;
        let y = 0;
        let placed = false;

        // Try random positions until one doesn't overlap another particle
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            x = minX + Math.random() * (maxX - minX);
            y = minY + Math.random() * (maxY - minY);

            const overlaps = particles.some(p => {
                const dx = p.x - x;
                const dy = p.y - y;

                return dx * dx + dy * dy < minDistance * minDistance;
            });

            if (!overlaps) {
                placed = true;
                break;
            }
        }

        if (!placed) {
            throw new Error(
                `Could not place particle ${i + 1} without overlap. ` +
                `Try reducing the particle count.`
            );
        }

        const body = Bodies.circle(x, y, radius, {
            render: { fillStyle: "blue" },
            slop: 0,
            restitution: 1,
            inertia: Infinity,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            density: 0.001,
            label: "particle",
        });

        const angle = Math.random() * 2 * Math.PI;

        particles.push({
            body,
            x,
            y,
            vx: initialSpeed * Math.cos(angle),
            vy: initialSpeed * Math.sin(angle),
            radius,
            mass: body.mass,
        });
    }

    return particles;
}
function moveParticles(particles: Particle[], dt: number) {
    for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
    }
}

function resolveParticleCollision(a: Particle, b: Particle) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 1e-8) return;

    const nx = dx / distance;
    const ny = dy / distance;

    const relativeNormalVelocity =
        (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;

    if (relativeNormalVelocity >= 0) return;

    const invMassA = 1 / a.mass;
    const invMassB = 1 / b.mass;

    const impulse = -2 * relativeNormalVelocity / (invMassA + invMassB);

    a.vx -= impulse * invMassA * nx;
    a.vy -= impulse * invMassA * ny;
    b.vx += impulse * invMassB * nx;
    b.vy += impulse * invMassB * ny;
}

function resolveWallCollision(
    p: Particle,
    side: "left" | "right" | "top" | "bottom",
    width: number,
    height: number
) {
    switch (side) {
        case "left":
            p.x = p.radius;
            p.vx = Math.abs(p.vx);
            break;

        case "right":
            p.x = width - p.radius;
            p.vx = -Math.abs(p.vx);
            break;
        case "top":
            p.y = p.radius;
            p.vy = Math.abs(p.vy);
            break;
        case "bottom":
            p.y = height - p.radius;
            p.vy = -Math.abs(p.vy);
            break;
    }
}

function totalKineticEnergy(particles: Particle[]): number {
    return particles.reduce((total, particle) => total + 0.5 * particle.mass * (particle.vx * particle.vx + particle.vy * particle.vy)
        , 0);
}

type Collision = | { type: "particle"; a: number; b: number } |
{
    type: "wall";
    i: number;
    side: "left" | "right" | "top" | "bottom";
};

function getCollision(
    collision: Collision | null
): Collision | null {
    return collision;
}


function advanceGas(
    particles: Particle[],
    width: number,
    height: number,
    dt: number
) {
    let remaining = dt;
    let events = 0;
    const EPS = 1e-8;
    const MAX_EVENTS = 10000;

    while (remaining > EPS && events < MAX_EVENTS) {
        let earliest = Infinity;
        let collision: Collision | null = null;

        const consider = (t: number, c: Collision) => {
            if (t >= -EPS && t < earliest && t <= remaining + EPS) {
                earliest = Math.max(0, t);
                collision = c;
            }
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dvx = b.vx - a.vx;
                const dvy = b.vy - a.vy;
                const R = a.radius + b.radius;

                const qa = dvx * dvx + dvy * dvy;
                if (qa < EPS) continue;

                const qb = dx * dvx + dy * dvy;
                const qc = dx * dx + dy * dy - R * R;

                if (qc <= EPS) {
                    if (qb < -EPS) {
                        consider(0, { type: "particle", a: i, b: j });
                    }
                    continue;
                }

                if (qb >= 0) continue;

                const discriminant = qb * qb - qa * qc;
                if (discriminant < 0) continue;

                const t = (-qb - Math.sqrt(discriminant)) / qa;

                if (t >= -EPS) {
                    consider(t, { type: "particle", a: i, b: j });
                }
            }
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (p.vx < -EPS) {
                consider((p.radius - p.x) / p.vx, { type: "wall", i, side: "left" })
            }

            if (p.vx > EPS) {
                consider((width - p.radius - p.x) / p.vx, {
                    type: "wall", i, side: "right"
                })
            }

            if (p.vy < -EPS) {
                consider((p.radius - p.y) / p.vy, {
                    type: "wall", i, side: "top"
                })
            }
            if (p.vy > EPS) {
                consider((height - p.radius - p.y) / p.vy, {
                    type: "wall", i, side: "bottom"
                })
            }
        }

        const currentCollision = getCollision(collision);

        if (currentCollision === null) {
            moveParticles(particles, remaining);
            remaining = 0;
            break;
        }

        moveParticles(particles, earliest);
        remaining -= earliest;

        if (currentCollision.type === "particle") {
            resolveParticleCollision(
                particles[currentCollision.a],
                particles[currentCollision.b]
            );
        } else {
            resolveWallCollision(
                particles[currentCollision.i],
                currentCollision.side,
                width,
                height
            );
        }

        events++;

        events++;
    }
}

function calculateWidth(volume: number) {

    const baseArea = 400 ** 2;
    const scale = (volume / 0.1);
    const newArea = scale * baseArea
    return Math.floor(Math.sqrt(newArea));
}
