"use client";

import MypageList from "./components/MypageList";
import GifticonCarousel from "./components/GifticonCarousel";

// import { useQuery } from "@tanstack/react-query";
// import { fetchUserGifticons } from "@/apis/myInfoApi";

export default function Mypage() {
  const point = 300;
  return (
    <div className="flex flex-col bottom-sheet w-full min-h-screen ">
      <section className="typo-title mb-5 flex items-bottom items-end justify-between">
        <div>
          <p>My</p>
          <p>Point</p>
        </div>
        <div className="typo-sub-title text-right">{point}pt</div>
      </section>
      <section>
        <GifticonCarousel />
      </section>
      <section>
        <MypageList />
      </section>
    </div>
  );
}
