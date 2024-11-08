// HistoryItem 컴포넌트는 앞서 정의한 대로 사용
import {
  DetailContentInfo,
  WinnerInfo,
  MaxClickerInfo,
  GameUserInfo,
} from "@/types";

export default function HistoryItem({
  content,
}: {
  content: DetailContentInfo;
}) {
  return (
    <div className="p-4 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-700">
          Round {content.round}
        </h3>
        <p className="text-gray-400 text-sm">
          {new Date(content.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <UserInfo user={content.winner || null} emoji="🏆" label="Winner" />
        <UserInfo
          user={content.maxClicker || null}
          emoji="🔥"
          label="Top Clicker"
        />
      </div>

      <div className="mb-3">
        <h4 className="text-md font-semibold text-gray-600 mb-1">
          Middle Reward Users
        </h4>
        <div className="flex flex-wrap gap-2">
          {content.middleRewardUsers.map((user) => (
            <UserBadge key={user.nickname} user={user} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-600 mb-1">
          All Participants
        </h4>
        <div className="flex flex-wrap gap-2">
          {content.allUsers.map((user) => (
            <UserBadge key={user.nickname} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserInfo({
  user,
  emoji,
  label,
}: {
  user: WinnerInfo | MaxClickerInfo | null;
  emoji: string;
  label: string;
}) {
  if (!user) return null;
  return (
    <div className="flex items-center gap-1">
      <span className="text-xl">{emoji}</span>
      <div>
        <p className="font-medium text-gray-700">{user.nickname}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function UserBadge({ user }: { user: GameUserInfo }) {
  return (
    <div className="px-2 py-1 bg-gray-100 text-sm text-gray-700 rounded-full border border-gray-300">
      {user.nickname}
    </div>
  );
}
