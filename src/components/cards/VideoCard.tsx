"use client";

import React, { useRef, useState, useEffect } from "react";
import { PostCardData } from "@/lib/types";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface VideoCardProps {
  card: PostCardData;
  isActive: boolean;
}

export function VideoCard({ card, isActive }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      const playPromise = videoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const title = card.cardMetadata?.title || "Video nổi bật";

  return (
    <div
      className="relative w-full h-full rounded-[22px] overflow-hidden bg-black flex items-center justify-center cursor-pointer select-none"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={card.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41551-large.mp4"}
        poster={card.cardMetadata?.poster}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Subtle Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2C]/80 via-transparent to-black/40 pointer-events-none" />

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-[#183A60]/80 backdrop-blur-md border border-[#D4DBF5]/20 text-[#D4DBF5] hover:text-white transition shadow-lg"
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#0095CF]" />}
        </button>
      </div>

      {/* Title */}
      <div className="absolute bottom-5 left-4 right-4 z-10 pointer-events-none">
        <h3 className="text-base font-bold text-white drop-shadow-md">
          {title}
        </h3>
      </div>

      {/* Play/Pause Center Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-[#183A60]/80 backdrop-blur-md border border-[#D4DBF5]/30 flex items-center justify-center text-white shadow-2xl">
            <Play className="w-7 h-7 ml-1 text-[#0095CF]" fill="#0095CF" />
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-20">
        <div
          className="h-full bg-gradient-to-r from-[#0095CF] to-[#FF7F00] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
