import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dami: {
          50:  "#FDF2F6",
          100: "#FCE7EF",
          200: "#F5D0DE",
          300: "#E8A8BE",
          400: "#C4617A",
          500: "#BE185D",
          600: "#9D174D",
          700: "#831843",
          800: "#701A37",
          900: "#4A0E23",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      borderRadius: {
        dami: "2px",
      },
      boxShadow: {
        soft: "0 8px 40px rgba(131, 24, 67, 0.15)",
        card: "0 2px 12px rgba(74, 14, 35, 0.08)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
