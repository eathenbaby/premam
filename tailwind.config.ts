import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
        pill: "50px",
      },
      colors: {
        background: "#FFF9F0",
        foreground: "#3D1C1C",
        card: {
          DEFAULT: "#FDFAF5",
          foreground: "#3D1C1C",
        },
        popover: {
          DEFAULT: "#FFF9F0",
          foreground: "#3D1C1C",
        },
        primary: {
          DEFAULT: "#8B1A1A",
          foreground: "#FFF9F0",
        },
        secondary: {
          DEFAULT: "#E8C4C4",
          foreground: "#6B0F1A",
        },
        muted: {
          DEFAULT: "#F5ECD7",
          foreground: "#8B7355",
        },
        accent: {
          DEFAULT: "#A3785F",
          foreground: "#FFF9F0",
        },
        destructive: {
          DEFAULT: "#6B0F1A",
          foreground: "#FFF9F0",
        },
        border: "rgba(139, 26, 26, 0.15)",
        input: "#FAF0E6",
        ring: "#8B1A1A",
        ink: {
          DEFAULT: "#2C1810",
          light: "#8B7355",
        },
        paper: "#FDFAF5",
        burgundy: {
          DEFAULT: "#8B1A1A",
          dark: "#6B0F1A",
          wine: "#722F37",
        },
        blush: {
          DEFAULT: "#D4A5A5",
          light: "#E8C4C4",
          dark: "#C19A9A",
        },
        parchment: {
          DEFAULT: "#FFF9F0",
          aged: "#F5ECD7",
          warm: "#FAF0E6",
        },

        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Cormorant Garamond", "serif"],
        body: ["Lora", "serif"],
        ui: ["DM Sans", "sans-serif"],
        script: ["Dancing Script", "cursive"],
        serif: ["Lora", "serif"],
        mono: ["monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "breathe": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "gentle-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 4s ease-in-out infinite",
        "breathe": "breathe 5s ease-in-out infinite",
        "gentle-spin": "gentle-spin 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
