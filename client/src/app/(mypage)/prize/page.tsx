import PrizeList from "./components/PrizeList";

const page = () => {
  return (
    <div className="">
      <section className="typo-title mb-5 flex items-end justify-between">
        <div className="flex items-end">
          <div>
            <p>Prize</p>
            <p>History</p>
          </div>
        </div>
      </section>
      <section className="overflow-y-auto">
        <PrizeList />
      </section>
    </div>
  );
};

export default page;
