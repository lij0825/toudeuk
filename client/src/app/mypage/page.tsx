import Myprofile from "./components/Myprofile";
import Mypoint from "./components/Mypoint"
import NeonList from "./components/NeonList";
import { ListItemInfo } from "@/types/mypageInfo";

export default function Mypage() {


  const Listitems: ListItemInfo[] = [
    { content: "리워드 내역", href: "/prize" },
    { content: "기프티콘 샵", href: "/gifticon" },
    { content: "랭킹 보기", href: "/rank" },
  ];


  return (
    <div className="flex flex-col items-center min-h-screen">
      <section>
      <Mypoint/>
      <Myprofile/>
      </section>
      <section>

      <div>
        보유중인 기프티콘
      </div>
        캐러샐 들어갈거임

      {Listitems.map((item, index) =>  <NeonList key={index} content={item.content} href={item.href} />)}
            </section>
        </div>
        )
}
