import Link from "next/link";
import { HiInformationCircle } from "react-icons/hi";
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
          <Link href={"/point"}>
            <HiInformationCircle className="text-gray-500 w-6 h-6 mb-2 ml-2" />
          </Link>
          {/*CSR*/}
        </div>
        <MyPoint />
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
