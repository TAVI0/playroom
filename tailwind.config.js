/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        win95: {
          face: "#c0c0c0",
          dark: "#808080",
          darker: "#404040",
          light: "#ffffff",
          light2: "#dfdfdf",
          navy: "#000080",
          navylight: "#1084d0",
          desktop: "#008080",
        },
      },
      fontFamily: {
        win95: ['"Tahoma"', '"MS Sans Serif"', '"Segoe UI"', "sans-serif"],
      },
    },
  },
  plugins: [],
}
