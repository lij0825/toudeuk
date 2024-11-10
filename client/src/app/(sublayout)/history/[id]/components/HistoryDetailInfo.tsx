import Image from "next/image";
import { DetailContentInfo } from "@/types";

export default function HistoryDetailItem({
  content,
}: {
  content: DetailContentInfo;
}) {
  return (
    <div className="p-2 border-b border-gray-200 flex items-center justify-between">
      {/* 왼쪽: 프로필 이미지, 클릭 순서 및 닉네임 */}
      <div className="flex items-center space-x-3">
        <Image
          src={content.profileImg}
          alt={`${content.nickname}'s profile`}
          width={36}
          height={36}
          className="rounded-full border border-gray-300"
        />
        <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
          <span className="text-gray-600 text-xs">{content.clickOrder}</span>
          <span>{content.nickname}</span>
        </div>
      </div>

      {/* 날짜 */}
      <div className="text-gray-400 text-xs">
        {new Date(content.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
