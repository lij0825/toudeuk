import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 상태와 메서드 타입 정의
interface MusicControlState {
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  isBgmMuted: boolean;
  isSfxMuted: boolean;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleBgmMute: () => void;
  toggleSfxMute: () => void;
  playBgm: () => void;
  stopBgm: () => void;
}

export const useMusicControlStore = create<MusicControlState>()(
  persist(
    (set) => ({
      bgmVolume: 50,
      sfxVolume: 50,
      isMuted: false,
      isBgmMuted: false,
      isSfxMuted: false,

      setBgmVolume: (volume: number) => set({ bgmVolume: volume }),
      setSfxVolume: (volume: number) => set({ sfxVolume: volume }),

      // 전체 음소거 토글
      toggleMute: () =>
        set((state: MusicControlState) => ({
          isMuted: !state.isMuted,
          isBgmMuted: !state.isMuted,
          isSfxMuted: !state.isMuted,
          bgmVolume: state.isMuted ? 50 : 0,
          sfxVolume: state.isMuted ? 50 : 0,
        })),

      // 배경음 음소거 토글
      toggleBgmMute: () =>
        set((state: MusicControlState) => ({
          isBgmMuted: !state.isBgmMuted,
        })),

      // 효과음 음소거 토글
      toggleSfxMute: () =>
        set((state: MusicControlState) => ({
          isSfxMuted: !state.isSfxMuted,
        })),

      // 배경음 재생 함수
      playBgm: () => console.log("Playing BGM"),

      // 배경음 정지 함수
      stopBgm: () => console.log("Stopping BGM"),
    }),
    {
      name: "music-control",
      storage: createJSONStorage(() => localStorage), // JSON 형태로 localStorage에 저장
    }
  )
);
