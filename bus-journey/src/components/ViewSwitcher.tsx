"use client";
import React from "react";
import { useJourneyStore, VIEWS, ViewId } from "@/store/useJourneyStore";

export default function ViewSwitcher() {
  const { currentView, setView } = useJourneyStore();

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Switch video view">
      {VIEWS.map((v) => {
        const active = v.id === currentView;
        return (
          <button
            key={v.id}
            onClick={() => setView(v.id as ViewId)}
            aria-pressed={active}
            title={`${v.label} — ${v.hindi}`}
            className={[
              "flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border text-center",
              "transition-all duration-200 active:scale-90 cursor-pointer select-none",
              active
                ? "bg-white/90 border-white text-black shadow-lg scale-[1.06]"
                : "bg-black/40 border-white/15 text-white/70 hover:bg-white/15 hover:text-white backdrop-blur",
            ].join(" ")}
          >
            <span className="text-base leading-none">{v.emoji}</span>
            <span className={`text-[9px] font-semibold leading-tight ${active ? "text-black" : "text-white/60"}`}>
              {v.hindi}
            </span>
          </button>
        );
      })}
    </div>
  );
}