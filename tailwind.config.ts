import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "32px", // 2rem - Extreme rounding for cards
        md: "24px", // 1.5rem
        sm: "12px", // 0.75rem
        pill: "50px", // For buttons
      },
      colors: {
        background: "#FFE4F0", // Soft Blush
        foreground: "#8B0A50", // Deep Burgundy
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.7)",
          foreground: "#8B0A50",
        },
        popover: {
          DEFAULT: "#FFE4F0",
          foreground: "#8B0A50",
        },
        primary: {
          DEFAULT: "#FF69B4", // Hot Pink
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFE4F0",
          foreground: "#FF69B4",
        },
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.5)",
          foreground: "#8B0A50",
        },
        accent: {
          DEFAULT: "#FFD700", // Warm Yellow (Gold)
          foreground: "#8B0A50",
        },
        destructive: {
          DEFAULT: "#FF4500",
          foreground: "#FFFFFF",
        },
        border: "rgba(255, 105, 180, 0.3)", // Subtle Pink Border
        input: "rgba(255, 255, 255, 0.5)",
        ring: "#FF69B4",
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
        sans: ["Quicksand", "Fredoka", "sans-serif"], // Rounded fonts
        serif: ["Quicksand", "serif"], // Fallback to Quicksand for consistency
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
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px #FF69B4", transform: "scale(1)" },
          "50%": { boxShadow: "0 0 20px #FFD700", transform: "scale(1.05)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
