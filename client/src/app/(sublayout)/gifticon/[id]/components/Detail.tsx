"use client";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GifticonInfo } from "@/types/gifticon";
import { buyGifticon, fetchGifticonDetail } from "@/apis/gifticonApi";

export default function Detail() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const {
    data: gifticon,
    isLoading,
    error,
  } = useQuery<GifticonInfo>({
    queryKey: ["gifticon", id],
    queryFn: () => fetchGifticonDetail(id),
  });

  const mutation = useMutation({
    mutationFn: () => buyGifticon(id),
    onSuccess: () => {
      toast.success(`${gifticon?.itemName} 구매가 완료되었습니다.`);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "구매 중 오류가 발생했습니다.";
      toast.error(errorMessage);
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center justify-center text-center font-noto scrollbar-hidden">
        {gifticon ? (
          <div className="space-y-6 -mt-6">
            {/* 기프티콘 이미지 */}
            <div className="w-full h-[350px] flex justify-center bg-gray-100 rounded-lg overflow-hidden mt-8">
              <Image
                src={gifticon.itemImage}
                alt={gifticon.itemName}
                width={450}
                height={450}
                objectFit="contain"
                className="rounded-lg"
              />
            </div>

            {/* 기프티콘 이름 */}
            <h1 className="text-2xl font-extrabold break-words">
              {gifticon?.itemName}
            </h1>

            {/* 기프티콘 가격 */}
            <h2 className="text-xl font-semibold text-gray-700">
              {gifticon.itemPrice} P
            </h2>

            {/* 구매하기 버튼 */}
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => mutation.mutate()}
            >
              구매하기
            </button>

            {/* 유의사항 */}
            <div className="text-left font-noto p-4 w-full bg-amber-50 rounded-lg ">
              <p className="font-semibold ">▶ 유의사항</p>
              <p className="text-sm text-gray-600">
                - 상기 이미지는 연출된 것으로 실제와 다를 수 있습니다. <br />
                - 본 상품은 매장 재고 상황에 따라 동일 상품으로 교환이 불가능할
                수 있습니다.
                <br />- 동일 상품 교환이 불가한 경우 다른 상품으로 교환이
                가능합니다. (차액 발생 시 차액 지불)
              </p>
            </div>
            <div className="h-[65px]"></div>
            <ToastContainer />
          </div>
        ) : (
          <div className="text-center">기프티콘 정보를 불러올 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}
