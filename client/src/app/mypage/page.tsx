import dynamic from "next/dynamic";
import GifticonSwipe from "./components/GifticonSwipe";
import MypageList from "./components/MypageList";
import UserInfoItem from "./components/UserInfoItem";

const RecentHistoriesCarousel = dynamic(
  () => import("./components/RecentHistorySwipe"),
  { ssr: false }
);

export default function Mypage() {
  return (
    <div className="bg-sub-background h-full flex flex-col">
      <section className="bg-white">
        <section className="px-8 pt-8 pb-1 flex-shrink-0">
          <UserInfoItem />
        </section>
        <GifticonSwipe />
      </section>
      <section className="p-1 flex-shrink-0"></section>
      <section className="bg-white h-full flex-grow py-2 pt-2 flex flex-col">
        <section className="py-2 flex-shrink-0 px-8">
          <RecentHistoriesCarousel />
        </section>
        <section className="py-2 pb-2 px-8 flex-grow h-full">
          <MypageList />
        </section>
      </section>
    </div>
  );
}
