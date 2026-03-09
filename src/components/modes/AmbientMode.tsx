"use client";

import { motion } from "framer-motion";
import { useTimerStore } from "@/store/timerStore";
import { formatTime } from "@/utils/helpers";
import { Play, Pause } from "lucide-react";
import Quote from "@/components/Quote";

export default function AmbientMode() {
    const { timeLeft, isRunning, setIsRunning } = useTimerStore();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10"
        >
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/10 animate-float"
                        style={{
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.6}s`,
                            animationDuration: `${5 + Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Centered Quote */}
            <div className="max-w-2xl">
                <Quote />
            </div>

            {/* Mini Timer */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                    {isRunning ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <span className="text-white/80 font-black text-lg tracking-tighter" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatTime(timeLeft)}
                </span>
            </div>
        </motion.div>
    );
}
