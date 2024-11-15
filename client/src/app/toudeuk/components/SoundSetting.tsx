import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    selectedSfx,
    setSettings,
  } = useSoundSettings();

  const handleVolumeChange = (type: "bgm" | "sfx", value: number) => {
    setSettings((prev) => ({
      ...prev,
      [`${type}Volume`]: value,
    }));
  };

  const handleMuteToggle = (type: "all" | "bgm" | "sfx") => {
    setSettings((prev) => {
      if (type === "all") {
        const muted = !prev.isMuted;
        return {
          ...prev,
          isMuted: muted,
          isBgmMuted: muted,
          isSfxMuted: muted,
          bgmVolume: muted ? 0 : 50,
          sfxVolume: muted ? 0 : 50,
        };
      } else {
        return {
          ...prev,
          [`is${type === "bgm" ? "Bgm" : "Sfx"}Muted`]:
            !prev[`is${type === "bgm" ? "Bgm" : "Sfx"}Muted`],
        };
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-96 p-6 relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-center mb-4">
              Sound Settings
            </h2>

            {/* 배경음 설정 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Background Music</span>
              <input
                type="range"
                min="0"
                max="100"
                value={isBgmMuted ? 0 : bgmVolume}
                onChange={(e) =>
                  handleVolumeChange("bgm", Number(e.target.value))
                }
                className="w-32"
                disabled={isMuted || isBgmMuted}
              />
            </div>

            {/* 효과음 설정 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Button Click Sound</span>
              <select
                value={selectedSfx}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    selectedSfx: Number(e.target.value),
                  }))
                }
                className="w-32 bg-gray-200 p-1 rounded"
                disabled={isMuted || isSfxMuted}
              >
                {[1, 2, 3, 4, 5].map((sfx) => (
                  <option key={sfx} value={sfx}>
                    Sound {sfx}
                  </option>
                ))}
              </select>
            </div>

            {/* 전체 음소거 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Mute All</span>
              <button
                onClick={() => handleMuteToggle("all")}
                className={`p-2 rounded-lg ${
                  isMuted ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {isMuted ? "Unmute All" : "Mute All"}
              </button>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              X
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
