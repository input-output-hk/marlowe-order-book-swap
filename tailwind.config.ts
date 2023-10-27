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
        "m-light-purple": "#F8F6FF",
        "m-light-gray": "#F2F6FC",
        "m-purple": "#4B1FED",
        "m-red": "#FF525B",
      },
    },
    boxShadow: {
      "custom-shadow": "0px 2px 2px 0px rgba(205, 205, 205, 0.25)",
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /(text|bg|border)-(m-disabled|m-dark-gray|m-green|m-purple|m-red|m-light-purple|m-light-gray)/,
      variants: ["hover"],
    },
  ],
} satisfies Config;
