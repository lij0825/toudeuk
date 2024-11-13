import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserPartialInfo } from "@/types";

//캐시를 제외한 데이터만 전역으로 관리 불필요한 호출 감소
interface UserInfoStore {
  userInfo: Partial<UserPartialInfo> | null;
  setUserInfo: (data: Partial<UserPartialInfo>) => void;
}

export const useUserInfoStore = create<UserInfoStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (data) =>
        set((state) => ({
          userInfo: {
            ...state.userInfo, // 기존 상태 유지
            ...data, // 새로운 데이터 덮어쓰기
          },
        })),
      clearUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ userInfo: state.userInfo }), // userInfo 전체 저장
      version: 0,
    }
  )
);
