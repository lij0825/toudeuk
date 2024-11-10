import { ContentInfo, MaxClickerInfo, WinnerInfo } from "@/types";
import Image from "next/image";

export default function HistoryItem({ content }: { content: ContentInfo }) {
  return (
    <div className="w-full p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 hover:border-blue-400 active:bg-gray-200 transition-all duration-300 cursor-pointer">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-bold text-gray-800">
          Round {content.clickGameId}
        </h3>
        <p className="text-gray-500 text-sm">
          {new Date(content.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <UserInfo user={content.winner || null} emoji="🏆" />
        <UserInfo user={content.maxClicker || null} emoji="🔥" />
      </div>
    </div>
  );
}

function UserInfo({
  user,
  emoji,
}: {
  user: WinnerInfo | MaxClickerInfo | null;
  emoji: string;
}) {
  return (
    <div className="flex items-center gap-1 text-gray-800">
      <span className="text-xl">{emoji}</span>
      {user ? (
        <>
          <Image
            src={user.profileImg}
            alt={`${user.nickname}'s profile`}
            width={28}
            height={28}
            className="rounded-full object-cover border border-gray-300"
          />
          <div>
            <p className="text-sm font-semibold">{user.nickname}</p>
            <p className="text-xs text-gray-500">Click: {user.clickCount}</p>
          </div>
        </>
      ) : (
        <span className="text-sm text-gray-400">정보 없음</span>
      )}
    </div>
  );
}
