import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css,scss}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite", 
        "flicker": "flicker 1.5s infinite alternate", 
      },
      keyframes: {
        flicker: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
