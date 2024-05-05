/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1870px",
      },
      colors: {
        "primary-text": "#292929",
        darkback: "#1e2126",
      },
    },
    fontFamily: {
      'sans': ['Quicksand', 'Sans-serif']
    }
  },
  plugins: [],
}

