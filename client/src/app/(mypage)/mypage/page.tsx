import Link from "next/link";
import MypageList from "./components/MypageList";
import GifticonCarousel from "./components/GifticonCarousel";
import MyPoint from "./components/Point";
import { HiInformationCircle } from "react-icons/hi";

// import { useQuery } from "@tanstack/react-query";
// import { fetchUserGifticons } from "@/apis/myInfoApi";

export default function Mypage() {
  return (
    <div className="bottom-sheet h-full flex flex-col">
      <section className="typo-title mb-5 flex items-end justify-between">
        <div className="flex items-end">
          <div>
            <p>My</p>
            <p>Point</p>
          </div>
          <Link href={"/point"}>
            <HiInformationCircle className="text-gray-500 w-6 h-6 mb-3 ml-2" />
          </Link>
          {/*CSR*/}
        </div>
        <MyPoint />
      </section>
      <section>
        {/*CSR*/}
        <GifticonCarousel />
      </section>

      <section>
        <MypageList />
      </section>
    </div>
  );
}
