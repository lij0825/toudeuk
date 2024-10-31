import HistoryList from "./components/HistoryList";

export default function HistoryPage() {
  return (
    <div className="flex flex-col h-full scrollbar-hidden">
      <section className="flex-shrink-0 flex items-end">
        <div className="typo-title mb-2 z-10">
          <p>Game</p>
          <p>History</p>
        </div>
      </section>
      <section className="flex-grow overflow-hidden">
        <HistoryList />
      </section>
    </div>
  );
}
