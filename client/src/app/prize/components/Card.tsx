import { PrizeInfo } from "@/types/prize";
import Link from "next/link";
import Image from "next/image";

export default function Card({ prizeInfo }: { prizeInfo: PrizeInfo }) {
  const { roundId, date, point, nickName, participant, imageSrc } = prizeInfo;

  return (
    <div>
      <Link href={`/prize/${roundId}`}>
        <div className="w-full py-4 bg-gray-50">
          {/* Custom Card */}
          <div className="w-full relative overflow-hidden rounded-xl bg-white shadow-md">
            {/* Card content */}
            <div className="relative z-10 flex flex-col justify-between h-full border border-gray-200 rounded-xl p-4">
              {/* Top Row with Round ID and Nickname */}
              <div className="flex justify-between w-full items-center">
                {/* Round ID and Points */}
                <p className="text-gray-900 text-lg font-semibold">
                  {roundId}회차:{" "}
                  <span className="text-blue-600 font-bold">
                    {point.toLocaleString()} pt
                  </span>
                </p>

                {/* Image and Nickname */}
                <div className="flex items-center space-x-3">
                  <Image
                    src={imageSrc}
                    width={40}
                    height={40}
                    objectFit="cover"
                    alt="profile image"
                    className="rounded-full border border-gray-300"
                  />
                  <p className="text-gray-800 font-medium text-base">
                    {nickName}
                  </p>
                </div>
              </div>

              {/* Date and Participants */}
              <div className="text-gray-600 text-sm w-full flex justify-between mt-4">
                <p>날짜: {date}</p>
                <p>참여 인원: {participant.toLocaleString()}명</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
