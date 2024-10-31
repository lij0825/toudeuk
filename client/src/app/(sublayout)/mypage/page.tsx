import SettingButton from "./components/Setting";
import GifticonSwipe from "./components/GifticonSwipe";
import MypageList from "./components/MypageList";
import MyPoint from "./components/Point";

export default function Mypage() {
  return (
    <>
      <section className="typo-title mb-2 justify-between">
        <div className="flex justify-between">
          <p>My</p>
          <SettingButton />
        </div>
        <div className="flex justify-between">
          <p>Point</p>
          <MyPoint />
        </div>
        <div className="h-full gap-8"></div>
      </section>
      <section>
        <GifticonSwipe />
      </section>
      <section>
        <MypageList />
      </section>
    </>
  );
}
