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
  // const {
  //   bgmVolume,
  //   sfxVolume,
  //   isMuted,
  //   isBgmMuted,
  //   isSfxMuted,
  //   selectedSfx,
  //   setSettings,
  // } = useSoundSettings();

  // const handleVolumeChange = (type: "bgm" | "sfx", value: number) => {
  //   setSettings((prev) => ({
  //     ...prev,
  //     [`${type}Volume`]: value,
  //   }));
  // };

  // const handleMuteToggle = (type: "all" | "bgm" | "sfx") => {
  //   setSettings((prev) => {
  //     if (type === "all") {
  //       const muted = !prev.isMuted;
  //       return {
  //         ...prev,
  //         isMuted: muted,
  //         isBgmMuted: muted,
  //         isSfxMuted: muted,
  //         bgmVolume: muted ? 0 : 50,
  //         sfxVolume: muted ? 0 : 50,
  //       };
  //     } else {
  //       return {
  //         ...prev,
  //         [`is${type === "bgm" ? "Bgm" : "Sfx"}Muted`]:
  //           !prev[`is${type === "bgm" ? "Bgm" : "Sfx"}Muted`],
  //       };
  //     }
  //   });
  // };

  return null;
}
