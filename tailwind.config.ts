import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        inter: "var(--font-inter)",
      },
      colors: {
        "m-disabled": "#979DAF",
        "m-dark-gray": "#8C8C8C",
        "m-green": "#17A98F",
        "m-purple": "#4B1FED",
        "m-red": "#FF525B",
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /(text|bg|border)-(m-disabled|m-dark-gray|m-green|m-purple|m-red)/,
      variants: ["hover"],
    },
  ],
} satisfies Config;
