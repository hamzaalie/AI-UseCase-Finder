import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f7f3ec",
        ink: "#1a1714",
        muted: "#6b6258",
        accent: "#e1542a",     // warm vermilion — primary action / "Start here"
        easy: "#2f7d57",       // green — Quick Wins / DIY
        structure: "#1f3a5f",  // deep blue — Bigger Projects
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "720px",
      },
    },
  },
  plugins: [],
};

export default config;
