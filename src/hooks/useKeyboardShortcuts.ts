"use client";

import { useEffect } from "react";
import { useTimerStore } from "@/store/timerStore";
import { useAppStore } from "@/store/appStore";
import { useSoundStore } from "@/store/soundStore";

export function useKeyboardShortcuts() {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Don't trigger shortcuts when typing in inputs
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

            switch (e.key.toLowerCase()) {
                case " ": {
                    e.preventDefault();
                    const { isRunning, setIsRunning } = useTimerStore.getState();
                    setIsRunning(!isRunning);
                    break;
                }
                case "t": {
                    const { setShowTaskPanel, showTaskPanel } = useAppStore.getState();
                    setShowTaskPanel(!showTaskPanel);
                    break;
                }
                case "m": {
                    useSoundStore.getState().muteAll();
                    break;
                }
                case "f": {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                    break;
                }
                case "1": {
                    useAppStore.getState().setMode("home");
                    break;
                }
                case "2": {
                    useAppStore.getState().setMode("focus");
                    break;
                }
                case "3": {
                    useAppStore.getState().setMode("ambient");
                    break;
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
}
