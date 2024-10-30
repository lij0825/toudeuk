import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
        customPink: "#FFADFE",
        customGray: "#0033FF",
        "color-1": "#17181C",
        "color-2": "#0F9EF1",
        "color-3": "#015796",
        "color-4": "#424750",
        "color-5": "#791EF9",
        //gray톤 card용
        "card-dark": "#16171B",
        "card-light": "#353A40",
        "card-border": "#4A505B",
      },
      spacing: {
        td: "30px",
        "td-x": "40px",
        "td-y": "50px",
      },
      fontFamily: {
        gilroy: ["Gilroy"], // 폰트 패밀리명을 정확히 'gilroy'로 수정
        sans: ["sans-serif"],
      },
      fontWeight: {
        light: "300",
        extrabold: "800",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addComponents, theme }) {
      addUtilities({
        ".typo-body": {
          fontSize: "18px",
          lineHeight: "150%",
          fontWeight: theme("fontWeight.light"),
          fontFamily: theme("fontFamily.gilroy"),
        },
        ".typo-sub-title": {
          fontSize: "30px",
          lineHeight: "135%",
          fontWeight: theme("fontWeight.extrabold"),
          fontFamily: theme("fontFamily.gilroy"),
        },
        ".typo-title": {
          fontSize: "40px",
          lineHeight: "135%",
          fontWeight: theme("fontWeight.extrabold"),
          fontFamily: theme("fontFamily.gilroy"),
        },
        ".bg-gradient-card": {
          background: "linear-gradient(180deg, #353A40 17.2%, #16171B 117.2%)",
        },
        ".border-card": {
          borderColor: "#4A505B",
          borderWidth: "2px",
        },
      });
      //컴포넌트 css 등록
      const newComponents = {
        ".bottom-sheet": {
          "background-color": `${theme("colors.color-2")}`,
          "padding-top": `${theme("spacing.td-y")}`,
          "padding-bottom": `${theme("spacing.td-y")}`,
          "padding-left": `${theme("spacing.td-x")}`,
          "padding-right": `${theme("spacing.td-x")}`,
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #4b4f58 0%, #16171B 100%)",
        },
        ".card": {
          display: "flex",
          alignItems: "center",
          borderRadius: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          width: "100%",
          background: "linear-gradient(180deg, #252A30 17.2%, #16171B 117.2%)",
          borderColor: "#4A505B",
          borderWidth: "2px",
          height: "82px",
        },
      };

      addComponents(newComponents);
    }),
  ],
};

export default config;
