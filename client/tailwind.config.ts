import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", width: "25%" },
          "100%": { opacity: "1", width: "50%" },
        },
      },
      animation: {
        toastFadeIn: "fadeIn .25s ease-in-out",
      },
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      success: "#2e7d32",
      error: "#d32f2f",
      warning: "#ed6c02",
      gray: {
        200: "#e5e7eb",
        300: "#d1d5db",
        500: "#6b7280",
      },
      primary: {
        50: "#dcdcc3",
        100: "#a8a873",
        200: "#6c701d",
        300: "#374000",
        400: "#292500",
        500: "#1c0800",
        600: "#1d0600",
        700: "#1e0400",
        800: "#200200",
        900: "#220000",
      },
      secondary: {
        50: "#ecf1e7",
        100: "#d0dcc3",
        200: "#afc599",
        300: "#8eb06e",
        400: "#77a24e",
        500: "#60942f",
        600: "#548628",
        700: "#427420",
        800: "#316117",
        900: "#114106",
      },
      tertiary: {
        50: "#f3ece3",
        100: "#dcd0c3",
        200: "#c2b0a0",
        300: "#a6917b",
        400: "#91795f",
        500: "#7c6143",
        600: "#71573c",
        700: "#624a33",
        800: "#543d2a",
        900: "#453020",
      },
      typography: {
        50: "#f7f7f7",
        100: "#eeeeee",
        200: "#e3e3e3",
        300: "#d1d1d1",
        400: "#acacac",
        500: "#8b8b8b",
        600: "#646464",
        700: "#515151",
        800: "#333333",
        900: "#131313",
      },
    },
  },
  plugins: [],
};
export default config;
