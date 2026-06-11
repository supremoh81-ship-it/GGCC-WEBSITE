import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PlayerType = 'sermon' | 'podcast'

export interface PlayerTrack {
  id: string
  type: PlayerType
  title: string
  speaker?: string
  show?: string
  audioUrl: string
  coverUrl?: string
  duration?: number
}

interface PlayerState {
  track: PlayerTrack | null
  isPlaying: boolean
  currentTime: number
  volume: number
  muted: boolean
  speed: number
  queue: PlayerTrack[]
  setTrack: (track: PlayerTrack) => void
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  setMuted: (m: boolean) => void
  setSpeed: (s: number) => void
  setCurrentTime: (t: number) => void
  addToQueue: (track: PlayerTrack) => void
  clearQueue: () => void
  playNext: () => void
  playPrev: () => void
  close: () => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      track: null,
      isPlaying: false,
      currentTime: 0,
      volume: 0.8,
      muted: false,
      speed: 1,
      queue: [],

      setTrack: (track) => set({ track, isPlaying: true, currentTime: 0 }),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
      seek: (time) => set({ currentTime: time }),
      setVolume: (volume) => set({ volume }),
      setMuted: (muted) => set({ muted }),
      setSpeed: (speed) => set({ speed }),
      setCurrentTime: (currentTime) => set({ currentTime }),

      addToQueue: (track) =>
        set((s) => ({ queue: [...s.queue.filter((t) => t.id !== track.id), track] })),

      clearQueue: () => set({ queue: [] }),

      playNext: () => {
        const { track, queue } = get()
        if (!track || queue.length === 0) return
        const idx = queue.findIndex((t) => t.id === track.id)
        const next = queue[idx + 1]
        if (next) set({ track: next, isPlaying: true, currentTime: 0 })
      },

      playPrev: () => {
        const { track, queue } = get()
        if (!track || queue.length === 0) return
        const idx = queue.findIndex((t) => t.id === track.id)
        const prev = queue[idx - 1]
        if (prev) set({ track: prev, isPlaying: true, currentTime: 0 })
      },

      close: () => set({ track: null, isPlaying: false, currentTime: 0 }),
    }),
    {
      name: 'ggcc-player',
      partialize: (s) => ({
        volume: s.volume,
        muted: s.muted,
        speed: s.speed,
        queue: s.queue,
      }),
    }
  )
)
