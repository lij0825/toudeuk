"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import { fetchUserGifticonDetail, useGifticon } from "@/apis/gifticonApi";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { UserGifticonDetailInfo } from "@/types/gifticon";
//서버사이드 랜더링

export default function MygiticonDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const getServerSideProps: GetServerSideProps = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ["usergifticon", id],
      queryFn: () => fetchUserGifticonDetail(id),
    });
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  };

  const { data: usergifticon, isError } = useQuery<UserGifticonDetailInfo>({
    queryKey: ["usergifticon", id],
    queryFn: () => fetchUserGifticonDetail(id),
  });

  if (isError) {
    toast.error("");
  }

  return (
    <>
      {usergifticon ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">{usergifticon.itemName}</h1>
          <Image
            src={usergifticon.itemImage}
            alt={usergifticon.itemName}
            width={300}
            height={300}
            className="rounded-lg shadow-lg"
          />
          <Image
            src={usergifticon.itemBarcode}
            alt={usergifticon.itemBarcode}
            width={300}
            height={300}
            className="rounded-lg shadow-lg"
          />
          {/* 기프티콘 이름 */}
          <h2 className="text-xl font-semibold mt-4">
            {usergifticon.itemName} P
          </h2>
          {/* 사용완료 버튼 */}
          <button
            className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() =>
              toast.success(`${usergifticon.itemName} 사용이 완료되었습니다.`)
            }
          >
            사용하기
          </button>
        </div>
      ) : (
        <div className="text-center">기프티콘 정보를 불러올 수 없습니다.</div>
      )}
    </>
  );
}
