"use client";
import React, { useState } from "react";
import { useJourneyStore } from "@/store/useJourneyStore";

export default function MuteControls() {
  const {
    videoMuted,
    videoVolume,
    musicMuted,
    toggleVideoMute,
    setVideoVolume,
    toggleMusicMute,
  } = useJourneyStore();

  const [showSlider, setShowSlider] = useState(false);

  const btnClass = (muted: boolean) =>
    [
      "flex items-center justify-center w-9 h-9 rounded-full",
      "backdrop-blur-md border transition-all duration-200 active:scale-90",
      "text-base shadow-md shadow-black/30 cursor-pointer",
      muted
        ? "bg-red-600/50 border-red-400/30 text-red-200"
        : "bg-black/40 border-white/10 text-white/80 hover:bg-black/60",
    ].join(" ");

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Audio controls">
      {/* Bus ambient volume group */}
      <div className="flex items-center gap-1.5">
        {/* Bus mute/volume icon — tap to toggle slider, hold icon itself to mute */}
        <button
          type="button"
          onClick={() => setShowSlider((s) => !s)}
          onDoubleClick={toggleVideoMute}
          aria-label={videoMuted ? "Unmute bus audio" : "Bus audio volume"}
          aria-pressed={videoMuted}
          className={btnClass(videoMuted)}
          title="Tap: show bus volume slider · Double-tap: mute/unmute"
        >
          {videoMuted || videoVolume === 0 ? "🔇" : videoVolume < 0.4 ? "🔉" : "🔊"}
        </button>

        {/* Inline volume slider */}
        <div
          className={[
            "overflow-hidden transition-all duration-300 flex items-center",
            showSlider ? "w-24 opacity-100" : "w-0 opacity-0",
          ].join(" ")}
          aria-hidden={!showSlider}
        >
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10"
            style={{ width: "96px" }}
          >
            <span className="text-[9px] text-white/50 leading-none flex-shrink-0">🚌</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={videoMuted ? 0 : videoVolume}
              onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
              aria-label="Bus audio volume"
              className="flex-1 h-1 appearance-none cursor-pointer rounded-full"
              style={{
                accentColor: videoMuted ? "#ef4444" : "#f59e0b",
                background: `linear-gradient(to right, ${
                  videoMuted ? "#ef4444" : "#f59e0b"
                } ${(videoMuted ? 0 : videoVolume) * 100}%, rgba(255,255,255,0.15) ${
                  (videoMuted ? 0 : videoVolume) * 100
                }%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Music mute */}
      <button
        type="button"
        onClick={toggleMusicMute}
        aria-label={musicMuted ? "Unmute music" : "Mute music"}
        aria-pressed={musicMuted}
        className={btnClass(musicMuted)}
        title={musicMuted ? "Unmute music" : "Mute music"}
      >
        {musicMuted ? "🎵" : "🎶"}
      </button>
    </div>
  );
}
