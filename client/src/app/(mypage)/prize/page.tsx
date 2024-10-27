import PrizeList from "./components/PrizeList";

const page = () => {
  return (
    <div>
      <section className="typo-title mb-5 flex items-end">
        <div>
          <p>Prize</p>
          <p>History</p>
        </div>
      </section>
      <div className="flex-grow overflow-auto">
        <PrizeList />
      </div>
    </div>
  );
};

export default page;
