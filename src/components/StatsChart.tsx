"use client";

import { useStatsStore } from "@/store/statsStore";
import { getLast7Days, getDayName } from "@/utils/helpers";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function StatsChart() {
    const { dailyStats } = useStatsStore();
    const days = getLast7Days();

    const data = days.map((day) => ({
        name: getDayName(day),
        minutes: dailyStats[day]?.focusMinutes || 0,
        sessions: dailyStats[day]?.sessionsCompleted || 0,
    }));

    return (
        <div className="w-full h-full">
            <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Weekly Focus</p>
            <ResponsiveContainer width="100%" height={140}>
                <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(15,15,30,0.9)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "#fff",
                        }}
                        labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                        formatter={(value) => [`${value} min`, "Focus"]}
                    />
                    <Bar
                        dataKey="minutes"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
