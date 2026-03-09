export interface Theme {
    id: string;
    name: string;
    emoji: string;
    gradient: string;
    bgUrl?: string; // Optional background image URL
    accent: string;
    accentGlow: string;
    textPrimary: string;
    textSecondary: string;
    glassBg: string;
    glassBorder: string;
}

export const themes: Theme[] = [
    {
        id: "cozy-cafe",
        name: "Cozy Café",
        emoji: "☕",
        bgUrl: "/themes/cozy_cafe_bg_1773078108666.png",
        gradient: "radial-gradient(circle at top right, #ffb347 0%, transparent 40%), radial-gradient(circle at bottom left, #ffcc33 0%, transparent 40%), linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #4a2810 100%)",
        accent: "#ffcc33",
        accentGlow: "0 0 40px rgba(255, 204, 51, 0.4)",
        textPrimary: "#FFF8F0",
        textSecondary: "rgba(255, 248, 240, 0.8)",
        glassBg: "rgba(20, 10, 5, 0.5)",
        glassBorder: "rgba(255, 204, 51, 0.2)",
    },
    {
        id: "dark-minimal",
        name: "Dark Minimal",
        emoji: "🌑",
        gradient: "radial-gradient(circle at top left, #2a2a4a 0%, transparent 40%), radial-gradient(circle at bottom right, #111122 0%, transparent 50%), linear-gradient(135deg, #0a0a0a 0%, #161622 50%, #050505 100%)",
        accent: "#6366f1",
        accentGlow: "0 0 50px rgba(99, 102, 241, 0.5)",
        textPrimary: "#f8f9fa",
        textSecondary: "rgba(248, 249, 250, 0.6)",
        glassBg: "rgba(10, 10, 15, 0.6)",
        glassBorder: "rgba(99, 102, 241, 0.15)",
    },
    {
        id: "ocean-sunset",
        name: "Ocean Sunset",
        emoji: "🌅",
        bgUrl: "/themes/ocean_sunset_bg_1773078124957.png",
        gradient: "radial-gradient(circle at center top, #ff7e5f 0%, transparent 50%), radial-gradient(circle at bottom left, #feb47b 0%, transparent 40%), linear-gradient(135deg, #101030 0%, #201040 50%, #ff6b6b 100%)",
        accent: "#feb47b",
        accentGlow: "0 0 50px rgba(254, 180, 123, 0.5)",
        textPrimary: "#ffffff",
        textSecondary: "rgba(255, 255, 255, 0.8)",
        glassBg: "rgba(20, 15, 40, 0.5)",
        glassBorder: "rgba(254, 180, 123, 0.2)",
    },
    {
        id: "rainy-city",
        name: "Rainy City",
        emoji: "🌧️",
        gradient: "radial-gradient(ellipse at top, #34495e 0%, transparent 50%), radial-gradient(circle at bottom right, #1b2631 0%, transparent 50%), linear-gradient(135deg, #17202a 0%, #212f3d 50%, #17202a 100%)",
        accent: "#85c1e9",
        accentGlow: "0 0 40px rgba(133, 193, 233, 0.4)",
        textPrimary: "#ecf0f1",
        textSecondary: "rgba(236, 240, 241, 0.7)",
        glassBg: "rgba(15, 20, 25, 0.6)",
        glassBorder: "rgba(133, 193, 233, 0.15)",
    },
    {
        id: "forest-cabin",
        name: "Forest Cabin",
        emoji: "🌲",
        bgUrl: "/themes/forest_cabin_bg_1773078147237.png",
        gradient: "radial-gradient(circle at top left, #2ecc71 0%, transparent 40%), radial-gradient(circle at bottom right, #f1c40f 0%, transparent 30%), linear-gradient(135deg, #0b2e13 0%, #144520 50%, #061a0b 100%)",
        accent: "#2ecc71",
        accentGlow: "0 0 50px rgba(46, 204, 113, 0.4)",
        textPrimary: "#f1f8e9",
        textSecondary: "rgba(241, 248, 233, 0.8)",
        glassBg: "rgba(5, 15, 5, 0.6)",
        glassBorder: "rgba(46, 204, 113, 0.2)",
    },
    {
        id: "neon-night",
        name: "Neon Night",
        emoji: "🌃",
        bgUrl: "/themes/neon_night_bg_1773078167349.png",
        gradient: "radial-gradient(circle at top right, #f00 0%, transparent 30%), radial-gradient(circle at bottom left, #00f 0%, transparent 30%), linear-gradient(135deg, #090909 0%, #1a0b2e 50%, #110517 100%)",
        accent: "#ff00ff",
        accentGlow: "0 0 50px rgba(255, 0, 255, 0.6)",
        textPrimary: "#f3e5f5",
        textSecondary: "rgba(243, 229, 245, 0.8)",
        glassBg: "rgba(10, 5, 20, 0.6)",
        glassBorder: "rgba(255, 0, 255, 0.25)",
    },
];

export function getThemeById(id: string): Theme {
    return themes.find((t) => t.id === id) || themes[1]; // default to dark minimal
}
