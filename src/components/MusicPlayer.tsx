"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Loader2, X } from "lucide-react";
import { useAppStore } from "@/store/appStore";

interface Track {
    title: string;
    artist: string;
    emoji: string;
    url: string;
}

const playlists: Record<string, Track[]> = {
    "Lofi Focus": [
        { title: "Lofi Girl Radio", artist: "Chilled Vibes", emoji: "☕", url: "https://streams.ilovemusic.de/iloveradio17.mp3" },
        { title: "Chillhop Music", artist: "Chillhop Web", emoji: "📚", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
    ],
    "Deep Work": [
        { title: "Deep Focus (Ambient)", artist: "Focus FM", emoji: "🧠", url: "https://stream.zeno.fm/0r0xa792kwzuv" },
        { title: "Synthwave Beats", artist: "Retrowave", emoji: "🌅", url: "https://streams.ilovemusic.de/iloveradio26.mp3" },
    ],
    "Chill Study": [
        { title: "Easy Study Lounge", artist: "Calm FM", emoji: "🎓", url: "https://stream.zeno.fm/8x9t3y9y2xquv" },
        { title: "Piano & Rain", artist: "Dream Pop", emoji: "🌧️", url: "https://streams.ilovemusic.de/iloveradio10.mp3" },
    ],
};

export default function MusicPlayer() {
    const [currentPlaylist, setCurrentPlaylist] = useState("Lofi Focus");
    const [trackIndex, setTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const tracks = playlists[currentPlaylist];
    const currentTrack = tracks[trackIndex];

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = volume;

        audioRef.current.addEventListener("playing", () => {
            setIsPlaying(true);
            setIsLoading(false);
        });
        audioRef.current.addEventListener("waiting", () => setIsLoading(true));
        audioRef.current.addEventListener("pause", () => setIsPlaying(false));

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle track changes
    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        const wasPlaying = isPlaying;

        audio.src = currentTrack.url;
        audio.load();

        if (wasPlaying) {
            setIsLoading(true);
            audio.play().catch(() => setIsPlaying(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack.url]);

    // Handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            setIsLoading(true);
            audioRef.current.play().catch(() => {
                setIsPlaying(false);
                setIsLoading(false);
            });
        }
    }, [isPlaying]);

    const nextTrack = useCallback(() => {
        setTrackIndex((i) => (i + 1) % tracks.length);
        setIsPlaying(true);
    }, [tracks.length]);

    const prevTrack = useCallback(() => {
        setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
        setIsPlaying(true);
    }, [tracks.length]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    🎵 Music Player
                </h3>
                <button 
                  onClick={() => useAppStore.getState().setShowMusicPlayer(false)}
                  className="p-2 -mr-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors sm:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Playlist Selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-thin">
                {Object.keys(playlists).map((name) => (
                    <button
                        key={name}
                        onClick={() => {
                            setCurrentPlaylist(name);
                            setTrackIndex(0);
                            setIsPlaying(true);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${currentPlaylist === name
                            ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                            : "bg-white/5 text-white/50 hover:text-white/80 border border-transparent"
                            }`}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Current Track */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4 relative overflow-hidden">
                {/* Live stream indicator glow */}
                {isPlaying && !isLoading && (
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                )}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center text-2xl z-10">
                    {currentTrack.emoji}
                </div>
                <div className="flex-1 min-w-0 z-10">
                    <p className="text-sm font-medium text-white truncate flex items-center gap-2">
                        {currentTrack.title}
                        {isLoading && <Loader2 size={12} className="animate-spin text-indigo-400" />}
                    </p>
                    <p className="text-xs text-white/40 truncate">{currentTrack.artist}</p>
                </div>
            </div>

            {/* Progress Bar (Simulating Live Radio Eq / Progress) */}
            <div className="w-full h-1 flex gap-0.5 mb-4 justify-between items-end overflow-hidden pb-1 opacity-50">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-full bg-indigo-500 rounded-t-sm transition-all duration-300 ease-out`}
                        style={{
                            height: isPlaying && !isLoading ? `${Math.max(20, Math.random() * 100)}%` : '20%',
                            transitionDelay: `${i * 0.02}s`
                        }}
                    />
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={prevTrack}
                    className="p-2 text-white/50 hover:text-white transition-all"
                >
                    <SkipBack size={20} />
                </button>
                <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    className="p-3 rounded-full bg-indigo-500/80 hover:bg-indigo-500 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isLoading ? <Loader2 size={22} className="animate-spin" /> : (isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />)}
                </button>
                <button
                    onClick={nextTrack}
                    className="p-2 text-white/50 hover:text-white transition-all"
                >
                    <SkipForward size={20} />
                </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 mt-4">
                <Volume2 size={14} className="text-white/30" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 accent-indigo-500 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:rounded-full"
                />
            </div>

            {/* Track List */}
            <div className="mt-4 space-y-1">
                {tracks.map((track, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setTrackIndex(i);
                            setIsPlaying(true);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left ${i === trackIndex
                            ? "bg-white/10 text-white shadow-inner"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                            }`}
                    >
                        <span className="text-sm">{track.emoji}</span>
                        <span className="text-xs flex-1 truncate">{track.title}</span>
                        <span className="text-[10px] text-white/20">{track.artist}</span>

                        {i === trackIndex && isPlaying && !isLoading && (
                            <span className="flex gap-[2px] h-3 items-end opacity-50">
                                <span className="w-1 bg-indigo-400 animate-[bounce_1s_infinite] rounded-t-sm" />
                                <span className="w-1 bg-indigo-400 animate-[bounce_0.8s_infinite_0.1s] rounded-t-sm" />
                                <span className="w-1 bg-indigo-400 animate-[bounce_1.2s_infinite_0.2s] rounded-t-sm" />
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
