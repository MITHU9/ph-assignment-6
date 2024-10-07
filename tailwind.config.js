/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E7A81",
      },
    },
  },
  plugins: [require("daisyui")],
};
