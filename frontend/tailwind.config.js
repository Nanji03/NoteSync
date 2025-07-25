/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gta: ["'Pricedown'", "sans-serif"],
      },
      colors: {
        gtaBlack: "#1a1a1a",
        gtaGreen: "#2ecc71",
        gtaRed: "#e74c3c",
        gtaYellow: "#f1c40f",
        gtaWhite: "#ecf0f1",
        gtaAccent: "#00ffcc",
      },
      boxShadow: {
        gta: "0 0 15px rgba(0, 255, 204, 0.5)",
      },
      // backgroundImage: {
      //   'gta-bg': "url('/images/gta-background.jpg')", // you can replace with actual image
      // },
    },
  },
  plugins: [],
};
