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
        // Pure neutral gray — exactly hince.co.kr color system
        dami: {
          50:  "#FFFFFF",   // pure white
          100: "#F5F5F5",   // page background / light surface
          200: "#E5E5E5",   // borders / dividers
          300: "#C4C4C4",   // placeholder / muted elements
          400: "#9B9B9B",   // secondary text
          500: "#767676",   // body text (lighter)
          600: "#4A4A4A",   // body text
          700: "#333333",   // primary text
          800: "#1A1A1A",   // headings / dark surfaces
          900: "#0D0D0D",   // near-black (footer, emphasis)
        },
        // Brand accent — used only for small highlights (cart badge, etc.)
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
        dami: "0px",
      },
      boxShadow: {
        soft: "0 8px 40px rgba(0, 0, 0, 0.08)",
        card: "0 2px 12px rgba(0, 0, 0, 0.05)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
