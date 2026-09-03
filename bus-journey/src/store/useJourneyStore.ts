import { create } from "zustand";

export type Mode = "day" | "night";
export type PlaylistId = "driver" | "bollywood" | "custom";
export type ViewId = "platform" | "boarding" | "driver" | "window";

export interface Playlist {
  id: PlaylistId;
  label: string;
  emoji: string;
  youtubeListId: string;
  defaultVideoId: string;
}

export const PLAYLISTS: Playlist[] = [
  {
    id: "driver",
    label: "Bus Driver Playlist",
    emoji: "🚌",
    youtubeListId: "PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna",
    defaultVideoId: "5MIGQBpVeqs",
  },
  {
    id: "bollywood",
    label: "90s Bollywood",
    emoji: "🎬",
    youtubeListId: "PL6VikFWYkZntwGEOxW1mBAXM797ne4hwp",
    defaultVideoId: "-1w2n4JmQzQ",
  },
];

export const VIEWS: { id: ViewId; label: string; hindi: string; emoji: string; clip: number }[] = [
  { id: "platform",  label: "Platform",    hindi: "प्लेटफॉर्म", emoji: "🚉", clip: 0 },
  { id: "boarding",  label: "Boarding",    hindi: "सवारी",      emoji: "🎟️", clip: 1 },
  { id: "driver",    label: "Driver POV",  hindi: "आगे से",     emoji: "🚌", clip: 2 },
  { id: "window",    label: "Window Seat", hindi: "खिड़की से",  emoji: "🪟", clip: 3 },
];

interface JourneyState {
  mode: Mode;
  currentView: ViewId;
  playlist: PlaylistId;
  customVideoId: string;
  videoMuted: boolean;
  videoVolume: number;          // 0–1, controls bus ambient audio volume
  musicMuted: boolean;
  musicPlaying: boolean;
  isModeTransitioning: boolean;
  nowPlayingTitle: string;
  nowPlayingVideoId: string;
  showVideoPreview: boolean;
  setMode: (mode: Mode) => void;
  setView: (view: ViewId) => void;
  setPlaylist: (id: PlaylistId) => void;
  setCustomVideoId: (id: string) => void;
  toggleVideoMute: () => void;
  setVideoVolume: (v: number) => void;
  toggleMusicMute: () => void;
  toggleMusicPlaying: () => void;
  setMusicPlaying: (playing: boolean) => void;
  setNowPlayingTitle: (title: string) => void;
  setNowPlayingVideoId: (id: string) => void;
  toggleVideoPreview: () => void;
  setVideoPreview: (show: boolean) => void;
  setModeTransitioning: (val: boolean) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  mode: "day",
  currentView: "platform",
  playlist: "driver",
  customVideoId: "",
  videoMuted: false,
  videoVolume: 0.8,
  musicMuted: false,
  musicPlaying: false,
  isModeTransitioning: false,
  nowPlayingTitle: "Bus Driver Playlist",
  nowPlayingVideoId: "5MIGQBpVeqs",
  showVideoPreview: false,
  setMode: (mode) => set({ mode }),
  setView: (view) => set({ currentView: view }),
  setPlaylist: (id) => {
    const pl = PLAYLISTS.find((p) => p.id === id);
    set({
      playlist: id,
      nowPlayingVideoId: pl ? pl.defaultVideoId : "",
      nowPlayingTitle: pl ? pl.label : "",
    });
  },
  setCustomVideoId: (id) =>
    set({
      customVideoId: id,
      nowPlayingVideoId: id,
      playlist: "custom",
      musicPlaying: true,
      nowPlayingTitle: "Custom YouTube Song",
    }),
  toggleVideoMute: () => set((s) => ({ videoMuted: !s.videoMuted })),
  setVideoVolume: (v) => set({ videoVolume: v, videoMuted: v === 0 }),
  toggleMusicMute: () => set((s) => ({ musicMuted: !s.musicMuted })),
  toggleMusicPlaying: () => set((s) => ({ musicPlaying: !s.musicPlaying })),
  setMusicPlaying: (playing) => set({ musicPlaying: playing }),
  setNowPlayingTitle: (title) => set({ nowPlayingTitle: title }),
  setNowPlayingVideoId: (id) => set({ nowPlayingVideoId: id }),
  toggleVideoPreview: () => set((s) => ({ showVideoPreview: !s.showVideoPreview })),
  setVideoPreview: (show) => set({ showVideoPreview: show }),
  setModeTransitioning: (val) => set({ isModeTransitioning: val }),
}));