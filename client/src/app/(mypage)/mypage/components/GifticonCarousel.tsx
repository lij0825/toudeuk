"use client";

import { UserGifticonInfo } from "@/types/gifticon";
import Image from "next/image";
import Link from "next/link";
// import { fetchUserGifticons } from "./../../../../apis/myInfoApi";
// import { useQuery } from "@tanstack/react-query";

const gifticons: UserGifticonInfo[] = [
  {
    userItemId: 1,
    itemName: "Coffee Coupon",
    itemImage:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    itemPrice: 4500,
    createdAt: "2024-10-10",
    used: true,
  },
  {
    userItemId: 2,
    itemName: "Pizza Gift Card",
    itemImage:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    itemPrice: 25000,
    createdAt: "2024-09-28",
    used: false,
  },
  {
    userItemId: 3,
    itemName: "Ice Cream Voucher",
    itemImage:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    itemPrice: 3000,
    createdAt: "2024-09-15",
    used: true,
  },
  {
    userItemId: 4,
    itemName: "Burger Set Coupon",
    itemImage:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    itemPrice: 7000,
    createdAt: "2024-08-30",
    used: false,
  },
  {
    userItemId: 5,
    itemName: "Movie Ticket",
    itemImage:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    itemPrice: 10000,
    createdAt: "2024-07-20",
    used: true,
  },
];

export default function GifticonCarousel() {
  // const { data: gifticons = [], isLoading, error } = useQuery<UserGifticonInfo[]>({
  //   queryKey: ['usergifticons'],
  //   queryFn: fetchUserGifticons,
  // })

  // if (isLoading) return <div>로딩 중...</div>;
  // if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <>
      <div className="flex overflow-x-auto tailwind-scrollbar-hide">
        <Link
          href={`/mygifticon`}
          className="p-4 border w-[200px] rounded-lg h-32 backdrop-blur-lg bg-white/30 shadow-lg flex-shrink-0"
          style={{
            backgroundImage:
              "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
          }}
        >
          <div className="typo-sub-title">My</div>
          <div className="typo-sub-title">{`Gifticon >>`}</div>
        </Link>
        {gifticons.map((gifticon) => (
          <Link
            key={gifticon.userItemId}
            href={`/gifticon/${gifticon.userItemId}`}
            className="p-4 border w-[150px] rounded-lg h-32 backdrop-blur-lg bg-white/30 shadow-lg flex-shrink-0"
            style={{
              backgroundImage:
                "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
            }}
          >
            <Image
              src={gifticon.itemImage}
              alt={gifticon.itemName}
              width={80}
              height={80}
              className="h-20 rounded-lg w-4/5 absolute top-[-20%] left-1/2 transform -translate-x-1/2" // 80% 너비 및 위로 이동
            />
            <p className="text-center mt-12 relative z-10">
              {gifticon.itemName}
            </p>{" "}
            {/* p 태그의 상단 마진 조정 */}
          </Link>
        ))}
      </div>
    </>
  );
}
