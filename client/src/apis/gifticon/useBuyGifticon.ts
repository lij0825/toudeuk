import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import instance from "../clientApi";
import { BaseResponse } from "@/types";
import { useState } from "react";

let isToastActive = false;

const buyGifticon = async (id: string): Promise<void> => {
  const response = await instance.post<BaseResponse<void>>(`/item/buy`, {
    itemId: id,
  });

  if (!response.data.success) {
    // success가 false일 경우 에러를 명시적으로 던짐
    throw new Error(response.data.message || "구매 실패");
  }
};

const useBuyGifticon = (id: string) => {
  const queryClient = useQueryClient();
  const [hasErrorShown, setHasErrorShown] = useState(false);

  return useMutation({
    mutationFn: () => buyGifticon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usergifticons"] });
      if (!isToastActive) {
        isToastActive = true;
        toast.success(`구매가 완료되었습니다.`, {
          autoClose: 1000, // 1초 후 닫힘
          hideProgressBar: true, // 진행 바 숨김
          onClose: () => {
            isToastActive = false; // 토스트 닫히면 상태 초기화
          },
        });
      }
      setHasErrorShown(false);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "구매 중 오류가 발생했습니다.";
      if (!isToastActive) {
        isToastActive = true;
        toast.error(errorMessage, {
          autoClose: 1000, // 1초 후 닫힘
          hideProgressBar: true, // 진행 바 숨김
          onClose: () => {
            isToastActive = false; // 토스트 닫히면 상태 초기화
          },
        });
      }
      setHasErrorShown(true);
    },
  });
};

export default useBuyGifticon;
