import Image from "next/image";
import { GameUserInfo } from "@/types";

export default function MiddleRewardInfo({ user }: { user: GameUserInfo }) {
  return (
    <div className="flex items-center p-2 mb-3 border border-gray-300 rounded-md">
      <Image
        src={user.profileImg}
        alt={`${user.nickname}'s profile`}
        width={40}
        height={40}
        className="rounded-full mr-3"
      />
      <div>
        <div className="font-medium text-gray-800 text-sm">{user.nickname}</div>
        <div className="text-xs">Click Count: {user.clickCount}</div>
      </div>
    </div>
  );
}


