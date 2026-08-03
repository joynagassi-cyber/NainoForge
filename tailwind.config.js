"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    darkMode: "class",
    content: ["./packages/extension/src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Background
                background: "#141313",
                "on-background": "#e5e2e1",
                // Surface elevation
                "surface-lowest": "#0e0e0e",
                "surface-low": "#1c1b1b",
                surface: "#201f1f",
                "surface-high": "#2a2a2a",
                "surface-highest": "#353434",
                "surface-variant": "#353434",
                "surface-dim": "#141313",
                "surface-bright": "#3a3939",
                // Text
                "on-surface": "#e5e2e1",
                "on-surface-variant": "#c4c7c8",
                "inverse-surface": "#e5e2e1",
                "inverse-on-surface": "#313030",
                // Outline
                outline: "#8e9192",
                "outline-variant": "#444748",
                "surface-tint": "#c6c6c7",
                // Primary (white accent)
                primary: {
                    DEFAULT: "#ffffff",
                    foreground: "#2f3131",
                    container: "#e2e2e2",
                    "on-container": "#636565",
                    inverse: "#5d5f5f",
                },
                // Secondary
                secondary: {
                    DEFAULT: "#cac6c5",
                    foreground: "#313030",
                    container: "#484646",
                    "on-container": "#b8b4b4",
                    fixed: "#e6e1e1",
                    "fixed-dim": "#cac6c5",
                    "on-fixed": "#1c1b1b",
                    "on-fixed-variant": "#484646",
                },
                // Tertiary (reserved)
                tertiary: {
                    DEFAULT: "#ffffff",
                    foreground: "#342f2d",
                    container: "#eae1dd",
                    "on-container": "#696360",
                    fixed: "#eae1dd",
                    "fixed-dim": "#cec5c1",
                    "on-fixed": "#1f1b19",
                    "on-fixed-variant": "#4b4643",
                },
                // Error
                error: {
                    DEFAULT: "#ffb4ab",
                    foreground: "#690005",
                    container: "#93000a",
                    "on-container": "#ffdad6",
                },
                // Primary fixed
                "primary-fixed": "#e2e2e2",
                "primary-fixed-dim": "#c6c6c7",
                "on-primary-fixed": "#1a1c1c",
                "on-primary-fixed-variant": "#454747",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
            },
            fontSize: {
                display: ["2.625rem", { lineHeight: "1.15", fontWeight: "400", letterSpacing: "-0.02em" }],
                h1: ["2rem", { lineHeight: "1.20", fontWeight: "400", letterSpacing: "-0.01em" }],
                h2: ["1.5rem", { lineHeight: "1.25", fontWeight: "400" }],
                h3: ["1.125rem", { lineHeight: "1.35", fontWeight: "500", letterSpacing: "-0.01em" }],
                "body-lg": ["1rem", { lineHeight: "1.65", fontWeight: "300", letterSpacing: "-0.005em" }],
                body: ["0.875rem", { lineHeight: "1.60", fontWeight: "300" }],
                "body-sm": ["0.75rem", { lineHeight: "1.50", fontWeight: "500", letterSpacing: "0.05em" }],
                code: ["0.8125rem", { lineHeight: "1.70", fontWeight: "400" }],
            },
            spacing: {
                xxs: "4px",
                xs: "8px",
                sm: "12px",
                md: "16px",
                lg: "24px",
                xl: "32px",
                "2xl": "48px",
                "3xl": "64px",
            },
            borderRadius: {
                sm: "0.125rem",
                DEFAULT: "0.25rem",
                md: "0.375rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px",
            },
            animation: {
                shimmer: "shimmer 1.5s ease-in-out infinite",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            maxWidth: {
                panel: "400px",
                popover: "480px",
                content: "720px",
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
exports.default = config;
//# sourceMappingURL=tailwind.config.js.map