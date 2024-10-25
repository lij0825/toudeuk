import Myprofile from "./components/Myprofile";
import Mypoint from "./components/Mypoint";
import NeonList from "./components/NeonList";
import { ListItemInfo } from "@/types/mypageInfo";
import { UserGifticonInfo } from "@/types/gifticon";
import GifticonCard from "./components/GifticonCard";

// import { useQuery } from "@tanstack/react-query";
// import { fetchUserGifticons } from "@/apis/myInfoApi";

const gifticons: UserGifticonInfo[] = [
  {
    userItemId: 1,
    itemName: "Coffee Coupon",
    itemImage:
      "http://bizimg.giftishow.com/Storage/BI/2020/8/ES20200812000042.jpg",
    itemPrice: 4500,
    createdAt: "2024-10-10",
    used: true,
  },
  {
    userItemId: 2,
    itemName: "Pizza Gift Card",
    itemImage:
      "http://bizimg.giftishow.com/Storage/BI/2020/8/ES20200812000039.jpg",
    itemPrice: 25000,
    createdAt: "2024-09-28",
    used: false,
  },
  {
    userItemId: 3,
    itemName: "Ice Cream Voucher",
    itemImage:
      "http://bizimg.giftishow.com/Storage/BI/2021/3/ES20210317000026.jpg",
    itemPrice: 3000,
    createdAt: "2024-09-15",
    used: true,
  },
  {
    userItemId: 4,
    itemName: "Burger Set Coupon",
    itemImage:
      "http://bizimg.giftishow.com/Storage/BI/2021/3/ES20210317000028.jpg",
    itemPrice: 7000,
    createdAt: "2024-08-30",
    used: false,
  },
  {
    userItemId: 5,
    itemName: "Movie Ticket",
    itemImage:
      "http://bizimg.giftishow.com/Storage/BI/2020/8/ES20200812000045.jpg",
    itemPrice: 10000,
    createdAt: "2024-07-20",
    used: true,
  },
];

export default function Mypage() {
  const Listitems: ListItemInfo[] = [
    { content: "리워드 내역", href: "/prize" },
    { content: "기프티콘 샵", href: "/gifticon" },
    { content: "랭킹 보기", href: "/rank" },
  ];

  return (
    <div className="flex flex-col bottom-sheet">
      <section>
        <Mypoint />
        <Myprofile />
      </section>
      <section>
        기프티콘 페이지 이동 버튼
        {gifticons.map((gifticon) => (
          <GifticonCard key={gifticon.userItemId} gifticon={gifticon} />
        ))}
      </section>
      <section>
        {Listitems.map((item, index) => (
          <NeonList key={index} content={item.content} href={item.href} />
        ))}
      </section>
    </div>
  );
}
