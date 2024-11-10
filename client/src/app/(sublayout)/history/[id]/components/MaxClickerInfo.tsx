import Image from "next/image";
import { MaxClickerInfo } from "@/types";

function MaxClickerInfoCard({ user }: { user: MaxClickerInfo }) {
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
        <div className="text-xs text-gray-500">Max Clicker</div>
      </div>
    </div>
  );
}

export default MaxClickerInfoCard;
