"use client";

import { useState, useEffect } from "react";
import { getRandomQuote } from "@/utils/quotes";

export default function Quote() {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        setQuote(getRandomQuote());
    }, []);

    return (
        <div
            className="max-w-lg text-center text-lg md:text-xl italic text-white/70 font-light cursor-pointer transition-all hover:text-white/90"
            onClick={() => setQuote(getRandomQuote())}
            title="Click for a new quote"
        >
            &ldquo;{quote}&rdquo;
        </div>
    );
}
