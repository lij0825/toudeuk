import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BaseResponse } from "@/types/Base";
import { UserGifticonInfo } from "@/types/gifticon";
import instance from "../clientApi";

// 유저 기프티콘 정보 가져오기 함수
const fetchUserGifticons = async (): Promise<UserGifticonInfo[]> => {
  const response = await instance.get<BaseResponse<UserGifticonInfo[]>>(
    "/user/items"
  );

  if (!response.data.success || !response.data.data) {
    toast.error(response.data.message);
    throw new Error();
  }

  return response.data.data;
};

// useFetchUserGifticon 훅
export const useFetchUserGifticon = () => {
  const query = useQuery<UserGifticonInfo[]>({
    queryKey: ["usergifticons"],
    queryFn: fetchUserGifticons,
    select: (data) => {
      // 배열을 역순으로 복사하고 used가 true인 항목을 마지막으로 정렬
      return data
        .slice() // 배열 복사
        .reverse() // 역순으로 정렬 (가장 최신 항목이 위로)
        .sort((a, b) => {
          // used가 false인 항목이 먼저 오게 정렬
          if (a.used === b.used) return 0; // 둘 다 같으면 순서 유지
          return a.used ? 1 : -1; // used가 true면 뒤로 보냄
        });
    },
  });

  // 쿼리 에러 처리
  if (query.isError) {
    toast.error("유저정보를 다시 불러와주세요");
  }

  return query;
};
