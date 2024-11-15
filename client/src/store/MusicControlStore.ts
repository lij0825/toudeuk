import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 상태와 메서드 타입 정의
interface MusicControlState {
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  isBgmMuted: boolean;
  isSfxMuted: boolean;
  selectedSfxSound: number; // 선택된 효과음 ID
  setSelectedSfxSound: (soundId: number) => void; // 효과음 선택 함수
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
    (set, get) => ({
      bgmVolume: 50,
      sfxVolume: 50,
      isMuted: false,
      isBgmMuted: false,
      isSfxMuted: false,
      selectedSfxSound: 4, // 기본값으로 Sound 4 선택

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

      // 효과음 선택
      setSelectedSfxSound: (soundId: number) =>
        set({ selectedSfxSound: soundId }),

      // 배경음 재생 함수
      playBgm: () => {
        const audioElement = document.getElementById(
          "audioPlayer"
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.volume = get().bgmVolume / 100;
          audioElement
            .play()
            .catch((err) => console.error("Failed to play BGM:", err));
        }
      },

      // 배경음 정지 함수
      stopBgm: () => {
        const audioElement = document.getElementById(
          "audioPlayer"
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.pause();
        }
      },
    }),
    {
      name: "music-control",
      storage: createJSONStorage(() => localStorage), // JSON 형태로 localStorage에 저장
    }
  )
);
