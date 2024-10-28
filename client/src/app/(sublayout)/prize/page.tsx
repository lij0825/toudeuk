import PrizeList from "./components/PrizeList";

const Page = () => {
  return (
    <div className="">
      <section className="flex items-end">
        <div className="typo-title mb-5 z-10 ">
          <p>Prize</p>
          <p>History</p>
        </div>
      </section>
      <div className="h-screen overflow-hidden">
        <div className="h-full overflow-auto scrollbar-hide">
          <PrizeList />
        </div>
      </div>
    </div>
  );
};

export default Page;
