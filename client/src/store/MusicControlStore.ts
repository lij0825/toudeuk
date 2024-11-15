import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MusicControlState {
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  isBgmMuted: boolean;
  isSfxMuted: boolean;
  selectedSfxSound: number;
  isPlaying: boolean; // 추가된 상태
  setSelectedSfxSound: (soundId: number) => void;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleBgmMute: () => void;
  toggleSfxMute: () => void;
  playBgm: () => void;
  stopBgm: () => void;
  setIsPlaying: (playing: boolean) => void; // 추가된 메서드
}

export const useMusicControlStore = create<MusicControlState>()(
  persist(
    (set, get) => ({
      bgmVolume: 50,
      sfxVolume: 50,
      isMuted: false,
      isBgmMuted: false,
      isSfxMuted: false,
      selectedSfxSound: 4,
      isPlaying: false, // 초기값 설정

      setBgmVolume: (volume: number) => set({ bgmVolume: volume }),
      setSfxVolume: (volume: number) => set({ sfxVolume: volume }),

      // 전체 음소거 토글
      toggleMute: () =>
        set((state) => ({
          isMuted: !state.isMuted,
          isBgmMuted: !state.isMuted,
          isSfxMuted: !state.isMuted,
          bgmVolume: state.isMuted ? 50 : 0,
          sfxVolume: state.isMuted ? 50 : 0,
          isPlaying: state.isMuted ? state.isPlaying : false, // 음소거 시 재생 상태 업데이트
        })),

      // 배경음 음소거 토글
      toggleBgmMute: () =>
        set((state) => ({
          isBgmMuted: !state.isBgmMuted,
          isPlaying: state.isBgmMuted ? state.isPlaying : false, // BGM 음소거 해제 시 이전 재생 상태 유지
        })),

      // 효과음 음소거 토글
      toggleSfxMute: () =>
        set((state) => ({
          isSfxMuted: !state.isSfxMuted,
        })),

      setSelectedSfxSound: (soundId: number) =>
        set({ selectedSfxSound: soundId }),

      // 배경음 재생 함수 수정
      playBgm: () => {
        const audioElement = document.getElementById(
          "audioPlayer"
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.volume = get().bgmVolume / 100;
          audioElement
            .play()
            .then(() => {
              set({ isPlaying: true });
            })
            .catch((err) => {
              console.error("Failed to play BGM:", err);
              set({ isPlaying: false });
            });
        }
      },

      // 배경음 정지 함수 수정
      stopBgm: () => {
        const audioElement = document.getElementById(
          "audioPlayer"
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.pause();
          set({ isPlaying: false });
        }
      },

      // 재생 상태 설정 메서드 추가
      setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
    }),
    {
      name: "music-control",
      storage: createJSONStorage(() => localStorage),
    }
  )
);