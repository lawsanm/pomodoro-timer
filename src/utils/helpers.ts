export function getGreeting(): { text: string; emoji: string } {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: "Good morning", emoji: "☀️" };
    if (hour >= 12 && hour < 17) return { text: "Good afternoon", emoji: "🌤" };
    if (hour >= 17 && hour < 21) return { text: "Good evening", emoji: "🌙" };
    return { text: "Night owl mode", emoji: "🦉" };
}

export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
}

export function getTodayKey(): string {
    return new Date().toISOString().split("T")[0];
}

export function getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function getLast7Days(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split("T")[0]);
    }
    return days;
}
