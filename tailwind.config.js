/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.jsx",
    "./*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5b8fd",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        neon: {
          purple: "#a855f7",
          blue: "#3b82f6",
          cyan: "#06b6d4",
          green: "#10b981",
          pink: "#ec4899",
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.15) 0%, transparent 50%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        "glow-gradient":
          "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99,102,241,0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(99,102,241,0.9), 0 0 80px rgba(168,85,247,0.4)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 30px rgba(99,102,241,0.5)",
        "glow-cyan": "0 0 30px rgba(6,182,212,0.5)",
        "glow-purple": "0 0 30px rgba(168,85,247,0.5)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};
