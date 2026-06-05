import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lightning: {
          50: "#fff5f5",
          100: "#ffe0e0",
          200: "#ffc0c0",
          300: "#ff9090",
          400: "#ff5050",
          500: "#ff0033",
          600: "#e0002e",
          700: "#c00028",
          800: "#a00022",
          900: "#80001c",
        },
        dark: {
          50: "#f0f0f0",
          100: "#d6d6d6",
          200: "#adadad",
          300: "#848484",
          400: "#5b5b5b",
          500: "#323232",
          600: "#282828",
          700: "#1e1e1e",
          800: "#141414",
          900: "#0a0a0a",
          950: "#050505",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "3d": "0 10px 40px -10px rgba(255, 0, 51, 0.2), 0 0 0 1px rgba(255, 0, 51, 0.1) inset",
        "3d-lg": "0 20px 60px -10px rgba(255, 0, 51, 0.3), 0 0 0 1px rgba(255, 0, 51, 0.15) inset",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        neon: "0 0 10px rgba(255, 0, 51, 0.5), 0 0 20px rgba(255, 0, 51, 0.3), 0 0 40px rgba(255, 0, 51, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
