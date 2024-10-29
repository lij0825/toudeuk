"use client";

import Link from "next/link";
import Image from "next/image";
import { UserGifticonInfo } from "@/types/gifticon";
import { CommonLinkStyle } from "./GifticonSwipe";

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

export default function GifticonItem ()  {
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
    return ( <>

    {
        gifticons.map((gifticon)=> {
            <Link
            key={gifticon.userItemId}
            href={`/mygifticon/${gifticon.userItemId}`}
            className="p-4 border w-[200px] rounded-lg backdrop-blur-lg bg-white/30 shadow-lg flex-shrink-0 mr-3"
            style={CommonLinkStyle}
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
        })
    }
</>
    )

}

