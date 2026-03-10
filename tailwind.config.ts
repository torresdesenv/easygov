import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        easyBlue: "#0047AB",
        easyOrange: "#FF8C00",
        slate: {
          900: "#0f172a",
        }
      },
    },
  },
  plugins: [],
};
export default config;