import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.black,
        secondary: colors.white,
        tertiary: "#E5E5E5",
        "light-gray": "#F6F5F5",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
