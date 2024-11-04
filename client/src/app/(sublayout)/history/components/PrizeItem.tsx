import { PrizeInfo } from "@/types/prize";
import Link from "next/link";

export default function PrizeItem({ prizeInfo }: { prizeInfo: PrizeInfo }) {
  const { roundId, date, point, participant } = prizeInfo;

  return (
    <div>
      <Link href={`/history/${roundId}`}>
        <div className="w-full py-4">
          {/* Custom Card */}
          <div
            className="w-full relative overflow-hidden rounded-lg shadow-lg text-white bg-opacity-80"
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 60, 90, 0.9) 0%, rgba(15, 30, 50, 0.9) 100%)",
              border: "1px solid rgba(15, 30, 50, 0.8)",
              padding: "16px",
              transition: "transform 0.3s ease",
            }}
          >
            <div className="relative flex flex-col justify-between h-full rounded-lg p-5 hover:scale-105 transition-transform">
              {/* Top Row with Round ID and Nickname */}
              <div className="flex justify-between w-full items-center mb-4">
                {/* Round ID and Points */}
                <p className="text-lg font-semibold tracking-wide">
                  {roundId}회차:{" "}
                  <span className="text-green-400 font-bold">
                    {point.toLocaleString()} pt
                  </span>
                </p>

                {/* Image and Nickname */}
                <div className="flex items-center space-x-3"></div>
              </div>

              {/* Date and Participants */}
              <div className="text-xs w-full flex justify-between mt-2 text-gray-300">
                <p>날짜: {new Date(date).toLocaleDateString()}</p>
                <p>참여 인원: {participant.toLocaleString()}명</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
