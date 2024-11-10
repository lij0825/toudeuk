import {
  DetailContentInfo,
} from "@/types";

export default function HistoryDetailItem({
  content,
}: {
  content: DetailContentInfo;
}) {
  return (
    <div className="p-3 rounded-md bg-white border border-gray-300 hover:border-gray-400 transition-colors duration-300">
          {content.clickGameId} • {content.nickname} • {content.clickOrder}
      
        <p className="text-gray-400 text-xs">
          {new Date(content.createdAt).toLocaleString()}
        </p>
    </div>
  );
}

