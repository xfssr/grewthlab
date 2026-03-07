/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--bg-base)",
          elevated: "var(--bg-elevated)",
          inverse: "var(--bg-inverse)",
        },
        surface: {
          base: "var(--surface-base)",
          muted: "var(--surface-muted)",
          inverse: "var(--surface-inverse)",
        },
        text: {
          primary: "var(--text-primary)",
          muted: "var(--text-muted)",
          soft: "var(--text-soft)",
          inverse: "var(--text-inverse)",
        },
        accent: {
          primary: "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
          soft: "var(--accent-soft)",
        },
        stroke: {
          subtle: "var(--stroke-subtle)",
          strong: "var(--stroke-strong)",
          inverse: "var(--stroke-inverse)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        panel: "var(--shadow-panel)",
        glow: "var(--shadow-glow)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
