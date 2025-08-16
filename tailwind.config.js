/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4E6B3B",
        secondary1: "#C5E0D8",
        secondary2: "#B89685",
        accent: "#41658A",
        neutralDark: "#03120E",
        neutralLight: "#FFFFFF",
        beige: "#FCEDE5",
      },
    },
  },
  plugins: [],
};
