"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { GifticonInfo } from "@/types/gifticon";
import { fetchGifticonDetail } from "@/apis/gifticonApi";
import Loading from "@/app/loading";
import useBuyGifticon from "@/apis/gifticon/useBuyGifticon";

export default function Detail() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const { data: gifticon, isLoading } = useQuery<GifticonInfo>({
    queryKey: ["gifticon", id],
    queryFn: () => fetchGifticonDetail(id),
  });

  const { mutate: buyGifticon, status: buyStatus } = useBuyGifticon(id);

  // 'status'를 사용하여 구매 중인지 확인
  const isBuying = buyStatus === "pending";

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative inset h-full w-full overflow-y-auto scrollbar-hidden -mt-8">
      <div className="flex flex-col items-center justify-center text-center font-noto scrollbar-hidden pt-8">
        {gifticon ? (
          <div className="space-y-6 -mt-6">
            {/* 기프티콘 이미지 */}
            <div className="w-full h-[350px] flex justify-center bg-gray-100 rounded-lg overflow-hidden mt-8">
              <Image
                src={gifticon.itemImage}
                alt={gifticon.itemName}
                width={450}
                height={450}
                layout="responsive"
                className="rounded-lg object-cover"
                priority
              />
            </div>

            {/* 기프티콘 이름 */}
            <h1 className="text-2xl font-extrabold break-words">
              {gifticon?.itemName}
            </h1>

            {/* 기프티콘 가격 */}
            <h2 className="text-xl font-semibold text-gray-700">
              {gifticon.itemPrice.toLocaleString()} P
            </h2>

            {/* 구매하기 버튼 */}
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={() => buyGifticon()}
              disabled={isBuying}
            >
              {isBuying ? "구매 중..." : "구매하기"}
            </button>

            {/* 유의사항 */}
            <div className="text-left font-noto p-4 w-full bg-amber-50 rounded-lg">
              <p className="font-semibold">▶ 유의사항</p>
              <p className="text-sm text-gray-600">
                - 상기 이미지는 연출된 것으로 실제와 다를 수 있습니다. <br />
                - 본 상품은 매장 재고 상황에 따라 동일 상품으로 교환이 불가능할
                수 있습니다.
                <br />- 동일 상품 교환이 불가한 경우 다른 상품으로 교환이
                가능합니다. (차액 발생 시 차액 지불)
              </p>
            </div>
            <div className="h-[74px]"></div>
          </div>
        ) : (
          <div className="text-center">기프티콘 정보를 불러올 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}
