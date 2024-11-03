import { ContentInfo } from "@/types";

interface HistoryItemProps {
  content: ContentInfo;
}

export default function HistoryItem({ content }: HistoryItemProps) {
  return (
    <div
      className="content-item p-3 rounded-lg shadow-md mb-3 flex flex-col justify-start text-white"
      style={{
        background:
          "linear-gradient(98deg, rgba(0, 64, 77, 0.8) -18.39%, rgba(0, 30, 77, 0.8) 113.18%)",
        strokeWidth: "2px",
        transition: "background-color 0.3s ease, opacity 0.3s ease",
        stroke: "rgba(0, 48, 58, 0.7)",
      }}
    >
      <h3 className="text-lg font-semibold mb-1">Round {content.round}</h3>
      <div className="flex flex-col gap-1 text-sm font-noto">
        <p>
          <span className="font-semibold">우승자</span>{" "}
          {content.winner.nickname}{" "}
          <span className="text-gray-300">
            (Click Count: {content.winner.clickCount})
          </span>
        </p>
        <p>
          <span className="font-semibold">최다 클릭자</span>{" "}
          {content.maxClicker.nickname}{" "}
          <span className="text-gray-300">
            (Click Count: {content.maxClicker.clickCount})
          </span>
        </p>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Content Date: {new Date(content.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
