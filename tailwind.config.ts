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
        "m-blue": "#0038FF",
        "m-light-blue": "#EFF2FE",
      },
    },
    boxShadow: {
      container: "0px 4.8px 2px 0px #1F26D826, 0px 0px 16.7px 0px #5673DB1A",
      "custom-shadow": "0px 2px 2px 0px rgba(205, 205, 205, 0.25)",
      add: "4px 4px 8px 1px #8C8C8C",
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /(text|bg|border)-(m-disabled|m-dark-gray|m-green|m-purple|m-red|m-blue|m-light-purple|m-light-gray|m-light-blue|black)/,
      variants: ["hover"],
    },
  ],
} satisfies Config;
