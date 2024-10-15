import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF9F1C", // Orange Peel
        secondary: "#FFBF69", // Hunyadi Yellow
        background: "#FFFFFF", // White
        accentLight: "#CBF3F0", // Mint Green
        accentDark: "#2EC4B6", // Light Sea Green
        neutral: "#333333", // Dark gray for contrast
        lightNeutral: "#E0E0E0", // Light gray for borders or backgrounds
        darkAccent: "#262626", // Darker shade for contrast
      },
    },
  },
  plugins: [],
};

export default config;
