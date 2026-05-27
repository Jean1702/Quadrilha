'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PURPLE = '#6b52ff';
const DARK_PURPLE = '#4b38b5';

export default function NotFound() {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const generateStars = () => {
            return Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: Math.random() * 3 + 1,
                opacity: Math.random(),
                blur: Math.random() > 0.8 ? 2 : 0,
            }));
        };
        setStars(generateStars());
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0D14] text-white relative overflow-hidden flex flex-col items-center justify-center">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white pointer-events-none"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        filter: `blur(${star.blur}px)`,
                    }}
                />
            ))}

            <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                <div className="flex items-center justify-center -mb-4 md:-mb-8 select-none">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[120px] md:text-[250px] font-bold leading-none"
                        style={{
                            color: PURPLE,
                            textShadow: `6px 6px 0px ${DARK_PURPLE}, 10px 10px 15px rgba(0,0,0,0.5)`
                        }}
                    >
                        4
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1, y: [-10, 10, -10] }}
                        transition={{
                            opacity: { duration: 0.8 },
                            scale: { duration: 0.8 },
                            y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                        }}
                        className="relative w-30 h-30 md:w-62.5 md:h-62.5 -mx-2.5 md:mx-4 z-10"
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                            <circle cx="50" cy="50" r="35" fill={PURPLE} />

                            <circle cx="40" cy="35" r="6" fill={DARK_PURPLE} opacity="0.6" />
                            <circle cx="65" cy="45" r="4" fill={DARK_PURPLE} opacity="0.6" />
                            <circle cx="50" cy="65" r="8" fill={DARK_PURPLE} opacity="0.6" />
                            <circle cx="30" cy="55" r="3" fill={DARK_PURPLE} opacity="0.6" />
                            <circle cx="60" cy="25" r="2.5" fill={DARK_PURPLE} opacity="0.6" />

                            <ellipse
                                cx="50"
                                cy="50"
                                rx="50"
                                ry="12"
                                fill="none"
                                stroke="#E2E8F0"
                                strokeWidth="1.5"
                                transform="rotate(-20 50 50)"
                                opacity="0.8"
                            />
                        </svg>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[120px] md:text-[250px] font-bold leading-none z-0"
                        style={{
                            color: PURPLE,
                            textShadow: `6px 6px 0px ${DARK_PURPLE}, 10px 10px 15px rgba(0,0,0,0.5)`
                        }}
                    >
                        4
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-8 md:mt-12 space-y-4"
                >
                    <h1 className="text-2xl md:text-4xl font-semibold tracking-wide">
                        Oops, essa página saiu do cardápio!
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto">
                        Você acabou se perdendo no espaço do IFFOOD. Não encontramos a página que você procura, mas temos muita comida boa te esperando...
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-10"
                >
                    <Link href="/">
                        <button
                            className="px-8 py-3 rounded-full font-medium tracking-wide transition-all hover:scale-105 active:scale-95 shadow-lg brightness-100 hover:brightness-110"
                            style={{ backgroundColor: PURPLE }}
                        >
                            VER CARDÁPIO
                        </button>
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}