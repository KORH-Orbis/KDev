import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0a0a0a",
          "bg-secondary": "#1a1a2e",
          card: "#16213e",
        },
        light: {
          bg: "#ffffff",
          "bg-secondary": "#f3f4f6",
          card: "#ffffff",
        },
        accent: {
          red: "#e63946",
          "red-hover": "#c1121f",
          "red-light": "#dc2626",
          "red-light-hover": "#b91c1c",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        text: {
          primary: "#e0e0e0",
          secondary: "#a0a0a0",
          "primary-light": "#111827",
          "secondary-light": "#6b7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
