"use client";

import { useTimerStore } from "@/store/timerStore";
import { useTaskStore } from "@/store/taskStore";
import { useTimer } from "@/hooks/useTimer";
import { formatTime } from "@/utils/helpers";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

export default function Timer() {
    const {
        timeLeft,
        isRunning,
        timerMode,
        setIsRunning,
        resetTimer,
        skipToNext,
        setTimerMode,
    } = useTimerStore();
    const focusTask = useTaskStore((s) => s.getFocusTask());

    return (
        <div className="flex flex-col items-center gap-12 sm:gap-16 w-full max-w-2xl mx-auto">
            {/* Mode Tabs - Extremely subtle */}
            <div className="flex gap-6 sm:gap-10">
                {[
                    { mode: "focus" as const, label: "FOCUS" },
                    { mode: "shortBreak" as const, label: "SHORT BREAK" },
                    { mode: "longBreak" as const, label: "LONG BREAK" },
                ].map(({ mode, label }) => (
                    <button
                        key={mode}
                        onClick={() => setTimerMode(mode)}
                        className={`text-xs sm:text-sm tracking-[0.2em] font-medium transition-all duration-500 ${timerMode === mode
                            ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            : "text-white/40 hover:text-white/70"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Timer Display - Massive, elegant typography */}
            <div className="relative group flex flex-col items-center">
                <span className="text-[80px] sm:text-[140px] md:text-[180px] leading-none font-black text-white tracking-tighter drop-shadow-2xl select-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatTime(timeLeft)}
                </span>

                {/* Focus Task Display (if any) */}
                <div className={`mt-4 sm:mt-8 transition-opacity duration-700 ${focusTask ? "opacity-100" : "opacity-0"}`}>
                    {focusTask && (
                        <div className="text-white/70 text-sm sm:text-base font-medium tracking-wide flex items-center gap-3">
                            <span className="opacity-80 drop-shadow-md">{focusTask.emoji}</span>
                            <span className="max-w-[300px] truncate">{focusTask.text}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Minimalist Controls */}
            <div className="flex items-center gap-8 sm:gap-12 mt-4">
                <button
                    onClick={resetTimer}
                    className="text-white/30 hover:text-white transition-all duration-300 hover:rotate-[-45deg] scale-100 hover:scale-110 active:scale-95"
                    title="Reset"
                >
                    <RotateCcw size={24} strokeWidth={1.5} />
                </button>

                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white transition-all duration-300 hover:scale-[1.05] active:scale-95 group shadow-2xl"
                >
                    {isRunning ? (
                        <Pause size={32} strokeWidth={1.5} className="group-hover:opacity-80 transition-opacity" />
                    ) : (
                        <Play size={32} strokeWidth={1.5} className="ml-2 group-hover:opacity-80 transition-opacity" />
                    )}
                </button>

                <button
                    onClick={skipToNext}
                    className="text-white/30 hover:text-white transition-all duration-300 hover:translate-x-1 scale-100 hover:scale-110 active:scale-95"
                    title="Skip"
                >
                    <SkipForward size={24} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}
