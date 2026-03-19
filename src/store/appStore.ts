import { create } from "zustand";

export type AppMode = "home" | "focus" | "ambient";

interface AppStore {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    showSoundMixer: boolean;
    setShowSoundMixer: (show: boolean) => void;
    showMusicPlayer: boolean;
    setShowMusicPlayer: (show: boolean) => void;
    showTaskPanel: boolean;
    setShowTaskPanel: (show: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    mode: "home",
    setMode: (mode) => set({ mode }),
    showSettings: false,
    setShowSettings: (show) => set({ showSettings: show }),
    showSoundMixer: false,
    setShowSoundMixer: (show) => set({ showSoundMixer: show }),
    showMusicPlayer: false,
    setShowMusicPlayer: (show) => set({ showMusicPlayer: show }),
    showTaskPanel: false,
    setShowTaskPanel: (show) => set({ showTaskPanel: show }),
}));
