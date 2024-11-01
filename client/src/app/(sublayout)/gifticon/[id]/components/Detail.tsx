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

  const { data: gifticon, isLoading, error } = useQuery<GifticonInfo>({
    queryKey: ['gifticon', id],
    queryFn: () => fetchGifticonDetail(id),
  })

  const mutation = useMutation({
    mutationFn: () => buyGifticon(id),
    onSuccess: () => {
      toast.success(`${gifticon?.itemName} 구매가 완료되었습니다.`);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "구매 중 오류가 발생했습니다.";
      toast.error(errorMessage);
    },
  });
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;



  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{gifticon?.itemName}</h1>
      {gifticon ? (
        <div className="flex flex-col items-center">
          {/* 기프티콘 이미지 */}
          <Image
            src={gifticon.itemImage}
            alt={gifticon.itemName}
            width={300}
            height={300}
            className="rounded-lg shadow-lg"
          />

          {/* 기프티콘 가격 */}
          <h2 className="text-xl font-semibold mt-4">{gifticon.itemPrice} P</h2>

          {/* 구매하기 버튼 */}
          <button
            className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => mutation.mutate()}
          >
            구매하기
          </button>
          <ToastContainer />
        </div>
      ) : (
        <div className="text-center">기프티콘 정보를 불러올 수 없습니다.</div>
      )}
    </div>
  );
}
