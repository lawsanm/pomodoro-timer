"use client";

import { useTimerStore } from "@/store/timerStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useStatsStore } from "@/store/statsStore";
import { themes } from "@/utils/themes";
import { X, RotateCcw } from "lucide-react";

interface Props {
    onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
    const {
        focusDuration,
        shortBreakDuration,
        longBreakDuration,
        setDurations,
    } = useTimerStore();
    const {
        theme,
        setTheme,
        notificationsEnabled,
        setNotificationsEnabled,
        autoStartBreak,
        setAutoStartBreak,
    } = useSettingsStore();
    const { resetStats } = useStatsStore();

    const requestNotificationPermission = () => {
        if (typeof window !== "undefined" && "Notification" in window) {
            Notification.requestPermission();
        }
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-5 bg-[#1a1a2e]/95 backdrop-blur-xl border-b border-white/5 rounded-t-2xl z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        ⚙️ Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    {/* Timer Durations */}
                    <section>
                        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                            Timer Durations
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Focus", value: focusDuration, key: "focus" },
                                { label: "Short Break", value: shortBreakDuration, key: "short" },
                                { label: "Long Break", value: longBreakDuration, key: "long" },
                            ].map(({ label, value, key }) => (
                                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <span className="text-sm text-white/80">{label}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const vals = { focus: focusDuration, short: shortBreakDuration, long: longBreakDuration };
                                                if (key === "focus") vals.focus = Math.max(5, vals.focus - 5);
                                                if (key === "short") vals.short = Math.max(1, vals.short - 1);
                                                if (key === "long") vals.long = Math.max(5, vals.long - 5);
                                                setDurations(vals.focus, vals.short, vals.long);
                                            }}
                                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 flex items-center justify-center text-sm"
                                        >
                                            −
                                        </button>
                                        <span className="text-white font-mono text-sm w-10 text-center">{value}m</span>
                                        <button
                                            onClick={() => {
                                                const vals = { focus: focusDuration, short: shortBreakDuration, long: longBreakDuration };
                                                if (key === "focus") vals.focus = Math.min(90, vals.focus + 5);
                                                if (key === "short") vals.short = Math.min(15, vals.short + 1);
                                                if (key === "long") vals.long = Math.min(30, vals.long + 5);
                                                setDurations(vals.focus, vals.short, vals.long);
                                            }}
                                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 flex items-center justify-center text-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Theme */}
                    <section>
                        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                            Theme
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`p-3 rounded-xl text-left transition-all ${theme === t.id
                                            ? "ring-2 ring-indigo-500 bg-white/10"
                                            : "bg-white/5 hover:bg-white/10"
                                        }`}
                                >
                                    <span className="text-lg">{t.emoji}</span>
                                    <p className="text-xs text-white/70 mt-1">{t.name}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Preferences */}
                    <section>
                        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                            Preferences
                        </h3>
                        <div className="space-y-2">
                            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 cursor-pointer">
                                <span className="text-sm text-white/80">Notifications</span>
                                <button
                                    onClick={requestNotificationPermission}
                                    className={`w-10 h-6 rounded-full transition-all relative ${notificationsEnabled ? "bg-indigo-500" : "bg-white/10"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notificationsEnabled ? "left-5" : "left-1"
                                            }`}
                                    />
                                </button>
                            </label>
                            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 cursor-pointer">
                                <span className="text-sm text-white/80">Auto-start breaks</span>
                                <button
                                    onClick={() => setAutoStartBreak(!autoStartBreak)}
                                    className={`w-10 h-6 rounded-full transition-all relative ${autoStartBreak ? "bg-indigo-500" : "bg-white/10"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoStartBreak ? "left-5" : "left-1"
                                            }`}
                                    />
                                </button>
                            </label>
                        </div>
                    </section>

                    {/* Reset */}
                    <section>
                        <button
                            onClick={() => {
                                if (window.confirm("Reset all statistics? This cannot be undone.")) {
                                    resetStats();
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-all w-full justify-center"
                        >
                            <RotateCcw size={14} />
                            Reset All Statistics
                        </button>
                    </section>

                    {/* Keyboard Shortcuts */}
                    <section>
                        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                            Keyboard Shortcuts
                        </h3>
                        <div className="space-y-1.5">
                            {[
                                ["Space", "Start / Pause timer"],
                                ["T", "Toggle task panel"],
                                ["M", "Mute sounds"],
                                ["F", "Toggle fullscreen"],
                                ["1 / 2 / 3", "Switch modes"],
                            ].map(([key, desc]) => (
                                <div key={key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03]">
                                    <span className="text-xs text-white/50">{desc}</span>
                                    <kbd className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white/60 font-mono">
                                        {key}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
