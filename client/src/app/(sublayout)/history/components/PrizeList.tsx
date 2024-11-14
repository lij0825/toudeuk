import Link from "next/link";
import useGetUserRewardLogs from "@/apis/gifticon/useGetUserRewardLogs";
import { PrizeInfo, RewardType } from "@/types";

export default function PrizeList() {
  const { data: rewards } = useGetUserRewardLogs();

  const getTypeInKorean = (type: RewardType) => {
    switch (type) {
      case RewardType.MAX_CLICKER:
        return { text: "최다 클릭", color: "text-red-500" };
      case RewardType.WINNER:
        return { text: "최종 우승", color: "text-blue-500" };
      case RewardType.SECTION:
        return { text: "중간 보상", color: "text-orange-400" };
      case RewardType.NON:
        return { text: "보상 없음", color: "text-gray-500" };
      case RewardType.FIRST:
        return { text: "최초 클릭", color: "text-green-500" };
      default:
        return { text: "보상 없음", color: "text-black" };
    }
  };

  // 총 당첨 금액과 횟수 계산
  const totalAmount =
    rewards?.reduce((acc, reward) => acc + reward.reward, 0) || 0;
  const totalCount = rewards?.length || 0;

  return (
    <section className="overflow-y-auto h-full rounded-lg scrollbar-hidden">
      {/* 총 당첨 금액과 횟수 표시 */}
      <div className="icon-description flex justify-center mb-6">
        <div className="flex items-center mr-6">
          <span role="img" aria-label="Trophy" className="text-lg mr-1">
            🟡
          </span>
          <span className="text-gray-600 font-semibold">{totalAmount}원</span>
        </div>
        <div className="flex items-center">
          <span role="img" aria-label="Fire" className="text-lg mr-1">
            💖
          </span>
          <span className="text-gray-600 font-semibold">
            Total {totalCount}회
          </span>
        </div>
      </div>

      <section className="h-full">
        {rewards?.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg shadow-inner justify-center text-gray-600 font-noto h-full bg-gray-200">
            <div className="mb-4 text-lg">당첨 내역이 없습니다.</div>
            <Link
              href="/toudeuk"
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200"
            >
              게임하러 가기
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {rewards?.map((reward: PrizeInfo, index: number) => {
              const { text, color } = getTypeInKorean(reward.rewardType);
              const isWinner = reward.rewardType === RewardType.WINNER;

              return (
                <li
                  key={index}
                  className={`py-2 px-4 rounded-lg border transition-all duration-200 ${
                    isWinner
                      ? "bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 text-white hover:shadow-xl border-transparent"
                      : "bg-white border-gray-200 hover:bg-gray-100 hover:border-blue-400"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div
                      className={`text-lg font-bold ${
                        isWinner ? "text-gray-900" : "text-gray-800"
                      }`}
                    >
                      Round {reward.clickGameId}
                    </div>
                    <div
                      className={`text-md font-semibold ${
                        isWinner ? "text-gray-900" : "text-gray-800"
                      }`}
                    >
                      {reward.reward}원
                    </div>
                    <div
                      className={`text-base text-md font-semibold ${
                        isWinner ? "text-yellow-200" : color
                      }`}
                    >
                      {text}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}
