/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}", // if you read MD files
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};