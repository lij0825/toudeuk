import PrizeList from "./components/PrizeList";

const Page = () => {
  return (
    <div className="flex flex-col h-full scrollbar-hidden">
      <section className="flex-shrink-0 flex items-end">
        <div className="typo-title mb-2 z-10">
          <p>My</p>
          <p>Prize</p>
        </div>
      </section>
      <section className="flex-grow overflow-hidden ">
        <PrizeList />
      </section>
    </div>
  );
};

export default Page;
