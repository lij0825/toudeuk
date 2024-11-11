import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserPartialInfo } from "@/types";

//캐시를 제외한 데이터만 전역으로 관리 불필요한 호출 감소
interface UserInfoStore {
  userInfo: UserPartialInfo | null;
  setUserInfo: (data: UserPartialInfo) => void;
}

export const useUserInfoStore = create<UserInfoStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (data) => set({ userInfo: data }),
      clearUserInfo: () => set({ userInfo: null }), 
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
