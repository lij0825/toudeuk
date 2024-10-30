import SettingButton from "./components/Setting";
import GifticonSwipe from "./components/GifticonSwipe";
import MypageList from "./components/MypageList";
import MyPoint from "./components/Point";

export default function Mypage() {
  return (
    <>
      <section className="typo-title mb-5 flex items-end justify-between">
        <div className="flex items-end">
          <div>
            <p>My</p>
            <p>Point</p>
          </div>
          {/*CSR*/}
        </div>
        <div className="flex flex-col items-end h-full gap-8">
          <SettingButton />
          <MyPoint />
        </div>
      </section>
      <section>
        <div className="typo-body"></div>
      </section>
      <section>
        {/*CSR*/}
        <GifticonSwipe />
      </section>
      <section>
        <MypageList />
      </section>
    </>
  );
}
