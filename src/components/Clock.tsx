"use client";

import { useState, useEffect } from "react";

export default function Clock() {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        function updateTime() {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
            );
        }
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return null;

    return (
        <div className="text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-black leading-none tracking-tighter text-white drop-shadow-2xl select-none">
            {time}
        </div>
    );
}
