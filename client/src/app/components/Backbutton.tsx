"use client";
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";
import React from "react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // 이전 페이지로 이동
  };

  return (
    <button
      onClick={handleBack}
      className="p-2 rounded-md hover:bg-gray-600 transition flex items-center justify-center "
      style={{
        width: "36px",
        height: "36px",
        backgroundColor: "rgba(185, 202, 255, 0.724)", // 배경색
        color: "#ffffff", // 글씨(이모티콘) 흰색
        fontSize: "24px", // 이모티콘 크기 조정
      }}
      aria-label="뒤로가기"
    >
      {/* 뒤로가기 이모티콘 */}
      <TiArrowBack/>
    </button>
  );
}
