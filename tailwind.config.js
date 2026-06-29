/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d1b3d",
        "primary-light": "rgba(0, 53, 26, 0.15)",
        secondary: "#1E3ABA",
        "secondary-light": "rgba(0, 161, 78, 0.15)",
        accent: "#10B981",
        "accent-light": "rgba(255, 165, 0, 0.15)",
        light: "#22D3EE",
        dark: "#0D1B3D",
        "dark-light": "rgba(0, 53, 26, 0.15)",
      },
    },
  },
  plugins: [],
};
