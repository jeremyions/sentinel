import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Clean white / silver surfaces with near-black ink.
        canvas: "#ffffff",
        surface: "#f7f8fa",
        surfaceAlt: "#eef1f4",
        border: "#e4e7ec",
        borderStrong: "#d3d8e0",
        ink: "#0b0d10",
        muted: "#5b6470",
        faint: "#949ba6",
        accent: "#0b0d10",
        // Severity / status, tuned to read well on white.
        high: "#d64545",
        medium: "#bd7b12",
        low: "#1f9d6b",
        up: "#1f9d6b",
        down: "#d64545",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 13, 16, 0.04), 0 1px 3px rgba(11, 13, 16, 0.06)",
        sidebar: "1px 0 0 rgba(11, 13, 16, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
