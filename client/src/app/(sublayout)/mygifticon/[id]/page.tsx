"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import { fetchUserGifticonDetail, usedGifticon } from "@/apis/gifticonApi";
import { QueryClient, dehydrate, useMutation, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { UserGifticonDetailInfo } from "@/types/gifticon";
import dayjs from "dayjs";

export default function MyGifticonDetail({
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
    toast.error("기프티콘 정보를 불러올 수 없습니다.");
  }

  const expirationDate = dayjs(usergifticon?.createdAt)
    .add(1, "year")
    .format("YYYY년 MM월 DD일");

    const mutation = useMutation({
      mutationFn: () => usedGifticon(id),
      onSuccess: () => {
        toast.success(`사용처리가 완료되었습니다.`);
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : "사용 처리 중 오류가 발생했습니다.";
        if (errorMessage === "success") {
          // 성공 메시지로 처리
          toast.success(`${usergifticon?.itemName} 사용이 완료되었습니다.`);
        } else {
          // 에러 메시지로 처리
          toast.error(errorMessage);
        }
      },
    })

  return (
    <div className="min-h-screen flex flex-col font-noto -m-8">
      {usergifticon ? (
        <div className="flex-1 flex flex-col h-screen">
          {/* 상단 이미지 - 고정 */}
          <div className="w-full max-w-md p-4 bg-[#FBBD05] flex-shrink-0">
            <Image
              src={usergifticon.itemImage}
              alt={usergifticon.itemName}
              width={300}
              height={300}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* 스크롤 가능한 컨텐츠 영역 */}
          <div className="flex-1 overflow-y-auto">
            {/* 정보섹션 */}
            <section className="w-full bg-white flex flex-col items-center">
              {/* 기프티콘 이름 */}
              <h1 className="text-[22px] font-semibold mt-5 mb-2 px-8 text-center whitespace-pre-line break-words">
                {usergifticon.itemName}
              </h1>
              {/* 바코드 영역 */}
              <div className="rounded-lg max-w-md text-center bg-white">
                <Image
                  src={usergifticon.itemBarcode}
                  alt="바코드"
                  width={150}
                  height={150}
                  className="w-full h-auto object-contain"
                />
              </div>
            </section>

            {/* 하단 버튼들 */}
            <section>
              <div className="flex justify-between w-full max-w-md space-x-2 my-4 px-4">
                <button
                  className="bg-[#FBBD05] text-white font-semibold py-2 px-4 rounded-lg w-1/2 hover:bg-yellow-600"
                  onClick={() =>
                    toast.success(`${usergifticon.itemName}이 저장되었습니다.`)
                  }
                >
                  교환권 저장
                </button>
                <button
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg w-1/2 hover:bg-blue-600"
                  onClick={() => mutation.mutate()}
                >
                  교환권 사용하기
                </button>
              </div>
            </section>

            {/* 유효기간 정보 섹션 */}
            <section className="w-full flex justify-center mb-4">
              <div className="w-full max-w-md  text-xs text-center bg-[#EBEBEB] py-2">
                <p className="text-gray-500">유효기간</p>
                <p className="">{expirationDate}</p>
                <p className="text-red-500 mt-1">환불 불가</p>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          기프티콘 정보를 불러올 수 없습니다.
        </div>
      )}
    </div>
  );
}
