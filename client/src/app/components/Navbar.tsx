"use client";

import { ROUTE_URL } from "@/constants/routes";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { CUSTOM_ICON } from "@/constants/customIcons";
import dynamic from "next/dynamic";
import Reindeer from "./Reindeer";

const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  { ssr: false }
);

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const isFixedVisible = /^(\/mygifticon\/.+|\/gifticon\/.+|\/toudeuk)$/.test(
    pathname || ""
  );

  useEffect(() => {
    if (isFixedVisible) {
      setIsVisible(true);
    }
  }, [isFixedVisible]);

  const buttonPositionClasses =
    pathname === ROUTE_URL.GAME
      ? "left-1/2 transform -translate-x-1/2 bg-gray-800 text-white shadow-lg"
      : "right-4 bg-white text-gray-800 shadow-lg";

  const hamburgerLineClasses = `block w-5 h-0.5 mb-1 transition-all duration-300 ${
    pathname === ROUTE_URL.GAME ? "bg-white" : "bg-gray-800"
  }`;

  const navClasses = `pb-4 font-noto absolute bottom-0 inset-x-0 w-full mx-auto flex gap-10 items-end justify-center border-t border-gray-200 gap-1 shadow-xl transition-transform transition-opacity duration-300 ${
    isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
  } ${
    pathname === ROUTE_URL.GAME
      ? "bg-gradient-to-b from-[rgba(180,185,200,0.4)] via-[rgba(99, 83, 80, 0.35)] to-[rgba(140,140,140,0.3)] backdrop-blur-md text-white border-white/20"
      : "bg-white text-gray-800"
  }`;

  const toggleNavbar = () => {
    if (!isFixedVisible) {
      setIsVisible((prev) => !prev);
    }
  };

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

  if (pathname === ROUTE_URL.HOME || pathname === ROUTE_URL.LOGIN_LOADING) {
    return null;
  }

  return (
    <>
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

      <nav
        ref={navRef}
        className={navClasses}
        style={{ willChange: "transform, opacity", zIndex: 122 }}
      >
        {pathname === ROUTE_URL.GAME && (
          <div className="absolute top-[-90px] w-full">
            <Reindeer />
          </div>
        )}

        {[
          ROUTE_URL.GAME,
          ROUTE_URL.HISTORY,
          ROUTE_URL.GIFTICON_SHOP,
          ROUTE_URL.MYPAGE,
        ].map((route, index) => (
          <div
            key={index}
            className={`flex flex-col items-end justify-center text-center ${
              pathname === route ? "" : ""
            }`}
          >
            <a
              href={route}
              onClick={(e) => {
                if (pathname === route) {
                  e.preventDefault(); // 현재 경로에서는 클릭 방지
                }
              }}
              className={`flex flex-col items-center ${
                pathname === route ? "pointer-events-none" : ""
              }`}
              style={{
                textDecoration: "none",
                zIndex: 50,
                cursor: pathname === route ? "not-allowed" : "pointer",
              }}
            >
              <LottieAnimation
                animationData={
                  route === ROUTE_URL.GAME
                    ? CUSTOM_ICON.gamecontroller
                    : route === ROUTE_URL.HISTORY
                    ? CUSTOM_ICON.history
                    : route === ROUTE_URL.GIFTICON_SHOP
                    ? CUSTOM_ICON.ticket1
                    : CUSTOM_ICON.profile
                }
                loop={1}
                width={45}
                height={45}
              />
              <span className="text-xs mt-1">
                {route === ROUTE_URL.GAME
                  ? "게임"
                  : route === ROUTE_URL.HISTORY
                  ? "기록"
                  : route === ROUTE_URL.GIFTICON_SHOP
                  ? "기프티콘"
                  : "마이"}
              </span>
            </a>
          </div>
        ))}
      </nav>
    </>
  );
}
