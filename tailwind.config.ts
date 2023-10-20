import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        inter: "var(--font-inter)",
      },
      colors: {
        "near-black": "#1C1C1C",
        "m-purple": "#511CF7",
        "m-disabled": "#979DAF",
        "m-red": "#FF525B",
        "m-subtitle": "#878FAA",
      },
    },
  },
  plugins: [],
} satisfies Config;
