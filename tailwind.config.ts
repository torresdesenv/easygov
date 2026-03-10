import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Garante que ele olhe dentro de src/app
  ],
  theme: {
    extend: {
      colors: {
        easyBlue: "#0047AB",
        easyOrange: "#FF8C00",
      },
    },
  },
  plugins: [],
};
export default config;