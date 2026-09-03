"use client";
import React from "react";
import VideoPlayer from "@/components/VideoPlayer";
import DayNightToggle from "@/components/DayNightToggle";
import MuteControls from "@/components/MuteControls";
import MusicPanel from "@/components/MusicPanel";
import CinematicVignette from "@/components/CinematicVignette";
import ViewSwitcher from "@/components/ViewSwitcher";
import { useJourneyStore, VIEWS } from "@/store/useJourneyStore";

export default function Home() {
  const { currentView, mode } = useJourneyStore();
  const view = VIEWS.find((v) => v.id === currentView) ?? VIEWS[0];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Full-screen video background */}
      <VideoPlayer />

      {/* Cinematic vignette */}
      <CinematicVignette />

      {/* Top row: Day/Night toggle + Mute controls */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-4 safe-top">
        <DayNightToggle />
        <MuteControls />
      </div>

      {/* Current view indicator */}
      <div className="absolute bottom-[9.8rem] left-4 z-20 pointer-events-none">
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
          {mode === "day" ? "☀️ दिन" : "🌧️ रात"}&nbsp;·&nbsp;{view.hindi}
        </p>
      </div>

      {/* View switcher — sits smoothly above music panel */}
      <div className="absolute bottom-[6.8rem] left-0 right-0 z-30 flex justify-center px-4">
        <ViewSwitcher />
      </div>

      {/* Bottom: YouTube Music panel */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-3">
        <MusicPanel />
      </div>
    </div>
  );
}