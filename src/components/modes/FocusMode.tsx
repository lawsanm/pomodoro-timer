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
            className="flex-1 flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-6 p-4 pt-4 lg:pt-12 pb-32 lg:pb-24 relative z-10 max-w-7xl mx-auto w-full overflow-y-auto overflow-x-hidden no-scrollbar"
        >
            {/* Left Panel — Tasks (Minimalist) */}
            <div className="flex w-full max-w-md lg:max-w-none lg:w-80 flex-shrink-0 flex-col lg:pt-10 order-2 lg:order-1">
                <div className="h-[400px] lg:h-auto lg:flex-1 overflow-hidden transition-opacity hover:opacity-100 opacity-80 lg:opacity-60 hover:bg-black/20 p-4 rounded-3xl duration-500 bg-black/10 lg:bg-transparent flex flex-col">
                    <TaskList />
                </div>
            </div>

            {/* Center Panel — Elegant Floating Timer */}
            <div className="flex-1 flex items-center justify-center order-1 lg:order-2 w-full min-h-[45vh] lg:min-h-0">
                <div className="drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700">
                    <Timer />
                </div>
            </div>

            {/* Right Panel — Stats + Quote (Minimalist) */}
            <div className="flex w-full max-w-md lg:max-w-none lg:w-80 flex-shrink-0 flex-col gap-6 lg:pt-10 order-3">
                <div className="h-[350px] lg:h-auto lg:flex-1 overflow-hidden transition-opacity hover:opacity-100 opacity-80 lg:opacity-60 hover:bg-black/20 p-4 rounded-3xl duration-500 bg-black/10 lg:bg-transparent flex flex-col">
                    <StatsPanel />
                </div>
                <div className="mt-auto pb-6 lg:pb-10 transition-opacity hover:opacity-100 opacity-80 lg:opacity-60 duration-500 flex justify-center lg:block">
                    <Quote />
                </div>
            </div>
        </motion.div>
    );
}
