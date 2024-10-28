"use client";

import { UserGifticonInfo } from "@/types/gifticon";
import Image from "next/image";
import Link from "next/link";

// 공통 스타일을 상수로 분리
const commonLinkStyle = {
  backgroundImage:
    "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
  backdropBlur: "lg",
  boxShadow: "lg",
  border: "solid 0.5px",
  borderRadius: "lg",
  width: "200px",
  height: "150px",
  display: "flex",
  alignItems: "center",
};

// gifticons 더미 데이터
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
];

const GifticonItem = ({ gifticon }: { gifticon: UserGifticonInfo }) => (
  <Link
    key={gifticon.userItemId}
    href={`/mygifticon/${gifticon.userItemId}`}
    className="p-4 border w-[150px] rounded-lg h-32 backdrop-blur-lg bg-white/30 shadow-lg flex-shrink-0"
    style={commonLinkStyle}
  >
    <Image
      src={gifticon.itemImage}
      alt={gifticon.itemName}
      width={60}
      height={60}
      className="rounded-lg w-4/5"
    />
    <p className="text-center mt-12 relative z-10">{gifticon.itemName}</p>
  </Link>
);

export default function GifticonSwipe() {
  // // useQuery를 사용해 데이터를 가져옵니다.
  // const { data: gifticons = [], isError } = useQuery<UserGifticonInfo[]>({
  //   queryKey: ["userGifticons"],
  //   queryFn: fetchUserGifticons,
  //   staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  //   refetchOnWindowFocus: true,
  // });

  // //에러 값에 따라 분리 필요
  // if (isError) {
  //   toast.error(`오류 발생: ${error}`);
  // }

  return (
    <>
      <div className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        <Link
          href={`/mygifticon`}
          className="typo-sub-title p-4 border w-[100px] rounded-lg h-32 backdrop-blur-lg bg-white/30 shadow-lg"
          style={commonLinkStyle}
        >
          <div>My</div>
          <div>{`Gifticon >>`}</div>
        </Link>

        {gifticons.map((gifticon) => (
          <GifticonItem key={gifticon.userItemId} gifticon={gifticon} />
        ))}
      </div>
    </>
  );
}
