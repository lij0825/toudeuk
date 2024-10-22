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
        background: "#202020",  // 검정 배경으로 고정
        foreground: "#ededed",  // 흰색 텍스트 색상으로 고정
      },
    },
  },
  plugins: [],
};

export default config;
