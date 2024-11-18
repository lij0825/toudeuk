import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MusicControlState {
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  isBgmMuted: boolean;
  isSfxMuted: boolean;
  selectedSfxSound: number;
  isPlaying: boolean;
  wasPlayingBeforeMute: boolean; // 새로 추가
  setSelectedSfxSound: (soundId: number) => void;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleBgmMute: () => void;
  toggleSfxMute: () => void;
  playBgm: () => void;
  stopBgm: () => void;
  setIsPlaying: (playing: boolean) => void;
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
      isPlaying: false,
      wasPlayingBeforeMute: false, // 새로 추가

      setBgmVolume: (volume: number) => {
        set({ bgmVolume: volume });
        // 볼륨 변경 시 오디오 엘리먼트 볼륨도 업데이트
        const audioElement = document.getElementById(
          "audioPlayer"
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.volume = volume / 100;
        }
      },

      setSfxVolume: (volume: number) => {
        set({ sfxVolume: volume });
      },

      toggleMute: () =>
        set((state) => {
          const isNowMuted = !state.isMuted;

          if (isNowMuted) {
            // 음소거 활성화 시
            console.log("Enabling mute - Saving current state");
            if (state.isPlaying) {
              get().stopBgm(); // 현재 재생 중이면 중지
            }
            return {
              isMuted: true,
              isBgmMuted: true,
              isSfxMuted: true,
              wasPlayingBeforeMute: state.isPlaying, // 현재 재생 상태 저장
              isPlaying: false,
            };
          } else {
            // 음소거 해제 시
            console.log("Disabling mute - Restoring previous state");
            const currentState = get();

            setTimeout(() => {
              const latestState = get();
              console.log("Unmute setTimeout - State check:", {
                isMuted: latestState.isMuted,
                isBgmMuted: latestState.isBgmMuted,
                wasPlayingBeforeMute: latestState.wasPlayingBeforeMute,
                bgmVolume: latestState.bgmVolume,
              });

              if (
                !latestState.isMuted &&
                !latestState.isBgmMuted &&
                currentState.wasPlayingBeforeMute
              ) {
                console.log("Attempting to restore BGM playback");
                get().playBgm();
              }
            }, 100);

            return {
              isMuted: false,
              isBgmMuted: false,
              isSfxMuted: false,
              bgmVolume: state.bgmVolume || 50,
              sfxVolume: state.sfxVolume || 50,
            };
          }
        }),

      toggleBgmMute: () =>
        set((state) => {
          const isNowBgmMuted = !state.isBgmMuted;
          console.log("toggleBgmMute:", {
            isNowBgmMuted,
            isMuted: state.isMuted,
            currentlyPlaying: state.isPlaying,
            wasPlayingBeforeMute: state.wasPlayingBeforeMute,
          });

          if (isNowBgmMuted) {
            // BGM 음소거 시
            if (state.isPlaying) {
              get().stopBgm();
            }
            return {
              isBgmMuted: true,
              wasPlayingBeforeMute: state.isPlaying,
              isPlaying: false,
            };
          } else {
            // BGM 음소거 해제 시
            if (!state.isMuted && state.wasPlayingBeforeMute) {
              setTimeout(() => {
                const currentState = get();
                if (!currentState.isMuted && !currentState.isBgmMuted) {
                  get().playBgm();
                }
              }, 100);
            }
            return {
              isBgmMuted: false,
              wasPlayingBeforeMute: false,
            };
          }
        }),

      toggleSfxMute: () =>
        set((state) => {
          console.log("Toggling SFX mute");
          return { isSfxMuted: !state.isSfxMuted };
        }),

      setSelectedSfxSound: (soundId: number) =>
        set({ selectedSfxSound: soundId }),

      playBgm: () => {
        const state = get();
        console.log("playBgm - Current State:", {
          isMuted: state.isMuted,
          isBgmMuted: state.isBgmMuted,
          bgmVolume: state.bgmVolume,
          isPlaying: state.isPlaying,
        });

        if (state.isMuted || state.isBgmMuted) {
          return;
        }

        let audioElement = document.getElementById(
          "audioPlayer"
        ) as HTMLAudioElement;

        if (!audioElement) {
          console.log("Creating new audio element");
          audioElement = document.createElement("audio");
          audioElement.id = "audioPlayer";
          audioElement.src = "/path/to/your/audio/file.mp3";
          audioElement.loop = true;
          document.body.appendChild(audioElement);
        }

        audioElement.volume = state.bgmVolume / 100;

        if (!audioElement.paused) {
          return;
        }

        audioElement
          .play()
          .then(() => {
            set({ isPlaying: true });
          })
          .catch((err) => {
            set({ isPlaying: false });
          });
      },

      stopBgm: () => {
        const audioElement = document.getElementById(
          "audioPlayer"
        ) as HTMLAudioElement;
        if (audioElement) {
          audioElement.pause();
          set({ isPlaying: false });
        } else {
          console.warn("Audio element not found");
          set({ isPlaying: false });
        }
      },

      setIsPlaying: (playing: boolean) => {
        set({ isPlaying: playing });
      },
    }),
    {
      name: "music-control",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
