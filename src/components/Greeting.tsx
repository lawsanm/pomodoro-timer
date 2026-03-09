"use client";

import { useState, useEffect } from "react";
import { getGreeting } from "@/utils/helpers";

export default function Greeting() {
    const [greeting, setGreeting] = useState({ text: "", emoji: "" });

    useEffect(() => {
        setGreeting(getGreeting());
        const interval = setInterval(() => setGreeting(getGreeting()), 60000);
        return () => clearInterval(interval);
    }, []);

    if (!greeting.text) return null;

    return (
        <div className="text-2xl md:text-4xl font-light text-white/90 tracking-wide">
            {greeting.text}, focus seeker. {greeting.emoji}
        </div>
    );
}
