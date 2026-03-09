import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LAWZEN — Focus & Productivity Dashboard",
  description:
    "A cozy digital workspace for deep focus. Pomodoro timer, task manager, ambient sounds, and beautiful themes.",
  keywords: ["productivity", "pomodoro", "focus", "study", "timer", "ambient"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
