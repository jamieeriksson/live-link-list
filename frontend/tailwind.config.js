const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ["Source Sans Pro", "sans-serif"],
        title: ["Oswald", "sans-serif"],
      },
      colors: {
        "primary-blue": "#3354A9",
        "primary-red": "#C75151",
        gray: colors.gray,
        indigo: {
          300: "#A5B4FC",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
      },
    },
  },
  variants: {
    extend: {
      fontWeight: ["hover"],
    },
  },
  plugins: [],
};
