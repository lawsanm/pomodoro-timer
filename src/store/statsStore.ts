import { create } from "zustand";
import { getTodayKey } from "@/utils/helpers";

interface DayStats {
    focusMinutes: number;
    sessionsCompleted: number;
    tasksCompleted: number;
}

interface StatsStore {
    dailyStats: Record<string, DayStats>;
    streak: number;

    addFocusMinute: () => void;
    addSession: () => void;
    addTaskCompleted: () => void;
    getTodayStats: () => DayStats;
    loadFromStorage: () => void;
    saveToStorage: () => void;
    resetStats: () => void;
}

const STORAGE_KEY = "lawzen-stats";

function getDefaultDay(): DayStats {
    return { focusMinutes: 0, sessionsCompleted: 0, tasksCompleted: 0 };
}

export const useStatsStore = create<StatsStore>((set, get) => ({
    dailyStats: {},
    streak: 0,

    addFocusMinute: () => {
        const key = getTodayKey();
        const state = get();
        const today = state.dailyStats[key] || getDefaultDay();
        set({
            dailyStats: {
                ...state.dailyStats,
                [key]: { ...today, focusMinutes: today.focusMinutes + 1 },
            },
        });
        get().saveToStorage();
    },

    addSession: () => {
        const key = getTodayKey();
        const state = get();
        const today = state.dailyStats[key] || getDefaultDay();
        set({
            dailyStats: {
                ...state.dailyStats,
                [key]: { ...today, sessionsCompleted: today.sessionsCompleted + 1 },
            },
        });
        get().saveToStorage();
    },

    addTaskCompleted: () => {
        const key = getTodayKey();
        const state = get();
        const today = state.dailyStats[key] || getDefaultDay();
        set({
            dailyStats: {
                ...state.dailyStats,
                [key]: { ...today, tasksCompleted: today.tasksCompleted + 1 },
            },
        });
        get().saveToStorage();
    },

    getTodayStats: () => {
        const key = getTodayKey();
        return get().dailyStats[key] || getDefaultDay();
    },

    loadFromStorage: () => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                set({ dailyStats: data.dailyStats || {}, streak: data.streak || 0 });
            }
        } catch { /* ignore */ }
    },

    saveToStorage: () => {
        if (typeof window === "undefined") return;
        const state = get();
        // Calculate streak
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split("T")[0];
            const stats = state.dailyStats[key];
            if (stats && stats.focusMinutes > 0) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        set({ streak });
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ dailyStats: state.dailyStats, streak })
        );
    },

    resetStats: () => {
        set({ dailyStats: {}, streak: 0 });
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
    },
}));
