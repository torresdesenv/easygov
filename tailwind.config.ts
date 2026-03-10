import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Varre todos os arquivos dentro de src
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
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