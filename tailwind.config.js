const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.pink.400"),
              fontWeight: theme("font.bold"),
              textDecoration: "none",
              "&:hover": {
                color: theme("colors.pink.400"),
                textDecoration: "underline",
              },
            },
          },
        },
      }),
      colors: {
        gray: { ...colors.zinc, 750: "#333338" },
        zinc: colors.gray,
      },
      animation: {
        "fade-in": "fade-in .2s ease-out",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
