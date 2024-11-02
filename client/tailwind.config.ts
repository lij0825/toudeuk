import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { CSSRuleObject } from "tailwindcss/types/config";

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
        foreground: "#0E0E0E", // 검은 텍스트
        customPink: "#FFADFE",
        customGray: "#0033FF",
        primary: "#0068FE", // 밝은 파란색
        secondary: "#004DFF", // 밝은 파란색
        "secondary-2": "#53B3FF", // 하늘색
        accent: "#FFCE8E", // 밝은 주황색
        "accent-2": "#FEDE53", // 밝은 노랑
        "sub-background": "#F7F8F9", // 밝은 회색 배경//sublayout 배경색
        highlight: "#791EF9", // 보라색
        textPrimary: "#17181C", // 기본 텍스트
        border: "#F9F9F9",
      },
      spacing: {
        td: "30px",
        "td-x": "30px",
        "td-y": "2rem",
      },
      fontFamily: {
        gilroy: ["Gilroy", "sans-serif"], // 폰트 패밀리명을 정확히 'gilroy'로 수정
        noto: ["Noto Sans KR", "sans-serif"],
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
          fontSize: "22px",
          lineHeight: "150%",
          fontWeight: theme("fontWeight.light"),
          fontFamily: theme("fontFamily.gilroy"),
        },
        ".typo-sub-title": {
          fontSize: "28px",
          lineHeight: "135%",
          fontWeight: theme("fontWeight.extrabold"),
          fontFamily: theme("fontFamily.gilroy"),
        },
        ".typo-title": {
          fontSize: "34px",
          lineHeight: "135%",
          fontWeight: theme("fontWeight.extrabold"),
          fontFamily: theme("fontFamily.gilroy"),
        },
        ".border-card": {
          borderColor: "#4A505B",
          borderWidth: "2px",
        },
        ".scrollbar-hidden::-webkit-scrollbar": {
          display: "none",
        },
      });
      //컴포넌트 css 등록
      const newComponents: CSSRuleObject = {
        ".bottom-sheet": {
          "padding-top": `${theme("spacing.td-y")}`,
          "padding-bottom": `${theme("spacing.td-y")}`,
          "padding-left": `${theme("spacing.td-x")}`,
          "padding-right": `${theme("spacing.td-x")}`,
          width: "100%",
          height: "100%",
          background: "white",
        },
        ".card": {
          display: "flex",
          alignItems: "center",
          borderRadius: "1rem",
          boxShadow: "0 4px 10px rgba(15, 158, 241, 0.2)", // 밝은 파란색 그림자
          padding: "1rem",
          width: "100%",
          background: "linear-gradient(180deg, #FFCE8E 17.2%, #F3F4F6 117.2%)", // 주황색에서 밝은 회색으로의 그라데이션
          borderWidth: "2px",
          height: "82px",
        },

        ".card-selected": {
          background: "linear-gradient(180deg, #FFCE8E 17.2%, #F3F4F6 117.2%)", // 선택 시에는 조금 더 진한 그라데이션
          borderColor: "#791EF9", // 보라색 테두리
          boxShadow: "0 6px 12px rgba(121, 30, 249, 0.3)", // 보라색 그림자
        },
        ".circle-icon": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: theme("spacing.10"), // 기본 크기 (Tailwind spacing scale 사용)
          height: theme("spacing.10"),
          backgroundColor: theme("colors.gray.200"), // 기본 배경색
          position: "relative",
        },
        ".circle-icon-inner": {
          borderRadius: "50%",
          width: theme("spacing.5"), // 내부 원 크기
          height: theme("spacing.5"),
          backgroundColor: theme("colors.gray.500"), // 기본 내부 원 색상
        },
        ".circle-icon-dot": {
          position: "absolute",
          top: theme("spacing.1"),
          right: theme("spacing.1"),
          width: theme("spacing.2"),
          height: theme("spacing.2"),
          borderRadius: "50%",
          backgroundColor: theme("colors.green.400"), // 기본 작은 원 색상
        },
        ".common-link": {
          backgroundImage:
            "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
          backdropFilter: "blur(16px)",
          boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.1)", // 그림자 방향 조절
          borderRadius: "0.5rem", // Tailwind의 `rounded-lg`와 같은 값
          alignItems: "center",
          transition: "transform 0.15s ease",
        },
        ".common-link-none": {
          padding: "1rem",
          backdropFilter: "blur(16px)",
          borderRadius: "0.5rem", // Tailwind의 `rounded-lg`와 같은 값
          alignItems: "center",
          transition: "transform 0.15s ease",
        },
        ".common-link:active": {
          transform: "scale(0.95)",
        },
        ".common-link-none:active": {
          transform: "scale(0.95)",
        },
        ".history-card": {
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".prize-card": {
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      };

      addComponents(newComponents);
    }),
  ],
};

export default config;
