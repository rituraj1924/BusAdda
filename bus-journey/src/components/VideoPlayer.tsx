"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useJourneyStore, VIEWS } from "@/store/useJourneyStore";

export default function VideoPlayer() {
  const { mode, currentView, videoMuted, videoVolume, isModeTransitioning, setModeTransitioning } =
    useJourneyStore();

  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(false);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const transitionRef = useRef(false);
  const [needsTap, setNeedsTap] = useState(false);

  const getClipSrc = useCallback((viewId: string, m: string) => {
    const v = VIEWS.find((x) => x.id === viewId) ?? VIEWS[0];
    return `/videos/${m}/clip${v.clip + 1}.mp4`;
  }, []);

  // Apply volume to a video element (honours muted flag)
  const applyVolume = useCallback(
    (vid: HTMLVideoElement | null) => {
      if (!vid) return;
      vid.muted = videoMuted;
      vid.volume = videoMuted ? 0 : videoVolume;
    },
    [videoMuted, videoVolume]
  );

  const safePlay = useCallback(
    (vid: HTMLVideoElement | null) => {
      if (!vid) return;
      applyVolume(vid);
      vid.play().catch((err) => {
        if (err.name === "NotAllowedError") {
          setNeedsTap(true);
          vid.muted = true;
          vid.volume = 0;
          vid.play().catch(() => {});
        }
      });
    },
    [applyVolume]
  );

  // Initial load — mount only
  useEffect(() => {
    const vidA = videoARef.current;
    if (!vidA) return;
    vidA.src = getClipSrc(currentView, mode);
    vidA.load();
    safePlay(vidA);
    setShowA(true);
    setShowB(false);
    setActiveSlot("A");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // View OR mode change → crossfade
  useEffect(() => {
    if (transitionRef.current) return;
    transitionRef.current = true;
    setModeTransitioning(true);

    const incoming = activeSlot === "A" ? videoBRef : videoARef;
    const nextSlot = activeSlot === "A" ? "B" : "A";

    if (incoming.current) {
      incoming.current.src = getClipSrc(currentView, mode);
      incoming.current.load();
      safePlay(incoming.current);
    }

    setTimeout(() => {
      if (nextSlot === "B") {
        setShowB(true);
        setTimeout(() => { setShowA(false); setActiveSlot("B"); }, 600);
      } else {
        setShowA(true);
        setTimeout(() => { setShowB(false); setActiveSlot("A"); }, 600);
      }
      setTimeout(() => {
        transitionRef.current = false;
        setModeTransitioning(false);
      }, 700);
    }, 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, mode]);

  // Volume / mute sync (slider or toggle)
  useEffect(() => {
    applyVolume(videoARef.current);
    applyVolume(videoBRef.current);
  }, [videoMuted, videoVolume, applyVolume]);

  // Unlock muted autoplay on first tap
  useEffect(() => {
    const unlock = () => {
      setNeedsTap(false);
      const active = activeSlot === "A" ? videoARef.current : videoBRef.current;
      if (active && !videoMuted) {
        active.muted = false;
        active.volume = videoVolume;
        active.play().catch(() => {});
      }
    };
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [activeSlot, videoMuted, videoVolume]);

  const base = "absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms]";

  return (
    <div className="absolute inset-0 w-full h-full bg-stone-950 overflow-hidden">
      <video
        ref={videoARef}
        className={`${base} ${showA ? "opacity-100" : "opacity-0"}`}
        autoPlay playsInline loop muted={videoMuted} preload="auto"
      />
      <video
        ref={videoBRef}
        className={`${base} ${showB ? "opacity-100" : "opacity-0"}`}
        autoPlay playsInline loop muted={videoMuted} preload="auto"
      />

      {/* Mode/view transition black flash */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${
          isModeTransitioning ? "opacity-80" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Tap-to-unlock audio hint */}
      {needsTap && !videoMuted && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-pulse">
          <div className="bg-black/70 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 text-white/80 text-[11px]">
            🔊 Tap to enable bus audio
          </div>
        </div>
      )}
    </div>
  );
}