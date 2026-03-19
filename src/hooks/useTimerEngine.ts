"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "@/store/timerStore";
import { useStatsStore } from "@/store/statsStore";

// Base64 encoded classic desk bell sound
const BELL_SOUND = "data:audio/mp3;base64,//NExAAAAANIAUAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAUAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
// Note: We use Web Audio API fallback to avoid putting a huge base64 block in the code if standard bell isn't needed. 
// A better way is using a procedurally generated clean bell sound using WebAudio API since it takes fewer bytes and is loud/clear.

export function useTimerEngine() {
    const {
        timeLeft,
        isRunning,
        timerMode,
        tick,
        completeSession,
    } = useTimerStore();
    const { addFocusMinute, addSession } = useStatsStore();

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const minuteCounterRef = useRef(0);

    // Procedurally generated clean digital bell sound
    const playLoudBell = useCallback(() => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();

            // Oscillator 1 (Main Tone)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.5);
            gain.gain.setValueAtTime(0.8, ctx.currentTime); // LOUD
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

            // Oscillator 2 (Overtones for "ring" effect)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.frequency.setValueAtTime(1200, ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 1.2);
            gain2.gain.setValueAtTime(0.3, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

            osc.connect(gain);
            osc2.connect(gain2);
            gain.connect(ctx.destination);
            gain2.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc2.start(ctx.currentTime);

            osc.stop(ctx.currentTime + 1.5);
            osc2.stop(ctx.currentTime + 1.2);
        } catch { /* ignore if audio context fails */ }
    }, []);

    // Timer Ticker
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                tick();
                // Add statistical focus minute
                if (timerMode === "focus") {
                    minuteCounterRef.current += 1;
                    if (minuteCounterRef.current >= 60) {
                        minuteCounterRef.current = 0;
                        addFocusMinute();
                    }
                }
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, tick, timerMode, addFocusMinute]);

    // Handle Title Updates (Timer in Browser Tab)
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (isRunning) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                const modeString = timerMode === "focus" ? "Focus" : "Break";
                document.title = `${timeString} - ${modeString} | LAWZEN`;
            } else {
                document.title = "LAWZEN — Focus & Productivity Dashboard";
            }
        }
    }, [timeLeft, isRunning, timerMode]);

    // Completion Handler
    useEffect(() => {
        if (timeLeft === 0 && isRunning) {
            useTimerStore.getState().setIsRunning(false);

            playLoudBell();
            if (timerMode === "focus") {
                addSession();
            }

            // Browser Notification
            if (typeof window !== "undefined" && Notification.permission === "granted") {
                new Notification(
                    timerMode === "focus" ? "Focus session complete! 🎉" : "Break is over! Time to focus 💪",
                    { body: "Click here to return to the app." }
                );
            }

            // Small delay before transition so UI doesn't jump instantly
            setTimeout(() => completeSession(), 800);
        }
    }, [timeLeft, isRunning, timerMode, completeSession, addSession, playLoudBell]);
}
