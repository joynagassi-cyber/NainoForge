import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./packages/extension/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          dark: "#6D28D9",
          darkest: "#5B21B6",
        },
        "accent-warm": "#F59E0B",
        surface: {
          base: "#0A0A0F",
          "1": "#12101C",
          "2": "#1A1726",
          "3": "#201D2E",
        },
        "text-primary": "#F0F2F5",
        "text-muted": "#A5A0B8",
        "text-disabled": "#5E5A6E",
        "border-subtle": "rgba(255,255,255,0.08)",
        "border-default": "rgba(255,255,255,0.14)",
        "state-forged": "#22C55E",
        "state-leech": "#EF4444",
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["26px", { lineHeight: "1.25", fontWeight: "700" }],
        h1: ["20px", { lineHeight: "1.25", fontWeight: "600" }],
        h2: ["18px", { lineHeight: "1.25", fontWeight: "600" }],
        h3: ["16px", { lineHeight: "1.25", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["11px", { lineHeight: "1.5", fontWeight: "500" }],
        mono: ["12px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        space: {
          1: "4px",
          2: "8px",
          3: "12px",
          4: "16px",
          5: "20px",
          6: "24px",
          7: "32px",
          8: "40px",
          9: "48px",
          10: "64px",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.35)",
        elevated: "0 4px 14px rgba(0,0,0,0.45)",
      },
      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.01em",
        normal: "0",
        wide: "0.01em",
        wider: "0.05em",
      },
      maxWidth: {
        "panel": "400px",
        "popover": "480px",
      },
      zIndex: {
        base: "0",
        overlay: "100",
        toast: "200",
        modal: "300",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
