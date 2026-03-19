"use client";

import { useTimerStore } from "@/store/timerStore";

export function useTimer() {
    const {
        timeLeft,
        timerMode,
        focusDuration,
        shortBreakDuration,
        longBreakDuration,
    } = useTimerStore();

    const totalSeconds =
        timerMode === "focus"
            ? focusDuration * 60
            : timerMode === "shortBreak"
                ? shortBreakDuration * 60
                : longBreakDuration * 60;

    const progress = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;

    return { progress, totalSeconds };
}
