import GifticonSwipe from "./components/GifticonSwipe";
import MypageList from "./components/MypageList";
import UserInfoItem from "./components/UserInfoItem";

export default function Mypage() {
  return (
    <div className="bg-sub-background h-full flex flex-col">
      <section className="bg-white p-8 flex-shrink-0">
        <UserInfoItem />
      </section>
      <section className="p-2 flex-shrink-0"></section>
      <section className="bg-white h-full flex-grow py-4 flex flex-col">
        <section className="flex-shrink-0">
          <GifticonSwipe />
        </section>
        <section className="pt-2 pb-4 px-8  flex-grow h-full">
          <MypageList />
        </section>
      </section>
    </div>
  );
}
