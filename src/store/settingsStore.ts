import { create } from "zustand";

interface SettingsStore {
    theme: string;
    notificationsEnabled: boolean;
    autoStartBreak: boolean;

    setTheme: (theme: string) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    setAutoStartBreak: (auto: boolean) => void;
    loadFromStorage: () => void;
    saveToStorage: () => void;
}

const STORAGE_KEY = "lawzen-settings";

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    theme: "neon-night",
    notificationsEnabled: true,
    autoStartBreak: true,

    setTheme: (theme) => {
        set({ theme });
        get().saveToStorage();
    },

    setNotificationsEnabled: (enabled) => {
        set({ notificationsEnabled: enabled });
        get().saveToStorage();
    },

    setAutoStartBreak: (auto) => {
        set({ autoStartBreak: auto });
        get().saveToStorage();
    },

    loadFromStorage: () => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                set({
                    theme: data.theme || "neon-night",
                    notificationsEnabled: data.notificationsEnabled ?? true,
                    autoStartBreak: data.autoStartBreak ?? true,
                });
            }
        } catch { /* ignore */ }
    },

    saveToStorage: () => {
        if (typeof window === "undefined") return;
        const state = get();
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                theme: state.theme,
                notificationsEnabled: state.notificationsEnabled,
                autoStartBreak: state.autoStartBreak,
            })
        );
    },
}));
