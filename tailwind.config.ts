import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        inter: "var(--font-inter)",
      },
      colors: {
        "m-light-purple": "#F8F6FF",
      },
    },
  },
  plugins: [],
} satisfies Config;
