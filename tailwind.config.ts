import type { Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      colors: {
        theme: "#202125",
        hover: "#F8F8F8",
        theme2: "#F7F7F7"

      }
    },
    screens: {
      ph: "520px",
      sm: "640px",
      md: "768px",
      wl: "896px",
      lg: "1024px",
      ll: "1152px",
      xl: "1280px",
      "2xl": "1536px"
    }
  },
  plugins: [nextui()]
};

export default config;
