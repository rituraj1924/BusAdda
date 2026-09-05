"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useJourneyStore, PLAYLISTS } from "@/store/useJourneyStore";

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (v: number) => void;
  loadVideoById: (id: string) => void;
  loadPlaylist: (args: { listType: string; list: string; index?: number }) => void;
  nextVideo: () => void;
  previousVideo: () => void;
  getVideoData: () => { video_id?: string; title?: string; author?: string };
}

interface YTEvent {
  target: YTPlayerInstance;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        id: string,
        options: {
          height: string;
          width: string;
          videoId?: string;
          playerVars: Record<string, unknown>;
          events: {
            onReady?: (e: YTEvent) => void;
            onStateChange?: (e: YTEvent) => void;
            onError?: (e: YTEvent) => void;
          };
        }
      ) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady: (() => void) | undefined;
    _ytReady: boolean;
  }
}

let _apiLoading = false;

function loadYTApi(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window._ytReady) {
      resolve();
      return;
    }
    if (!_apiLoading) {
      _apiLoading = true;
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      window._ytReady = true;
      prev?.();
      resolve();
    };
  });
}

export default function YoutubePlayer() {
  const {
    playlist,
    customVideoId,
    musicMuted,
    musicPlaying,
    hasInteractedMusic,
    nowPlayingVideoId,
    nowPlayingTitle,
    showVideoPreview,
    setMusicPlaying,
    setNowPlayingTitle,
    setNowPlayingVideoId,
    setVideoPreview,
    toggleMusicPlaying,
  } = useJourneyStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const readyRef = useRef(false);
  const queueRef = useRef<(() => void) | null>(null);
  const mutedRef = useRef(musicMuted);
  const playingRef = useRef(musicPlaying);
  const skippingRef = useRef(false);
  const prevPlaylistRef = useRef<string | null>(null);
  const prevCustomIdRef = useRef<string | null>(null);

  // Track failed video thumbnail loads purely by video ID (no cascading setState in effects)
  const [failedVideoIds, setFailedVideoIds] = useState<Record<string, boolean>>({});

  const safe = useCallback((fn: () => void) => {
    if (readyRef.current && playerRef.current) {
      try {
        fn();
      } catch {
        // Safe fallback
      }
    } else {
      queueRef.current = fn;
    }
  }, []);

  // Determine active video ID for thumbnail
  const currentPl = PLAYLISTS.find((p) => p.id === playlist);
  const activeVideoId =
    nowPlayingVideoId || currentPl?.defaultVideoId || "5MIGQBpVeqs";
  const imgError = failedVideoIds[activeVideoId] === true;

  // Initialize or cleanly recreate the YouTube Player
  const initOrSwitchPlayer = useCallback(
    (targetPlaylist: string, targetCustomId: string, autoPlay: boolean) => {
      // 1. Immediately silence and destroy any previous player
      if (playerRef.current) {
        try {
          playerRef.current.stopVideo();
        } catch {}
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
        readyRef.current = false;
      }

      // 2. Reset DOM element inside container
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div id="yt-engine-disc" style="width:100%;height:100%"></div>';
      }

      if (!window.YT?.Player) return;

      const onReadyHandler = (e: YTEvent) => {
        readyRef.current = true;
        e.target.setVolume(mutedRef.current ? 0 : 75);
        if (autoPlay) {
          try {
            e.target.playVideo();
          } catch {}
        }
        try {
          const d = e.target.getVideoData();
          if (d?.video_id) setNowPlayingVideoId(d.video_id);
          if (d?.title) setNowPlayingTitle(d.title);
        } catch {}
        if (queueRef.current) {
          queueRef.current();
          queueRef.current = null;
        }
      };

      const onStateChangeHandler = (e: YTEvent) => {
        try {
          const d = e.target.getVideoData();
          if (d?.video_id) setNowPlayingVideoId(d.video_id);
          if (d?.title) setNowPlayingTitle(d.title);
        } catch {}

        if (e.data === 1) {
          // PLAYING
          skippingRef.current = false;
          setMusicPlaying(true);
        } else if (e.data === 2) {
          // PAUSED — ignore brief buffering pause on skip
          if (!skippingRef.current) setMusicPlaying(false);
        } else if (e.data === 0) {
          // ENDED
          setMusicPlaying(false);
        }
      };

      const onErrorHandler = (e: YTEvent) => {
        if (e.data === 101 || e.data === 150) {
          safe(() => playerRef.current?.nextVideo());
        }
      };

      // 3. Initialize fresh player instance for target playlist
      if (targetPlaylist === "custom" && targetCustomId) {
        playerRef.current = new window.YT.Player("yt-engine-disc", {
          height: "100%",
          width: "100%",
          videoId: targetCustomId,
          playerVars: {
            autoplay: autoPlay ? 1 : 0,
            controls: 1,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: typeof window !== "undefined" ? window.location.origin : "",
          },
          events: {
            onReady: onReadyHandler,
            onStateChange: onStateChangeHandler,
            onError: onErrorHandler,
          },
        });
      } else {
        const pl = PLAYLISTS.find((p) => p.id === targetPlaylist) ?? PLAYLISTS[0];
        playerRef.current = new window.YT.Player("yt-engine-disc", {
          height: "100%",
          width: "100%",
          playerVars: {
            list: pl.youtubeListId,
            listType: "playlist",
            autoplay: autoPlay ? 1 : 0,
            controls: 1,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: typeof window !== "undefined" ? window.location.origin : "",
          },
          events: {
            onReady: onReadyHandler,
            onStateChange: onStateChangeHandler,
            onError: onErrorHandler,
          },
        });
      }
    },
    [safe, setMusicPlaying, setNowPlayingTitle, setNowPlayingVideoId]
  );

  // Mount & Playlist Switching Effect:
  // The moment user selects a different playlist, previous video is stopped/destroyed immediately
  // and the new playlist starts loading and playing right away if interacted before
  useEffect(() => {
    const isInitial = prevPlaylistRef.current === null;
    const playlistChanged = prevPlaylistRef.current !== playlist;
    const customChanged = prevCustomIdRef.current !== customVideoId;

    if (isInitial || playlistChanged || (playlist === "custom" && customChanged)) {
      prevPlaylistRef.current = playlist;
      prevCustomIdRef.current = customVideoId;

      const shouldAutoPlay = !isInitial && (hasInteractedMusic || musicPlaying);

      loadYTApi().then(() => {
        initOrSwitchPlayer(playlist, customVideoId, shouldAutoPlay);
      });
    }
  }, [playlist, customVideoId, hasInteractedMusic, musicPlaying, initOrSwitchPlayer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      try {
        playerRef.current?.stopVideo();
        playerRef.current?.destroy();
      } catch {}
    };
  }, []);

  // Mute
  useEffect(() => {
    mutedRef.current = musicMuted;
    safe(() => {
      if (musicMuted) {
        playerRef.current?.mute();
        playerRef.current?.setVolume(0);
      } else {
        playerRef.current?.unMute();
        playerRef.current?.setVolume(75);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicMuted]);

  // Play / Pause
  useEffect(() => {
    playingRef.current = musicPlaying;
    safe(() => {
      if (musicPlaying) playerRef.current?.playVideo();
      else playerRef.current?.pauseVideo();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicPlaying]);

  // Single-click Prev / Next with skipping flag
  useEffect(() => {
    const next = () =>
      safe(() => {
        skippingRef.current = true;
        playerRef.current?.nextVideo();
        setTimeout(() => {
          safe(() => playerRef.current?.playVideo());
          skippingRef.current = false;
        }, 850);
      });
    const prev = () =>
      safe(() => {
        skippingRef.current = true;
        playerRef.current?.previousVideo();
        setTimeout(() => {
          safe(() => playerRef.current?.playVideo());
          skippingRef.current = false;
        }, 850);
      });
    window.addEventListener("yt:next", next);
    window.addEventListener("yt:prev", prev);
    return () => {
      window.removeEventListener("yt:next", next);
      window.removeEventListener("yt:prev", prev);
    };
  }, [safe]);

  const thumbnailUrl = `https://img.youtube.com/vi/${activeVideoId}/mqdefault.jpg`;

  return (
    <>
      {/* ── YouTube Video Player Container (Hidden background audio player or Floating Video Preview) ── */}
      <div
        className={`transition-all duration-300 ${
          showVideoPreview
            ? "fixed z-50 bottom-44 left-4 right-4 max-w-sm mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/95 backdrop-blur-lg"
            : "fixed -bottom-[9999px] -left-[9999px] w-[320px] h-[180px] opacity-0 pointer-events-none overflow-hidden"
        }`}
      >
        {showVideoPreview && (
          <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-3 py-1.5 bg-black/80 backdrop-blur text-white text-xs font-medium border-b border-white/10">
            <span className="truncate pr-2">
              🎬 {nowPlayingTitle || "Now Playing"}
            </span>
            <button
              type="button"
              onClick={() => setVideoPreview(false)}
              className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white"
              aria-label="Close video preview"
            >
              ✕
            </button>
          </div>
        )}
        <div className="w-full h-full pt-7" ref={containerRef}>
          <div id="yt-engine-disc" className="w-full h-full" />
        </div>
      </div>

      {/* ── Circular Vinyl Disc Player with Full Video Cover Thumbnail ── */}
      <button
        type="button"
        onClick={toggleMusicPlaying}
        className={`relative flex-shrink-0 rounded-full overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-xl select-none group focus:outline-none p-0 bg-stone-900 ${
          musicPlaying
            ? "w-13 h-13 border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/30 scale-[1.03]"
            : "w-12 h-12 border-white/25 hover:border-white/50"
        }`}
        title={musicPlaying ? "Tap to Pause" : "Tap to Play"}
        aria-label={musicPlaying ? "Pause music" : "Play music"}
      >
        {/* Spinning Vinyl Container */}
        <div
          className={`w-full h-full relative transition-transform ${
            musicPlaying ? "animate-[spin_8s_linear_infinite]" : ""
          }`}
        >
          {/* Full Cover Thumbnail Image (fits entire circle edge-to-edge without distortion) */}
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={thumbnailUrl}
              alt={nowPlayingTitle || "Now Playing"}
              className="w-full h-full object-cover select-none pointer-events-none scale-110"
              draggable={false}
              onError={() =>
                setFailedVideoIds((prev) => ({ ...prev, [activeVideoId]: true }))
              }
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-stone-900 to-amber-950 flex items-center justify-center text-lg">
              {currentPl?.emoji || "🚌"}
            </div>
          )}

          {/* Vinyl sound groove concentric rings */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(0,0,0,0.22) 2.5px, transparent 3.5px)",
            }}
          />

          {/* Vinyl specular light reflection */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 42%, transparent 58%, rgba(255,255,255,0.12) 100%)",
            }}
          />

          {/* Center spindle hole with metallic ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-stone-950 border border-stone-400/60 shadow-inner flex items-center justify-center pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
          </div>
        </div>

        {/* Paused state play overlay badge */}
        {!musicPlaying && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-[0.5px]">
            <span className="text-white text-xs drop-shadow pl-0.5">▶</span>
          </div>
        )}
      </button>
    </>
  );
}
