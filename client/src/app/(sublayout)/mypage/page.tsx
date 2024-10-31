import GifticonSwipe from "./components/GifticonSwipe";
import MypageList from "./components/MypageList";
import MyPoint from "./components/Point";
import SettingButton from "./components/Setting";

export default function Mypage() {
  return (
    <>
      <section className="typo-title mb-2 w-full justify-between relative">
        <div className="flex items-end">
          <p>My</p>
          <SettingButton />
        </div>
        <div className="flex justify-between items-end">
          <p>Page</p>
          <MyPoint />
        </div>
        <div className="h-full gap-8"></div>
      </section>
      <section className="bg-[#353A40] py-5 px-[30px] mx-[-30px]">
        <GifticonSwipe />
      </section>
      <section>
        <MypageList />
      </section>
    </>
  );
}
