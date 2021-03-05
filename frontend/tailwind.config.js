const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    options: {
      safelist: [
        "bg-indigo-800",
        "bg-indigo-900",
        "text-indigo-700",
        "border-indigo-700",
        "from-indigo-300",
        "bg-pink-800",
        "bg-pink-900",
        "text-pink-700",
        "border-pink-700",
        "from-pink-300",
        "bg-red-800",
        "bg-red-900",
        "text-red-700",
        "border-red-700",
        "from-red-300",
        "bg-blue-800",
        "bg-blue-900",
        "text-blue-700",
        "border-blue-700",
        "from-blue-300",
        "bg-purple-800",
        "bg-purple-900",
        "text-purple-700",
        "border-purple-700",
        "from-purple-300",
      ],
    },
  },
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
