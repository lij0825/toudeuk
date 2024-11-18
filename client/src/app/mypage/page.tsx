import dynamic from "next/dynamic";
import { MypageList, GifticonSwipe } from "./components";
import UserInfoItem from "./components/UserInfoItem"; //svg 파일 임포트문으로 인한 에러 방지를 위해 별도 import

const RecentHistoriesCarousel = dynamic(
  () => import("./components/RecentHistorySwipe"),
  { ssr: false }
);

export default function Mypage() {
  return (
    <div className="bg-sub-background h-full flex flex-col overflow-y-auto scrollbar-hidden">
      <section className="bg-white p-8 flex-shrink-0">
        <UserInfoItem />
      </section>
      <section className="p-1 flex-shrink-0"></section>
      <section className="bg-white h-full flex-grow pb-8 pt-2 flex flex-col">
        <section className="flex-shrink-0">
          <GifticonSwipe />
          <div className="px-8">
            <RecentHistoriesCarousel />
          </div>
        </section>
        <section className="py-2 pb-4 px-8 flex-grow h-full">
          <MypageList />
        </section>
        <section className="p-1 flex-shrink-0 h-[62px]"></section>
      </section>
    </div>
  );
}
