import Image from "next/image";
import { WinnerInfo } from "@/types";

function WinnerInfoCard({ user }: { user: WinnerInfo }) {
  return (
    <div className="relative flex items-center p-3 mb-3 border border-transparent rounded-md winner-card-bg shadow-lg transition-all w-full min-h-[100px]">
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
          <span>🏆</span>
          <span>{user.clickCount}</span>
        </div>
        <div className="text-xs text-gray-500">Winner</div>
      </div>

      <style jsx>{`
        .winner-card-bg {
          background: linear-gradient(
            135deg,
            #ffd700,
            #ffb800,
            #00ffd5,
            /* 초록 계열 */ #ff8c00,
            #ff00d4,
            #ffaf00
          );
          background-size: 400% 400%;
          animation: winner-hologram-animation 8s ease-in-out infinite;
          box-shadow: 0px 4px 16px rgba(255, 223, 0, 0.8),
            0px 0px 24px rgba(255, 140, 0, 0.6);
        }
        @keyframes winner-hologram-animation {
          0% {
            background-position: 0% 50%;
            box-shadow: 0px 4px 16px rgba(255, 223, 0, 0.8),
              0px 0px 24px rgba(255, 140, 0, 0.6);
          }
          10% {
            background-position: 20% 80%;
            box-shadow: 0px 4px 20px rgba(72, 209, 204, 0.7),
              0px 0px 32px rgba(255, 215, 0, 0.8);
          }
          40% {
            background-position: 100% 50%;
            box-shadow: 0px 4px 24px rgba(0, 191, 255, 0.8),
              0px 0px 36px rgba(255, 215, 0, 0.9);
          }
          70% {
            background-position: 50% 0%;
            box-shadow: 0px 4px 20px rgba(255, 105, 180, 0.8),
              0px 0px 30px rgba(255, 182, 193, 0.7);
          }
          100% {
            background-position: 0% 50%;
            box-shadow: 0px 4px 16px rgba(255, 223, 0, 0.8),
              0px 0px 24px rgba(255, 140, 0, 0.6);
          }
        }
      `}</style>
    </div>
  );
}

export default WinnerInfoCard;
