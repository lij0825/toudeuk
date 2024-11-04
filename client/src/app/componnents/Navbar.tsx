"use client";

import { ROUTE_URL } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CUSTOM_ICON } from "@/constants/customIcons";
import LottieAnimation from "./LottieAnimation";
import HistoryPage from "./../(sublayout)/history/page";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false); // 네비게이션 바 표시 상태
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement | null>(null); // 네비게이션 바 참조
  const buttonRef = useRef<HTMLButtonElement | null>(null); // 햄버거 버튼 참조

  // 햄버거 버튼 및 네비게이션 바 스타일 상수
  const buttonPositionClasses =
    pathname === ROUTE_URL.GAME
      ? "left-1/2 transform -translate-x-1/2 bg-gray-800 text-white shadow-lg"
      : "right-4 bg-white text-gray-800 shadow-lg";

  const hamburgerLineClasses = `block w-6 h-0.5 mb-1 transition-all duration-300 ${
    pathname === ROUTE_URL.GAME ? "bg-white" : "bg-gray-800"
  }`;

  const navClasses = `font-noto absolute bottom-0 inset-x-0 w-full px-8 pb-2 pt-1 flex justify-between gap-1 items-end border-t border-gray-200 shadow-xl transition-transform transition-opacity duration-300 ${
    isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
  } ${
    pathname === ROUTE_URL.GAME
      ? "bg-gray-800 text-white"
      : "bg-white text-gray-800"
  }`;

  // 햄버거 버튼 클릭 시 네비게이션 바 표시/숨기기 토글
  const toggleNavbar = () => {
    setIsVisible((prev) => !prev);
  };

  // 네비게이션 바 외부 클릭 시 숨기기
  const handleClickOutside = (event: MouseEvent) => {
    if (
      navRef.current &&
      !navRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 특정 경로에서 네비게이션 바 숨기기
  if (pathname === ROUTE_URL.HOME || pathname === ROUTE_URL.LOGIN_LOADING) {
    return null;
  }

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={toggleNavbar}
        ref={buttonRef}
        className={`absolute bottom-4 p-3 rounded-md z-40 transition-opacity duration-300 ${buttonPositionClasses} ${
          isVisible ? "opacity-0" : "opacity-100"
        }`}
        style={{
          boxShadow:
            pathname === ROUTE_URL.GAME
              ? "0px 4px 12px rgba(0, 0, 0, 0.3)"
              : "0px 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <span className={hamburgerLineClasses}></span>
        <span className={hamburgerLineClasses}></span>
        <span className={hamburgerLineClasses}></span>
      </button>

      {/* 네비게이션 바 */}
      <nav
        ref={navRef}
        className={navClasses}
        style={{ zIndex: 40, willChange: "transform, opacity" }}
      >
        <div className="flex flex-col items-end justify-center text-center ">
          <a
            href={ROUTE_URL.GAME}
            className="flex flex-col items-center"
            style={{ textDecoration: "none" }}
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.gamecontroller}
              loop={1}
              width={50}
              height={50}
            />
            <span className="text-sm">게임</span>
          </a>
        </div>
        <div className="flex flex-col items-end justify-center text-center ">
          <a
            href={ROUTE_URL.HISTORY}
            className="flex flex-col items-center"
            style={{ textDecoration: "none" }}
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.history}
              loop={1}
              width={45}
              height={45}
            />
            <span className="text-sm">기록</span>
          </a>
        </div>
        <div className="flex flex-col items-end justify-center text-center">
          <a
            href={ROUTE_URL.RANK}
            className="flex flex-col items-center"
            style={{ textDecoration: "none" }}
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.trophy}
              loop={1}
              width={50}
              height={50}
            />
            <span className="text-sm">랭킹</span>
          </a>
        </div>
        <div className="flex flex-col items-end justify-center text-center">
          <a
            href={ROUTE_URL.GIFTICON_SHOP}
            className="flex flex-col items-center"
            style={{ textDecoration: "none" }}
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.ticket1}
              loop={1}
              width={50}
              height={50}
            />
            <span className="text-sm">기프티콘</span>
          </a>
        </div>
        <div className="flex flex-col items-end justify-center text-center">
          <a
            href={ROUTE_URL.MYPAGE}
            className="flex flex-col items-center"
            style={{ textDecoration: "none" }}
          >
            <LottieAnimation
              animationData={CUSTOM_ICON.profile}
              loop={1}
              width={50}
              height={50}
            />
            <span className="text-sm">마이</span>
          </a>
        </div>
      </nav>
    </>
  );
}
