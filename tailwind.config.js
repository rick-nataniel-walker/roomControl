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
        "dark-light": "rgba(0, 53, 26, 1)",
        royalBlue: "rgba(30, 58, 186, 1)",
        teal: "rgba(14, 165, 183, 1)",
        liteCyan: "rgba(34, 211, 238, 1)",
        emerald: "rgba(16, 185, 129, 1)",
        goldAccent: "rgba(212, 175, 55, 1)",
        lightgray: "rgba(242, 244, 247, 1)",
        mediumGray: "rgba(148, 163, 184, 1)",
        lightVariants: {
          royalBlue: "rgba(30, 58, 186, 0.1)",
          teal: "rgba(14, 165, 183, 0.1)",
          liteCyan: "rgba(34, 211, 238, 0.1)",
          emerald: "rgba(16, 185, 129, 0.1)",
          goldAccent: "rgba(212, 175, 55, 0.1)",
          lightgray: "rgba(242, 244, 247, 0.1)",
          mediumGray: "rgba(148, 163, 184, 0.1)",
        },
      },
      screens: {
        tablet: "768px", // => @media (min-width: 480px) { ... }
      },
    },
  },
  plugins: [],
};
