"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTimerStore } from "@/store/timerStore";
import { useTaskStore } from "@/store/taskStore";
import { useStatsStore } from "@/store/statsStore";
import { getThemeById } from "@/utils/themes";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAudio } from "@/hooks/useAudio";

import { useTimerEngine } from "@/hooks/useTimerEngine";

import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import SoundMixer from "@/components/SoundMixer";
import MusicPlayer from "@/components/MusicPlayer";
import TaskList from "@/components/TaskList";

import HomeMode from "@/components/modes/HomeMode";
import FocusMode from "@/components/modes/FocusMode";
import AmbientMode from "@/components/modes/AmbientMode";

export default function Page() {
  const { mode, showSettings, setShowSettings, showSoundMixer, setShowSoundMixer, showMusicPlayer, setShowMusicPlayer, showTaskPanel, setShowTaskPanel } = useAppStore();
  const { theme } = useSettingsStore();
  const currentTheme = getThemeById(theme);

  // Initialize stores from localStorage
  useEffect(() => {
    useSettingsStore.getState().loadFromStorage();
    useTimerStore.getState().loadFromStorage();
    useTaskStore.getState().loadFromStorage();
    useStatsStore.getState().loadFromStorage();
  }, []);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Hooks
  useKeyboardShortcuts();
  useAudio();
  useTimerEngine(); // Global timer ticking engine

  return (
    <div className="w-screen h-screen flex flex-col relative overflow-hidden transition-all duration-1000 bg-[#0a0a0a]">

      {/* Background Image Layer */}
      {currentTheme.bgUrl && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${currentTheme.bgUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5
          }}
        />
      )}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 animate-bg transition-all duration-1000"
        style={{
          background: currentTheme.gradient,
          backgroundSize: "400% 400%",
          opacity: currentTheme.bgUrl ? 0.8 : 1,
          mixBlendMode: currentTheme.bgUrl ? "hard-light" : "normal"
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-glow pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${currentTheme.accent}15 0%, transparent 70%)`,
        }}
      />

      {/* Mode Content */}
      <AnimatePresence mode="wait">
        {mode === "home" && <HomeMode key="home" />}
        {mode === "focus" && <FocusMode key="focus" />}
        {mode === "ambient" && <AmbientMode key="ambient" />}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Sliding Panels — Persisted in DOM so audio keeps playing */}

      {/* Task Panel (Left) */}
      <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${showTaskPanel ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowTaskPanel(false)} />
        <div className={`relative w-full max-w-sm h-full bg-[#12121a]/95 backdrop-blur-xl border-r border-white/10 p-5 overflow-y-auto transition-transform duration-300 ease-out ${showTaskPanel ? "translate-x-0" : "-translate-x-full"}`}>
          <TaskList />
        </div>
      </div>

      {/* Sound Mixer Panel (Right) */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${showSoundMixer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSoundMixer(false)} />
        <div className={`relative w-full max-w-sm h-full bg-[#12121a]/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto transition-transform duration-300 ease-out ${showSoundMixer ? "translate-x-0" : "translate-x-full"}`}>
          <SoundMixer />
        </div>
      </div>

      {/* Music Player Panel (Right) */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${showMusicPlayer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMusicPlayer(false)} />
        <div className={`relative w-full max-w-sm h-full bg-[#12121a]/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto transition-transform duration-300 ease-out ${showMusicPlayer ? "translate-x-0" : "translate-x-full"}`}>
          <MusicPlayer />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
