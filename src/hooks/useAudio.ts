"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSoundStore } from "@/store/soundStore";

type NoiseType = "white" | "pink" | "brown";

function createNoiseBuffer(ctx: AudioContext, type: NoiseType, duration = 2): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        switch (type) {
            case "white":
                data[i] = white * 0.5;
                break;
            case "pink":
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
                b6 = white * 0.115926;
                break;
            case "brown":
                data[i] = (b0 + white * 0.02) * 0.5;
                b0 = (b0 + white * 0.02) * 0.998;
                break;
        }
    }
    return buffer;
}

interface SoundNode {
    source: AudioBufferSourceNode;
    gain: GainNode;
    filter?: BiquadFilterNode;
}

const soundConfigs: Record<string, { noise: NoiseType; filterFreq?: number; filterType?: BiquadFilterType }> = {
    rain: { noise: "pink", filterFreq: 3000, filterType: "lowpass" },
    forest: { noise: "pink", filterFreq: 5000, filterType: "bandpass" },
    wind: { noise: "brown", filterFreq: 800, filterType: "lowpass" },
    cafe: { noise: "white", filterFreq: 4000, filterType: "lowpass" },
    fireplace: { noise: "brown", filterFreq: 600, filterType: "lowpass" },
    ocean: { noise: "brown", filterFreq: 400, filterType: "lowpass" },
    keyboard: { noise: "white", filterFreq: 8000, filterType: "highpass" },
};

export function useAudio() {
    const ctxRef = useRef<AudioContext | null>(null);
    const nodesRef = useRef<Record<string, SoundNode>>({});
    const { sounds, isMuted } = useSoundStore();

    const getContext = useCallback(() => {
        if (!ctxRef.current) {
            ctxRef.current = new AudioContext();
        }
        if (ctxRef.current.state === "suspended") {
            ctxRef.current.resume();
        }
        return ctxRef.current;
    }, []);

    const startSound = useCallback(
        (id: string, volume: number) => {
            if (nodesRef.current[id]) return;
            const ctx = getContext();
            const config = soundConfigs[id];
            if (!config) return;

            const buffer = createNoiseBuffer(ctx, config.noise);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const gain = ctx.createGain();
            gain.gain.value = isMuted ? 0 : volume * 0.4;

            if (config.filterFreq && config.filterType) {
                const filter = ctx.createBiquadFilter();
                filter.type = config.filterType;
                filter.frequency.value = config.filterFreq;
                filter.Q.value = 1;
                source.connect(filter);
                filter.connect(gain);
                nodesRef.current[id] = { source, gain, filter };
            } else {
                source.connect(gain);
                nodesRef.current[id] = { source, gain };
            }

            gain.connect(ctx.destination);
            source.start();
        },
        [getContext, isMuted]
    );

    const stopSound = useCallback((id: string) => {
        const node = nodesRef.current[id];
        if (node) {
            node.source.stop();
            node.source.disconnect();
            node.gain.disconnect();
            node.filter?.disconnect();
            delete nodesRef.current[id];
        }
    }, []);

    useEffect(() => {
        sounds.forEach((s) => {
            if (s.playing) {
                if (!nodesRef.current[s.id]) {
                    startSound(s.id, s.volume);
                } else {
                    nodesRef.current[s.id].gain.gain.value = isMuted ? 0 : s.volume * 0.4;
                }
            } else {
                stopSound(s.id);
            }
        });
    }, [sounds, isMuted, startSound, stopSound]);

    // Handle browser autoplay policy by resuming context on first user interaction
    useEffect(() => {
        const initAudio = () => {
            const ctx = getContext();
            if (ctx.state === "suspended") {
                ctx.resume();
            }
        };
        window.addEventListener("click", initAudio, { once: true });
        window.addEventListener("keydown", initAudio, { once: true });

        return () => {
            window.removeEventListener("click", initAudio);
            window.removeEventListener("keydown", initAudio);
        };
    }, [getContext]);

    useEffect(() => {
        return () => {
            Object.keys(nodesRef.current).forEach(stopSound);
            ctxRef.current?.close().catch(() => { });
        };
    }, [stopSound]);
}
