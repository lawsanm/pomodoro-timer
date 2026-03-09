"use client";

import { useAppStore, AppMode } from "@/store/appStore";
import {
    Home,
    Leaf,
    Sparkles,
    Settings,
    ListTodo,
    Music,
    Headphones,
    Maximize,
} from "lucide-react";

export default function BottomNav() {
    const { mode, setMode, setShowSettings, setShowTaskPanel, setShowMusicPlayer, setShowSoundMixer } = useAppStore();

    const modeButtons: { id: AppMode; icon: React.ElementType; label: string }[] = [
        { id: "focus", icon: Leaf, label: "Focus" },
        { id: "home", icon: Home, label: "Home" },
        { id: "ambient", icon: Sparkles, label: "Ambient" },
    ];

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-3 py-2 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Left tools */}
            <div className="flex items-center gap-0.5 pr-3 border-r border-white/10">
                <button
                    onClick={() => setShowTaskPanel(true)}
                    className="p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Tasks (T)"
                >
                    <ListTodo size={18} />
                </button>
                <button
                    onClick={() => setShowMusicPlayer(true)}
                    className="p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Music"
                >
                    <Music size={18} />
                </button>
                <button
                    onClick={() => setShowSoundMixer(true)}
                    className="p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Sounds (M)"
                >
                    <Headphones size={18} />
                </button>
            </div>

            {/* Mode buttons */}
            <div className="flex items-center gap-0.5 px-1">
                {modeButtons.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setMode(id)}
                        className={`p-2.5 rounded-xl transition-all ${mode === id
                                ? "bg-indigo-500/30 text-indigo-300 shadow-lg shadow-indigo-500/20"
                                : "text-white/50 hover:text-white hover:bg-white/10"
                            }`}
                        title={label}
                    >
                        <Icon size={18} />
                    </button>
                ))}
            </div>

            {/* Right tools */}
            <div className="flex items-center gap-0.5 pl-3 border-l border-white/10">
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Settings"
                >
                    <Settings size={18} />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title="Fullscreen (F)"
                >
                    <Maximize size={18} />
                </button>
            </div>
        </div>
    );
}
