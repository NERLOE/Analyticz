const colors = require("tailwindcss/colors");
const { getDefaultCompilerOptions } = require("typescript");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: colors.zinc,
        zinc: colors.dark
      },
    },
  },
  plugins: [],
};
