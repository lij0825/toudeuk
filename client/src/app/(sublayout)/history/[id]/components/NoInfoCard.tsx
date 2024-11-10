import React from "react";

interface NoInfoCardProps {
  icon?: string; // 기본 이모티콘
  title: string; // 카드 제목
  message?: string; // 정보가 없을 때 표시할 메시지
  className?: string; // 추가적인 클래스
}

function NoInfoCard({
  icon = "❓",
  title,
  message = "정보가 없습니다",
  className = "", // 기본 빈 문자열
}: NoInfoCardProps) {
  return (
    <div
      className={`relative flex items-center justify-center p-3 mb-3 border border-transparent rounded-md no-info-card-bg transition-all min-h-[100px] ${className}`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center text-gray-600 text-2xl mb-1">
          {icon}
        </div>
        <div className="font-medium text-gray-800 text-sm">{title}</div>
        <div className="text-xs text-gray-600">{message}</div>
      </div>

      <style jsx>{`
        .no-info-card-bg {
          background: linear-gradient(
            135deg,
            #d1d1d1,
            #e0e0e0,
            #ffffff,
            #dcdcdc,
            #f3f3f3,
            #d1d1d1
          );
          background-size: 300% 300%;
          animation: noinfo-hologram-animation 4s ease infinite;
        }
        @keyframes noinfo-hologram-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}

export default NoInfoCard;
