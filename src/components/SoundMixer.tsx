"use client";

import { useSoundStore } from "@/store/soundStore";
import { useAppStore } from "@/store/appStore";
import { Volume2, VolumeX, X } from "lucide-react";

export default function SoundMixer() {
    const { sounds, toggleSound, setVolume, muteAll, isMuted } = useSoundStore();

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    🎧 Ambient Sounds
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={muteAll}
                        className={`p-2 rounded-lg transition-all ${isMuted
                                ? "bg-red-500/20 text-red-400"
                                : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <button 
                      onClick={() => useAppStore.getState().setShowSoundMixer(false)}
                      className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors sm:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {sounds.map((sound) => (
                    <div
                        key={sound.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${sound.playing
                                ? "bg-white/10 border border-white/15"
                                : "bg-white/[0.03] border border-transparent hover:bg-white/5"
                            }`}
                    >
                        <button
                            onClick={() => toggleSound(sound.id)}
                            className={`text-2xl w-10 h-10 rounded-lg flex items-center justify-center transition-all ${sound.playing
                                    ? "bg-indigo-500/20 scale-110"
                                    : "bg-white/5 hover:scale-105"
                                }`}
                        >
                            {sound.emoji}
                        </button>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${sound.playing ? "text-white" : "text-white/50"}`}>
                                {sound.name}
                            </p>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={sound.volume}
                                onChange={(e) => setVolume(sound.id, parseFloat(e.target.value))}
                                className="w-full h-1 mt-1 accent-indigo-500 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
