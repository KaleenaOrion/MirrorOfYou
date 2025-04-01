/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',    // purple
        accent: '#F472B6',     // pink
        soft: '#F3F4F6',       // light gray
      },
    },
  },
  plugins: [],
}
