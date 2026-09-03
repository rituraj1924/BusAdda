"use client";

import React from "react";
import { useJourneyStore } from "@/store/useJourneyStore";

export default function DayNightToggle() {
  const { mode, setMode, isModeTransitioning } = useJourneyStore();

  const handleToggle = () => {
    if (isModeTransitioning) return;
    setMode(mode === "day" ? "night" : "day");
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isModeTransitioning}
      aria-label={mode === "day" ? "Switch to Night+Rain mode" : "Switch to Day mode"}
      className={[
        "relative flex items-center gap-2 px-3 py-2 rounded-full",
        "bg-black/40 backdrop-blur-md border border-white/10",
        "text-white text-sm font-medium",
        "shadow-lg shadow-black/30",
        "transition-all duration-300 ease-in-out",
        "active:scale-95 select-none",
        isModeTransitioning ? "opacity-50 cursor-not-allowed" : "hover:bg-black/60 cursor-pointer",
      ].join(" ")}
    >
      {/* Toggle track */}
      <div
        className={[
          "relative w-10 h-5 rounded-full transition-colors duration-500",
          mode === "day"
            ? "bg-gradient-to-r from-amber-400 to-orange-400"
            : "bg-gradient-to-r from-indigo-800 to-blue-900",
        ].join(" ")}
      >
        {/* Thumb */}
        <div
          className={[
            "absolute top-0.5 w-4 h-4 rounded-full shadow-md",
            "transition-all duration-500 ease-in-out flex items-center justify-center",
            "text-[10px]",
            mode === "day"
              ? "left-0.5 bg-yellow-200"
              : "left-[22px] bg-slate-200",
          ].join(" ")}
        >
          {mode === "day" ? "☀️" : "🌙"}
        </div>
      </div>

      {/* Label */}
      <span className="text-xs text-white/80 tracking-wide min-w-[38px]">
        {mode === "day" ? "Day" : "Night"}
      </span>
    </button>
  );
}
