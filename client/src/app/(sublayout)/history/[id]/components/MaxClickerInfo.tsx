import Image from "next/image";
import { MaxClickerInfo } from "@/types";

function MaxClickerInfoCard({ user }: { user: MaxClickerInfo }) {
  return (
    <div className="relative flex items-center p-3 mb-3 border border-transparent rounded-md clicker-card-bg shadow-lg w-full min-h-[100px]">
      <Image
        src={user.profileImg}
        alt={`${user.nickname}'s profile`}
        width={40}
        height={40}
        className="rounded-full mr-3 border border-white shadow-sm"
      />
      <div>
        <div className="font-medium text-gray-800 text-sm">{user.nickname}</div>
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <span>🖱️</span>
          <span>{user.clickCount}</span>
        </div>
        <div className="text-xs text-gray-500">Max Clicker</div>
      </div>

      <style jsx>{`
        .clicker-card-bg {
          background: linear-gradient(
            135deg,
            #ffe0b2,
            #ffcc80,
            #ffab91,
            #ff8a65,
            #ff7043,
            #ffe0b2
          );
          background-size: 300% 300%;
          animation: clicker-card-animation 14s ease-in-out infinite;
          box-shadow: 0px 4px 12px rgba(255, 138, 101, 0.4),
            0px 0px 20px rgba(255, 87, 34, 0.4);
        }
        @keyframes clicker-card-animation {
          0% {
            background-position: 0% 50%;
            box-shadow: 0px 4px 12px rgba(255, 193, 138, 0.4),
              0px 0px 16px rgba(255, 183, 77, 0.4);
          }
          50% {
            background-position: 100% 50%;
            box-shadow: 0px 4px 18px rgba(255, 112, 67, 0.5),
              0px 0px 24px rgba(255, 138, 101, 0.5);
          }
          100% {
            background-position: 0% 50%;
            box-shadow: 0px 4px 12px rgba(255, 193, 138, 0.4),
              0px 0px 16px rgba(255, 87, 34, 0.4);
          }
        }
      `}</style>
    </div>
  );
}

export default MaxClickerInfoCard;
