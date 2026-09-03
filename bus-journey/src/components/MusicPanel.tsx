"use client";
import React, { useState } from "react";
import YoutubePlayer from "@/components/YoutubePlayer";
import { useJourneyStore, PLAYLISTS, PlaylistId } from "@/store/useJourneyStore";

export default function MusicPanel() {
  const {
    playlist,
    customVideoId,
    musicPlaying,
    musicMuted,
    nowPlayingTitle,
    showVideoPreview,
    setPlaylist,
    setCustomVideoId,
    toggleMusicPlaying,
    toggleMusicMute,
    toggleVideoPreview,
  } = useJourneyStore();

  const [expanded, setExpanded] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const curPl =
    playlist === "custom"
      ? { label: "Custom Song", emoji: "✨" }
      : PLAYLISTS.find((p) => p.id === playlist) ?? PLAYLISTS[0];

  const handleCustom = (e: React.FormEvent) => {
    e.preventDefault();
    let id = urlInput.trim();
    if (id.includes("v=")) id = id.split("v=")[1].split("&")[0];
    else if (id.includes("youtu.be/")) id = id.split("youtu.be/")[1].split("?")[0];
    if (id) {
      setCustomVideoId(id);
      setShowInput(false);
      setUrlInput("");
    }
  };

  return (
    <div className="w-full px-3 pb-safe">
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "rgba(8, 8, 18, 0.82)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow:
            "0 12px 48px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
        role="region"
        aria-label="Music player"
      >
        {/* ── Header row ── */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Circular vinyl disc / YT cover thumbnail */}
          <YoutubePlayer />

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{curPl.emoji}</span>
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {curPl.label}
              </p>
            </div>
            <p className="text-white/50 text-[10px] truncate leading-tight mt-0.5">
              {musicPlaying ? nowPlayingTitle || "Playing…" : "Tap disc or ▶ to play"}
            </p>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={toggleMusicMute}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all active:scale-90 ${
                musicMuted
                  ? "bg-red-500/25 border-red-500/40 text-red-300"
                  : "bg-white/10 border-white/10 text-white/70 hover:bg-white/20"
              }`}
              aria-label={musicMuted ? "Unmute music" : "Mute music"}
              title={musicMuted ? "Unmute music" : "Mute music"}
            >
              {musicMuted ? "🔇" : "🔈"}
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("yt:prev"))}
              className="w-8 h-8 rounded-full bg-white/8 border border-white/10 text-white/70 text-xs flex items-center justify-center active:scale-90 hover:bg-white/15 cursor-pointer"
              aria-label="Previous song"
              title="Previous song"
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={toggleMusicPlaying}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold transition-all active:scale-90 shadow-xl cursor-pointer ${
                musicPlaying
                  ? "bg-white text-black shadow-white/25"
                  : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
              }`}
              aria-label={musicPlaying ? "Pause" : "Play"}
              title={musicPlaying ? "Pause" : "Play"}
            >
              {musicPlaying ? "⏸" : "▶"}
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("yt:next"))}
              className="w-8 h-8 rounded-full bg-white/8 border border-white/10 text-white/70 text-xs flex items-center justify-center active:scale-90 hover:bg-white/15 cursor-pointer"
              aria-label="Next song"
              title="Next song"
            >
              ⏭
            </button>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-white/40 hover:text-white text-xs px-1 transition-colors cursor-pointer"
              aria-label={expanded ? "Collapse" : "Expand"}
              title={expanded ? "Collapse menu" : "Expand playlists"}
            >
              {expanded ? "▼" : "▲"}
            </button>
          </div>
        </div>

        {/* ── Expandable playlist selector + custom URL ── */}
        {expanded && (
          <div className="px-3 pb-3 border-t border-white/6 pt-2 space-y-2">
            {/* Playlist pills */}
            <div
              className="flex gap-2 items-center overflow-x-auto scrollbar-hide"
              role="tablist"
            >
              {PLAYLISTS.map((pl) => (
                <button
                  key={pl.id}
                  type="button"
                  role="tab"
                  aria-selected={pl.id === playlist}
                  onClick={() => setPlaylist(pl.id as PlaylistId)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                    pl.id === playlist
                      ? "bg-white text-black border-white font-semibold shadow"
                      : "bg-white/8 text-white/70 border-white/10 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <span>{pl.emoji}</span>
                  <span>{pl.label}</span>
                </button>
              ))}
              {customVideoId && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={playlist === "custom"}
                  onClick={() => setPlaylist("custom")}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 cursor-pointer ${
                    playlist === "custom"
                      ? "bg-white text-black border-white"
                      : "bg-white/8 text-white/70 border-white/10 hover:bg-white/15"
                  }`}
                >
                  <span>✨</span>
                  <span>Custom</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowInput(!showInput)}
                className="flex-shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 hover:bg-amber-500/30 whitespace-nowrap transition-colors cursor-pointer"
                title="Add YouTube video link"
              >
                + Link
              </button>

              {/* Video preview toggle */}
              <button
                type="button"
                onClick={toggleVideoPreview}
                className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-full border transition-all whitespace-nowrap ml-auto cursor-pointer ${
                  showVideoPreview
                    ? "bg-amber-400 text-black border-amber-400 font-semibold shadow"
                    : "bg-white/8 text-white/70 border-white/10 hover:bg-white/15 hover:text-white"
                }`}
                title="Toggle live video preview"
              >
                <span>🎬 Video</span>
              </button>
            </div>

            {/* Custom URL form */}
            {showInput && (
              <form onSubmit={handleCustom} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube link or video ID"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400/60"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black text-xs px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Play
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}