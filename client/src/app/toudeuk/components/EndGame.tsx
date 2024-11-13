import { HistoryRewardInfo } from "@/types";

interface EndGameProps {
  remainingTime: number;
  remainingMilliseconds: number;
  reward: HistoryRewardInfo;
  gameId: number;
}

export default function EndGame({remainingTime, remainingMilliseconds, reward, gameId}: EndGameProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-md" style={{ zIndex: 100 }}>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center border border-opacity-20 border-white max-w-sm mx-2">
              <p className="text-white font-semibold text-lg mb-2">
                다음 라운드까지
              </p>
              <p className="text-white text-2xl font-bold mb-4">
                {remainingTime} 초 {remainingMilliseconds}
              </p>

              {reward && (
                <>
                  <p className="text-white text-lg font-semibold mb-2">{gameId}라운드</p>
                  <p className="text-white mb-2"><span className="font-bold">최다 클릭:</span> {reward?.maxClicker?.nickname}</p>
                  <p className="text-white mb-2"><span className="font-bold">마지막 클릭:</span> {reward?.winner?.nickname}</p>

                  <div className="text-white text-lg font-semibold mt-4 mb-2">
                    중간 보상자
                  </div>

                  <ul className="text-white text-sm space-y-2">
                    <li><span className="font-semibold">첫번째 클릭:</span> {reward?.firstClicker?.nickname}</li>
                    {reward?.middleRewardUsers?.map((user, index) => (
                      <li key={index}>
                        <span className="font-semibold">{user.clickCount}번째 클릭:</span> {user.nickname}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
  )
}
