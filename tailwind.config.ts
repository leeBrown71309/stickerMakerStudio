import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        pureBackground: "#0D001A",
        lightBackground: "#231d2f",
        "gradient-start": "#c44a50",
        "gradient-end": "#faebe9",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        "pink-dark": {
          extend: "dark", // <- inherit default values from dark theme
          colors: {
            background: "#0A0020",
            foreground: "#ffffff",
            primary: {
              50: "#fdf4f3",
              100: "#faebe9",
              200: "#f6d7d5",
              300: "#eeb6b3",
              400: "#e38b89",
              500: "#d55e5e",
              600: "#c44a50",
              700: "#a12f38",
              800: "#872a34",
              900: "#742732",
              //950: "#401116",
              DEFAULT: "#c44a50",
              foreground: "#ffffff",
            },
            focus: "#d55e5e",
          },
        },
      },
    }),
  ],
};
export default config;
