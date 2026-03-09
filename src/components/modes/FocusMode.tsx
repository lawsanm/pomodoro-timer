"use client";

import { motion } from "framer-motion";
import Timer from "@/components/Timer";
import TaskList from "@/components/TaskList";
import StatsPanel from "@/components/StatsPanel";
import Quote from "@/components/Quote";

export default function FocusMode() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex items-stretch gap-6 p-4 pt-12 pb-24 relative z-10 max-w-7xl mx-auto w-full"
        >
            {/* Left Panel — Tasks (Minimalist) */}
            <div className="hidden lg:flex w-80 flex-shrink-0 flex-col pt-10">
                <div className="flex-1 overflow-hidden transition-opacity hover:opacity-100 opacity-60 hover:bg-black/20 p-4 rounded-3xl duration-500">
                    <TaskList />
                </div>
            </div>

            {/* Center Panel — Elegant Floating Timer */}
            <div className="flex-1 flex items-center justify-center">
                <div className="drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700">
                    <Timer />
                </div>
            </div>

            {/* Right Panel — Stats + Quote (Minimalist) */}
            <div className="hidden lg:flex w-80 flex-shrink-0 flex-col gap-6 pt-10">
                <div className="transition-opacity hover:opacity-100 opacity-60 hover:bg-black/20 p-4 rounded-3xl duration-500">
                    <StatsPanel />
                </div>
                <div className="mt-auto pb-10 transition-opacity hover:opacity-100 opacity-60 duration-500">
                    <Quote />
                </div>
            </div>
        </motion.div>
    );
}
