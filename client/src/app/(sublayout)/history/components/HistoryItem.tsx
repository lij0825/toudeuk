import { ContentInfo } from "@/types";

interface HistoryItemProps {
  content: ContentInfo;
}

export default function HistoryItem({ content }: HistoryItemProps) {
  return (
    <div
      className="content-item p-4 rounded-lg shadow-md mb-4 flex flex-col justify-start text-white"
      style={{
        background:
          "linear-gradient(98deg, rgba(0, 64, 77, 0.7) -18.39%, rgba(0, 30, 77, 0.7) 113.18%)",
        strokeWidth: "2px",
        transition: "background-color 0.3s ease, opacity 0.3s ease",
        stroke: "rgba(0, 48, 58, 0.7)",
      }}
    >
      <h3 className="text-xl font-semibold mb-2">Round {content.round}</h3>
      <p className="mb-1">Content ID: {content.clickGameId}</p>
      <p className="mb-1">
        Winner: {content.winner.nickname} (Click Count:{" "}
        {content.winner.clickCount})
      </p>
      <p className="mb-1">
        Max Clicker: {content.maxClicker.nickname} (Click Count:{" "}
        {content.maxClicker.clickCount})
      </p>
      <p className="text-sm text-gray-300">
        Content Date: {new Date(content.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
