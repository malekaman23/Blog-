/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10151F",
        ink2: "#1A2335",
        ink3: "#232E44",
        paper: "#F7F4ED",
        paper2: "#EEE8D8",
        card: "#FFFFFF",
        ink900: "#15181F",
        muted: "#5C5A4F",
        line: "#E1DAC5",
        accent: "#A8311F",
        "accent-soft": "#F3DCD4",
        accent2: "#B9811E",
        "accent2-soft": "#F1E3C3",
      },
      fontFamily: {
        display: ["'Fraunces'", "'Source Serif 4'", "Georgia", "serif"],
        body: ["'Work Sans'", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },
      maxWidth: {
        prose: "70ch",
      },
    },
  },
  plugins: [],
};
