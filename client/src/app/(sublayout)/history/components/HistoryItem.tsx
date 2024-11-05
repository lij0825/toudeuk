import { ContentInfo, MaxClickerInfo, WinnerInfo } from "@/types";
import Image from "next/image";

export default function HistoryItem({ content }: { content: ContentInfo }) {
  return (
    <div className="p-3 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-700">
          Round {content.round}
        </h3>
        <p className="text-gray-400 text-sm">
          {new Date(content.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-4">
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
    <div className="flex items-center gap-2 text-gray-800">
      <span className="text-xl">{emoji}</span>
      {user ? (
        <>
          <Image
            src={user.profileImg}
            alt={`${user.nickname}'s profile`}
            width={24}
            height={24}
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
