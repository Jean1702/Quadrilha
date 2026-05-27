'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Pizza, RefreshCw } from 'lucide-react';

const PURPLE = '#6b52ff';
const DARK_PURPLE = '#4b38b5';

export default function Maintenance() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const generateParticles = () => {
            return Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: Math.random() * 3 + 1,
                opacity: Math.random(),
                blur: Math.random() > 0.8 ? 2 : 0,
            }));
        };
        setParticles(generateParticles());
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0D14] text-white relative overflow-hidden flex flex-col items-center justify-center">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-white pointer-events-none"
                    style={{
                        top: particle.top,
                        left: particle.left,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                        filter: `blur(${particle.blur}px)`,
                    }}
                />
            ))}

            <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                <div className="flex items-center justify-center -mb-4 md:-mb-8 select-none gap-4 md:gap-8">

                    <motion.div
                        initial={{ opacity: 0, x: -50, rotate: -20 }}
                        animate={{ opacity: 1, x: 0, y: [-15, 5, -15], rotate: [-20, -10, -20] }}
                        transition={{
                            opacity: { duration: 0.8 },
                            x: { duration: 0.8 },
                            y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                            rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                        }}
                        style={{ filter: `drop-shadow(6px 6px 0px ${DARK_PURPLE})` }}
                    >
                        <Pizza color={PURPLE} strokeWidth={1.5} className="w-[80px] h-[80px] md:w-[160px] md:h-[160px]" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1, y: [-10, 10, -10] }}
                        transition={{
                            opacity: { duration: 0.8 },
                            scale: { duration: 0.8 },
                            y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                        }}
                        className="relative z-10"
                        style={{ filter: `drop-shadow(6px 6px 0px ${DARK_PURPLE}) drop-shadow(10px 10px 15px rgba(0,0,0,0.5))` }}
                    >
                        <UtensilsCrossed color={PURPLE} strokeWidth={1.5} className="w-[120px] h-[120px] md:w-[220px] md:h-[220px]" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: 20 }}
                        animate={{ opacity: 1, x: 0, y: [5, -15, 5], rotate: [20, 10, 20] }}
                        transition={{
                            opacity: { duration: 0.8 },
                            x: { duration: 0.8 },
                            y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                            rotate: { repeat: Infinity, duration: 5.5, ease: "easeInOut" }
                        }}
                        style={{ filter: `drop-shadow(6px 6px 0px ${DARK_PURPLE})` }}
                    >
                        <Pizza color={PURPLE} strokeWidth={1.5} className="w-[80px] h-[80px] md:w-[160px] md:h-[160px]" />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-8 md:mt-12 space-y-4"
                >
                    <h1 className="text-2xl md:text-4xl font-semibold tracking-wide">
                        Nossa cozinha está em reforma!
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto leading-relaxed">
                        O <strong>IFFOOD</strong> está sendo temperado com novas melhorias. Estamos trabalhando nos bastidores para deixar seus pedidos ainda mais rápidos e saborosos.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-10"
                >
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-medium tracking-wide transition-all hover:scale-105 active:scale-95 shadow-lg brightness-100 hover:brightness-110 mx-auto"
                        style={{ backgroundColor: PURPLE }}
                    >
                        <RefreshCw size={20} />
                        TENTAR NOVAMENTE
                    </button>
                </motion.div>
            </main>
        </div>
    );
}