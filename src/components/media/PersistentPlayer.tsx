'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStore } from '@/store/playerStore'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Rewind,
  FastForward,
} from 'lucide-react'

export function PersistentPlayer() {
  const {
    track,
    isPlaying,
    currentTime,
    volume,
    muted,
    speed,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    setMuted,
    setSpeed,
    setCurrentTime,
    playNext,
    playPrev,
    close,
    queue,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    audio.src = track.audioUrl
    if (isPlaying) audio.play().catch(() => {})
  }, [track])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed])

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
  }

  const handleEnded = () => {
    if (queue.length > 1) playNext()
    else pause()
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const duration = audioRef.current?.duration ?? 0
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      <AnimatePresence>
        {track && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            {/* Progress bar */}
            <div className="relative h-1 bg-white/10 cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const pct = (e.clientX - rect.left) / rect.width
                const newTime = pct * (audioRef.current?.duration ?? 0)
                if (audioRef.current) audioRef.current.currentTime = newTime
                seek(newTime)
              }}
            >
              <div
                className="absolute inset-y-0 left-0 bg-brand-gold transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="bg-brand-navy/95 backdrop-blur-xl border-t border-white/10 px-4 py-3">
              <div className="max-w-7xl mx-auto flex items-center gap-4">
                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white line-clamp-1">{track.title}</div>
                  <div className="text-xs text-text-muted">{track.speaker ?? track.show}</div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={playPrev}
                    className="p-1.5 text-text-muted hover:text-white transition-colors"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.max(0, currentTime - 15)
                        seek(audioRef.current.currentTime)
                      }
                    }}
                    className="p-1.5 text-text-muted hover:text-white transition-colors"
                  >
                    <Rewind className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggle}
                    className="w-9 h-9 rounded-full bg-brand-gold flex items-center justify-center hover:bg-brand-gold-light transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 text-brand-navy fill-current" />
                    ) : (
                      <Play className="h-4 w-4 text-brand-navy fill-current ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.min(duration, currentTime + 30)
                        seek(audioRef.current.currentTime)
                      }
                    }}
                    className="p-1.5 text-text-muted hover:text-white transition-colors"
                  >
                    <FastForward className="h-4 w-4" />
                  </button>
                  <button
                    onClick={playNext}
                    className="p-1.5 text-text-muted hover:text-white transition-colors"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>

                {/* Time */}
                <div className="hidden sm:flex items-center gap-1 text-xs text-text-muted">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Speed */}
                <button
                  onClick={() => {
                    const speeds = [1, 1.25, 1.5, 2]
                    const idx = speeds.indexOf(speed)
                    setSpeed(speeds[(idx + 1) % speeds.length])
                  }}
                  className="hidden sm:block text-xs text-text-muted hover:text-white transition-colors font-mono w-10 text-center"
                >
                  {speed}x
                </button>

                {/* Volume */}
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-1.5 text-text-muted hover:text-white transition-colors"
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                {/* Close */}
                <button
                  onClick={close}
                  className="p-1.5 text-text-muted hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
