import React, { useCallback } from "react";
import { useMusicControlStore } from "@/store/MusicControlStore";
import { motion, AnimatePresence } from "framer-motion";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoundSettingsModal({
  isOpen,
  onClose,
}: SoundSettingsModalProps) {
  const {
    bgmVolume,
    sfxVolume,
    isMuted,
    isBgmMuted,
    isSfxMuted,
    setBgmVolume,
    setSfxVolume,
    toggleMute,
    toggleBgmMute,
    toggleSfxMute,
    selectedSfxSound,
    setSelectedSfxSound,
  } = useMusicControlStore();

  const soundFiles: Record<number, string> = {
    1: "/audio/sound1.mp3",
    2: "/audio/sound2.mp3",
    3: "/audio/sound3.mp3",
    4: "/audio/sound4.mp3",
    5: "/audio/sound5.mp3",
  };

  const soundOptions = [
    { id: 1, label: "1" },
    { id: 2, label: "2" },
    { id: 3, label: "3" },
    { id: 4, label: "4" },
    { id: 5, label: "5" },
  ];

  const playSound = useCallback(
    (soundId: number, volume?: number) => {
      if (isMuted || isSfxMuted) return;
      const audio = new Audio(soundFiles[soundId]);
      audio.volume = (volume ?? sfxVolume) / 100;
      audio.play();
    },
    [isMuted, isSfxMuted, sfxVolume, soundFiles]
  );

  // 볼륨 조절 디바운스를 위한 타이머
  let volumeChangeTimer: NodeJS.Timeout;

  const handleSfxVolumeChange = (newVolume: number) => {
    setSfxVolume(newVolume);

    // 이전 타이머 취소
    if (volumeChangeTimer) {
      clearTimeout(volumeChangeTimer);
    }

    // 100ms 디바운스로 소리 재생
    volumeChangeTimer = setTimeout(() => {
      playSound(selectedSfxSound, newVolume);
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 999 }}
        >
          <motion.div
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 w-80 shadow-xl border border-opacity-30 border-white"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-center mb-4 relative w-full">
              <h2 className="text-xl font-semibold text-white">소리 설정</h2>
              <button
                onClick={toggleMute}
                className={`absolute top-0.5 right-0 flex items-center justify-center p-2 rounded-lg ${
                  isMuted ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {isMuted ? <HiMiniSpeakerXMark /> : <HiMiniSpeakerWave />}
              </button>
            </div>

            {/* 배경음 볼륨 */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-white mb-1">
                <span className="text-sm font-medium">배경음</span>
                <button
                  onClick={toggleBgmMute}
                  className={`flex items-center justify-center p-2 rounded-lg`}
                >
                  {isBgmMuted ? <HiMiniSpeakerXMark /> : <HiMiniSpeakerWave />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted || isBgmMuted ? 0 : bgmVolume}
                onChange={(e) => setBgmVolume(Number(e.target.value))}
                disabled={isMuted || isBgmMuted}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none"
              />
              <span className="block text-right text-sm text-gray-200 mt-1">
                {bgmVolume}%
              </span>
            </div>

            {/* 효과음 볼륨 */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-white mb-1">
                <span className="text-sm font-medium">버튼음</span>
                <button
                  onClick={toggleSfxMute}
                  className={`flex items-center justify-center p-2 rounded-lg`}
                >
                  {isSfxMuted ? <HiMiniSpeakerXMark /> : <HiMiniSpeakerWave />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted || isSfxMuted ? 0 : sfxVolume}
                onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
                disabled={isMuted || isSfxMuted}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none"
              />
              <span className="block text-right text-sm text-gray-200 mt-1">
                {sfxVolume}%
              </span>
            </div>

            {/* 버튼 소리 종류 선택 */}
            <div className="mb-4">
              <span className="text-sm font-medium text-white">
                버튼 소리 종류
              </span>
              <div className="flex gap-2 mt-2">
                {soundOptions.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => {
                      setSelectedSfxSound(sound.id);
                      playSound(sound.id);
                    }}
                    className={`py-2 px-4 rounded-lg flex-grow ${
                      selectedSfxSound === sound.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {sound.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 bg-gray-800 bg-opacity-60 text-white rounded-lg"
            >
              닫기
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
