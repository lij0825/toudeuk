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
        background: "#17181C", // 검정 배경으로 고정
        foreground: "#FDFDFD", // 흰색 텍스트 색상으로 고정
      },
    },
  },
  plugins: [],
};

export default config;
