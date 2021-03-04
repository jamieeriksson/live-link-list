module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ["Roboto", "sans-serif"],
        title: ["Oswald", "sans-serif"],
      },
      colors: {
        "primary-blue": "#3354A9",
        "primary-red": "#C75151",
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
