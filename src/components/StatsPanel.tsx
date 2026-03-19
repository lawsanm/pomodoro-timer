"use client";

import { useStatsStore } from "@/store/statsStore";
import { useTimerStore } from "@/store/timerStore";
import { formatMinutes } from "@/utils/helpers";
import { Clock, Flame, CheckCircle, Zap } from "lucide-react";
import StatsChart from "./StatsChart";

export default function StatsPanel() {
    const { getTodayStats, streak } = useStatsStore();
    const { sessionsCompleted } = useTimerStore();
    const today = getTodayStats();

    const stats = [
        {
            label: "Focus Time",
            value: formatMinutes(today.focusMinutes),
            icon: Clock,
            color: "#6366f1",
        },
        {
            label: "Sessions",
            value: sessionsCompleted.toString(),
            icon: Zap,
            color: "#f59e0b",
        },
        {
            label: "Tasks Done",
            value: today.tasksCompleted.toString(),
            icon: CheckCircle,
            color: "#10b981",
        },
        {
            label: "Streak",
            value: `${streak}d`,
            icon: Flame,
            color: "#ef4444",
        },
    ];

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                📊 Today&apos;s Progress
            </h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                        <div className="flex items-center gap-1.5 mb-1">
                            <stat.icon size={13} style={{ color: stat.color }} />
                            <span className="text-[10px] text-white/40 uppercase tracking-wider">
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-[160px]">
                <StatsChart />
            </div>
        </div>
    );
}
