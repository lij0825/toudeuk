import React, { useEffect, useRef } from "react";
import { useMusicControlStore } from "@/store/MusicControlStore";

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { 
    bgmVolume, 
    isMuted, 
    isBgmMuted,
    isPlaying,
    setIsPlaying 
  } = useMusicControlStore();

  // 볼륨과 음소거 상태 변경 시 처리
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = bgmVolume / 100;

      const shouldPlay = !isMuted && !isBgmMuted && isPlaying;
      
      if (shouldPlay) {
        audioRef.current
          .play()
          .catch((err) => {
            console.error("Failed to play background music:", err);
            setIsPlaying(false);
          });
      } else {
        audioRef.current.pause();
      }
    }
  }, [bgmVolume, isMuted, isBgmMuted, isPlaying]);

  // 컴포넌트 마운트 시 이전 재생 상태 복원
  useEffect(() => {
    if (audioRef.current && isPlaying && !isMuted && !isBgmMuted) {
      audioRef.current
        .play()
        .catch((err) => {
          console.error("Failed to play background music:", err);
          setIsPlaying(false);
        });
    }
  }, []);

  // 오디오 이벤트 리스너
  useEffect(() => {
    const audio = audioRef.current;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    if (audio) {
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  return (
    <audio
      id="audioPlayer"
      ref={audioRef}
      src="/audio/Toudeuk2.mp3"
      loop
    />
  );
};