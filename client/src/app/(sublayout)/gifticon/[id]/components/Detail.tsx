"use client";
import { useParams } from "next/navigation";
import React from "react";
import { gifticons } from "../../components/Gifticon";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";

export default function Detail() {
  const params = useParams();
  const { id } = params;
  const data = gifticons[parseInt(id[0]) - 1];
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      {data ? (
        <div className="flex flex-col items-center">
          {/* 기프티콘 이미지 */}
          <Image
            src={data.image}
            alt={data.name}
            width={300}
            height={300}
            className="rounded-lg shadow-lg"
          />

          {/* 기프티콘 이름 */}
          <h2 className="text-xl font-semibold mt-4">{data.price} P</h2>

          {/* 구매하기 버튼 */}
          <button
            className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => toast.success(`${data.name} 구매가 완료되었습니다.`)}
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
