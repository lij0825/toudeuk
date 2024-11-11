"use client";

import { ROUTE_URL } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { CUSTOM_ICON } from "@/constants/customIcons";
import dynamic from "next/dynamic";

const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  { ssr: false }
);

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false); // 네비게이션 바 표시 상태
  const navRef = useRef<HTMLDivElement | null>(null); // 네비게이션 바 참조
  const buttonRef = useRef<HTMLButtonElement | null>(null); // 햄버거 버튼 참조

  // '/mygifticon' 및 '/gifticon' 자체는 제외하고, 하위 경로가 있는 경우 항상 고정
  const isFixedVisible = /^(\/mygifticon\/.+|\/gifticon\/.+)$/.test(
    pathname || ""
  );

  useEffect(() => {
    // 특정 경로일 때 Navbar를 항상 표시 상태로 유지
    if (isFixedVisible) {
      setIsVisible(true);
    }
  }, [isFixedVisible]);

  // 햄버거 버튼 및 네비게이션 바 스타일 상수
  const buttonPositionClasses =
    pathname === ROUTE_URL.GAME
      ? "left-1/2 transform -translate-x-1/2 bg-gray-800 text-white shadow-lg"
      : "right-4 bg-white text-gray-800 shadow-lg";

  const hamburgerLineClasses = `block w-5 h-0.5 mb-1 transition-all duration-300 ${
    pathname === ROUTE_URL.GAME ? "bg-white" : "bg-gray-800"
  }`;

  const navClasses = `pb-1 font-noto z-50 absolute bottom-0 inset-x-0 w-full mx-auto flex gap-10 items-end justify-center border-t border-gray-200 gap-1 shadow-xl transition-transform transition-opacity duration-300 ${
    isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
  } ${
    pathname === ROUTE_URL.GAME
      ? "bg-gray-500/90 backdrop-blur-md text-white border-gray-400"
      : "bg-white text-gray-800"
  }`;

  // 햄버거 버튼 클릭 시 네비게이션 바 표시/숨기기 토글
  const toggleNavbar = () => {
    // 특정 경로일 때는 toggle 기능이 작동하지 않도록
    if (!isFixedVisible) {
      setIsVisible((prev) => !prev);
    }
  };

  // 네비게이션 바 외부 클릭 시 숨기기
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        if (!isFixedVisible) {
          setIsVisible(false);
        }
      }
    },
    [isFixedVisible]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

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
        className={`absolute bottom-4 p-3 rounded-xl z-50 transition-opacity duration-300 ${buttonPositionClasses} ${
          isVisible ? "hidden" : "block"
        }`}
        style={{
          boxShadow:
            pathname === ROUTE_URL.GAME
              ? "0px 4px 12px rgba(0, 0, 0, 0.3)"
              : "0px 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="flex flex-col justify-between h-5">
          <span className={hamburgerLineClasses}></span>
          <span className={hamburgerLineClasses}></span>
          <span className={hamburgerLineClasses}></span>
        </div>
      </button>

      {/* 네비게이션 바 */}
      <nav
        ref={navRef}
        className={navClasses}
        style={{ willChange: "transform, opacity" }}
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
              width={45}
              height={40}
              cursor="pointer"
            />
            <span className="text-xs">게임</span>
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
              width={40}
              height={40}
            />
            <span className="text-xs">기록</span>
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
              width={45}
              height={45}
            />
            <span className="text-xs">기프티콘</span>
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
              width={45}
              height={45}
            />
            <span className="text-xs">마이</span>
          </a>
        </div>
      </nav>
    </>
  );
}
