import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        molt: {
          bg: "var(--molt-bg)",
          surface: "var(--molt-surface)",
          card: "var(--molt-card)",
          border: "var(--molt-border)",
          "border-light": "var(--molt-border-light)",
          text: "var(--molt-text)",
          muted: "var(--molt-muted)",
          accent: "#a855f7",
          cyan: "#06b6d4",
          green: "#22c55e",
          amber: "#f59e0b",
          red: "#ef4444",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.1)" },
          "50%": { boxShadow: "0 0 30px rgba(168, 85, 247, 0.2)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
