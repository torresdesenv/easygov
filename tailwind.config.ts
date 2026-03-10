import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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