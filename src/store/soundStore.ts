import { create } from "zustand";

export interface SoundConfig {
    id: string;
    name: string;
    emoji: string;
    playing: boolean;
    volume: number;
}

interface SoundStore {
    sounds: SoundConfig[];
    toggleSound: (id: string) => void;
    setVolume: (id: string, volume: number) => void;
    muteAll: () => void;
    isMuted: boolean;
}

const defaultSounds: SoundConfig[] = [
    { id: "rain", name: "Rain", emoji: "🌧️", playing: false, volume: 0.5 },
    { id: "forest", name: "Forest", emoji: "🌳", playing: false, volume: 0.5 },
    { id: "wind", name: "Wind", emoji: "💨", playing: false, volume: 0.4 },
    { id: "cafe", name: "Café", emoji: "☕", playing: false, volume: 0.5 },
    { id: "fireplace", name: "Fireplace", emoji: "🔥", playing: false, volume: 0.5 },
    { id: "ocean", name: "Ocean", emoji: "🌊", playing: false, volume: 0.5 },
    { id: "keyboard", name: "Keyboard", emoji: "⌨️", playing: false, volume: 0.3 },
];

export const useSoundStore = create<SoundStore>((set) => ({
    sounds: defaultSounds,
    isMuted: false,

    toggleSound: (id) =>
        set((state) => ({
            sounds: state.sounds.map((s) =>
                s.id === id ? { ...s, playing: !s.playing } : s
            ),
        })),

    setVolume: (id, volume) =>
        set((state) => ({
            sounds: state.sounds.map((s) =>
                s.id === id ? { ...s, volume } : s
            ),
        })),

    muteAll: () =>
        set((state) => {
            if (state.isMuted) {
                return { isMuted: false };
            }
            return { isMuted: true };
        }),
}));
