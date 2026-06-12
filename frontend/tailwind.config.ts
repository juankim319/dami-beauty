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
        // Warm neutral palette — white base, charcoal dark (hince-inspired)
        dami: {
          50:  "#FAFAF8",   // warm white — page background
          100: "#F4F3F0",   // very light warm surface
          200: "#E5E3DE",   // borders / dividers
          300: "#C8C5BC",   // muted / placeholder
          400: "#8F8C84",   // secondary text
          500: "#6B6860",   // body text (lighter)
          600: "#4A4740",   // body text
          700: "#2D2B26",   // primary text / dark button
          800: "#1A1916",   // headings
          900: "#0F0E0C",   // near-black (footer, dark surfaces)
        },
        // Brand accent — burgundy used only for small highlights
        brand: {
          DEFAULT: "#8B1A4A",
          light:   "#F5D0DE",
          muted:   "#D48BA3",
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
        soft: "0 8px 40px rgba(26, 25, 22, 0.10)",
        card: "0 2px 12px rgba(15, 14, 12, 0.06)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
