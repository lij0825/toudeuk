import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import instance from "../clientApi";
import { BaseResponse } from "@/types";

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
  return useMutation({
    mutationFn: () => buyGifticon(id),
    onSuccess: () => {
      // success가 true일 경우만 실행
      queryClient.invalidateQueries({ queryKey: ["usergifticons"] });
      toast.success(`구매가 완료되었습니다.`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "구매 중 오류가 발생했습니다.";
      toast.error(errorMessage);
    },
  });
};

export default useBuyGifticon;
