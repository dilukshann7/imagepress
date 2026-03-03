/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,ts,html}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#222222",
          text: "#f0f0f0",
          muted: "#888888",
          subtle: "#bbbbbb",
          dim: "#666666",
          divider: "#444444",
          value: "#999999",
        },
      },
    },
  },
  plugins: [],
};
