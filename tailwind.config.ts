import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        inter: "var(--font-inter)",
      },
      colors: {
        "m-near-black": "#1C1C1C",
        "m-purple": "#511CF7",
        "m-green": "#C2F71C",
        "m-disabled": "#BDBDBD",
        "m-red": "#F93A36",
        "m-orange": "#FF7347",
        "m-yellow": "#FFBE3C",
        "m-light-grey": "#F5F5F5",
        "m-grey": "#E5E5E5",
        "m-dark-grey": "#ACACAC",
        "m-darker-grey": "#8C8C8C",
      },
    },
  },
  plugins: [],
} satisfies Config;
