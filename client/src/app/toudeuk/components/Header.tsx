import React from "react";
import Image from "next/image";
import { UserPartialInfo } from "@/types";

interface HeaderProps {
  userInfo?: Partial<UserPartialInfo> | null;
  myRank: number;
  latestClicker: string;
}

const Header = ({ userInfo, myRank, latestClicker }: HeaderProps) => (
  <section className="w-full flex p-5 christmas-background">
    <div className="flex-grow flex text-green-100 items-center justify-center">
      <div>
        {userInfo?.profileImg ? (
          <div className="w-6 h-6 overflow-hidden rounded-full mr-2 border border-green-200/40">
            <Image
              src={userInfo.profileImg}
              width={40}
              height={40}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <Image
            src="/default_profile.jpg"
            width={50}
            height={50}
            alt="Profile"
            className="rounded-full border border-green-200/40"
          />
        )}
      </div>
      <div className="font-bold text-sm text-green-50 flex items-center">
        <span className="mr-2 whitespace-nowrap">내 현재 랭킹</span>
        <div className="w-12 text-center flex-shrink-0">
          {myRank === 0 ? "" : myRank}
        </div>
      </div>
    </div>
    <div className="flex-grow flex text-green-50 items-center justify-center">
      {/* 라벨 */}
      <div className="font-bold text-sm whitespace-nowrap mr-2">
        마지막 클릭자
      </div>
      {/* 클릭자 이름 */}
      <div
        className="w-24 text-center overflow-hidden whitespace-nowrap text-ellipsis"
        title={
          latestClicker === "NONE" ? "-" : latestClicker || "클릭자가 없습니다"
        }
        /* title 속성으로 전체 텍스트 표시 */
      >
        {latestClicker === "NONE" ? "-" : latestClicker || "클릭자가 없습니다"}
      </div>
    </div>
    <style jsx>{`
      .christmas-background {
        background: radial-gradient(
          circle,
          rgba(25, 41, 88, 0.9),
          rgba(82, 43, 39, 0.8),
          rgba(87, 67, 20, 0.7)
        );
        background-size: 200% 200%;
        animation: shine 20s ease-in-out infinite;
      }
      @keyframes shine {
        0%,
        100% {
          background-position: 0% 100% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
    `}</style>
  </section>
);

export default Header;
