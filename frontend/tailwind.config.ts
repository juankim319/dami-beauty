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
        // Blush / dusty-rose palette — hince.co.kr signature tone
        dami: {
          50:  "#FDFAF9",   // warm blush white — page background
          100: "#F7EFED",   // very light blush surface
          200: "#EDE0DC",   // soft pink-gray border
          300: "#D9C4BF",   // muted rose / placeholder
          400: "#C4A09A",   // secondary text / soft rose
          500: "#A67C76",   // medium rose body text
          600: "#8A5E59",   // deeper rose
          700: "#6B3F3C",   // primary text (dark rose)
          800: "#4A2422",   // headings
          900: "#2A1412",   // near-black with rose undertone (footer)
        },
        // Direct brand accent (same rose family, bolder)
        brand: {
          DEFAULT: "#C4706A",
          light:   "#F7EFED",
          muted:   "#D9C4BF",
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
        dami: "0px",
      },
      boxShadow: {
        soft: "0 8px 40px rgba(42, 20, 18, 0.08)",
        card: "0 2px 12px rgba(42, 20, 18, 0.05)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
