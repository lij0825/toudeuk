import { useCallback } from "react";
import { useMusicControlStore } from "@/store/MusicControlStore";

interface SoundConfig {
  [key: number]: string;
}

const SOUND_EFFECTS: SoundConfig = {
  1: "/audio/sound1.mp3",
  2: "/audio/sound2.mp3",
  3: "/audio/sound3.mp3",
  4: "/audio/sound4.mp3",
  5: "/audio/sound5.mp3",
};

export const useSound = () => {
  const { sfxVolume, isMuted, isSfxMuted, selectedSfxSound } =
    useMusicControlStore();

  const playClickSound = useCallback(() => {
    if (!isMuted && !isSfxMuted && SOUND_EFFECTS[selectedSfxSound]) {
      const audio = new Audio(SOUND_EFFECTS[selectedSfxSound]);
      audio.volume = sfxVolume / 100;
      audio
        .play()
        .catch((err) => console.error("Failed to play click sound:", err));
    }
  }, [sfxVolume, isMuted, isSfxMuted, selectedSfxSound]);

  return { playClickSound };
};
