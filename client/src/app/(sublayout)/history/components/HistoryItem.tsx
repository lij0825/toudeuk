import { ContentInfo } from "@/types";

export default function HistoryItem(content: ContentInfo) {
  return (
    <div className="content-item">
      <h3>Round {content.round}</h3>
      <p>content ID: {content.clickGameId}</p>
      <p>
        Winner: {content.winner.nickname} (Click Count:{" "}
        {content.winner.clickCount})
      </p>
      <p>
        Max Clicker: {content.maxClicker.nickname} (Click Count:{" "}
        {content.maxClicker.clickCount})
      </p>
      <p>content Date: {new Date(content.createdAt).toLocaleString()}</p>
    </div>
  );
}
