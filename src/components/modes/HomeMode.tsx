"use client";

import { motion } from "framer-motion";
import Clock from "@/components/Clock";
import Greeting from "@/components/Greeting";
import Quote from "@/components/Quote";

export default function HomeMode() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex-1 flex flex-col items-center justify-center gap-6 relative z-10"
        >
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${i * 0.8}s`,
                            animationDuration: `${4 + i * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            <Greeting />
            <Clock />
            <Quote />
        </motion.div>
    );
}
