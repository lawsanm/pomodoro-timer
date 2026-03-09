import { create } from "zustand";
import { getTodayKey } from "@/utils/helpers";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

interface TimerStore {
    timerMode: TimerMode;
    timeLeft: number;
    isRunning: boolean;
    sessionsCompleted: number;
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    dailyFocusMinutes: Record<string, number>;

    setTimerMode: (mode: TimerMode) => void;
    setTimeLeft: (time: number) => void;
    setIsRunning: (running: boolean) => void;
    tick: () => void;
    resetTimer: () => void;
    skipToNext: () => void;
    completeSession: () => void;
    setDurations: (focus: number, short: number, long: number) => void;
    addFocusMinute: () => void;
    loadFromStorage: () => void;
    saveToStorage: () => void;
}

const STORAGE_KEY = "lawzen-timer";

function loadData() {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export const useTimerStore = create<TimerStore>((set, get) => ({
    timerMode: "focus",
    timeLeft: 25 * 60,
    isRunning: false,
    sessionsCompleted: 0,
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    dailyFocusMinutes: {},

    setTimerMode: (mode) => {
        const state = get();
        const duration =
            mode === "focus"
                ? state.focusDuration
                : mode === "shortBreak"
                    ? state.shortBreakDuration
                    : state.longBreakDuration;
        set({ timerMode: mode, timeLeft: duration * 60, isRunning: false });
    },

    setTimeLeft: (time) => set({ timeLeft: time }),
    setIsRunning: (running) => set({ isRunning: running }),

    tick: () => {
        const state = get();
        if (state.timeLeft > 0) {
            set({ timeLeft: state.timeLeft - 1 });
        }
    },

    resetTimer: () => {
        const state = get();
        const duration =
            state.timerMode === "focus"
                ? state.focusDuration
                : state.timerMode === "shortBreak"
                    ? state.shortBreakDuration
                    : state.longBreakDuration;
        set({ timeLeft: duration * 60, isRunning: false });
    },

    skipToNext: () => {
        const state = get();
        if (state.timerMode === "focus") {
            // New Pomodoro logic: Long break every 4 sessions
            const nextMode = (state.sessionsCompleted + 1) % 4 === 0 ? "longBreak" : "shortBreak";
            state.setTimerMode(nextMode);
        } else {
            state.setTimerMode("focus");
        }
    },

    completeSession: () => {
        const state = get();
        if (state.timerMode === "focus") {
            const newCount = state.sessionsCompleted + 1;
            set({ sessionsCompleted: newCount });
            state.saveToStorage();
        }
        state.skipToNext();
    },

    setDurations: (focus, short, long) => {
        set({
            focusDuration: focus,
            shortBreakDuration: short,
            longBreakDuration: long,
        });
        const state = get();
        const duration =
            state.timerMode === "focus"
                ? focus
                : state.timerMode === "shortBreak"
                    ? short
                    : long;
        set({ timeLeft: duration * 60, isRunning: false });
        state.saveToStorage();
    },

    addFocusMinute: () => {
        const key = getTodayKey();
        const state = get();
        const current = state.dailyFocusMinutes[key] || 0;
        set({
            dailyFocusMinutes: { ...state.dailyFocusMinutes, [key]: current + 1 },
        });
        state.saveToStorage();
    },

    loadFromStorage: () => {
        const data = loadData();
        if (data) {
            set({
                sessionsCompleted: data.sessionsCompleted || 0,
                focusDuration: data.focusDuration || 25,
                shortBreakDuration: data.shortBreakDuration || 5,
                longBreakDuration: data.longBreakDuration || 15,
                dailyFocusMinutes: data.dailyFocusMinutes || {},
            });
            const state = get();
            set({ timeLeft: state.focusDuration * 60 });
        }
    },

    saveToStorage: () => {
        if (typeof window === "undefined") return;
        const state = get();
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                sessionsCompleted: state.sessionsCompleted,
                focusDuration: state.focusDuration,
                shortBreakDuration: state.shortBreakDuration,
                longBreakDuration: state.longBreakDuration,
                dailyFocusMinutes: state.dailyFocusMinutes,
            })
        );
    },
}));
