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
        primary: "#216869", // Orange Peel
        secondary: "#49A078", // Hunyadi Yellow
        background: "#DCE1DE", // White
        accentLight: "#9CC5A1", // Mint Green
        accentDark: "#1F2421", // Light Sea Green
        neutral: "#333333", // Dark gray for contrast
        lightNeutral: "#9CC5A1", // Light gray for borders or backgrounds
        darkAccent: "#1F2421", // Darker shade for contrast
      },
    },
  },
  plugins: [],
};

export default config;
