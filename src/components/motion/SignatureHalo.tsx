'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface SignatureHaloProps {
  size?: number
  className?: string
}

/**
 * The site's signature motif — a slow-rotating gold ring with teal + magenta
 * bloom orbs (echoing the logo's swirl) and a dove that glides in once on load.
 */
export function SignatureHalo({ size = 560, className }: SignatureHaloProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="relative w-full h-full">
        {/* Outer rotating gold ring */}
        <div
          className={cnHalo(reduceMotion, 'animate-halo-spin')}
          style={{
            background: 'conic-gradient(from 0deg, rgba(201,168,76,0.5), transparent 30%, transparent 70%, rgba(201,168,76,0.5))',
            mask: 'radial-gradient(circle, transparent 62%, black 64%, black 70%, transparent 72%)',
            WebkitMask: 'radial-gradient(circle, transparent 62%, black 64%, black 70%, transparent 72%)',
          }}
        />

        {/* Inner counter-rotating teal/magenta ring */}
        <div
          className={cnHalo(reduceMotion, 'animate-halo-spin-slow')}
          style={{
            background: 'conic-gradient(from 90deg, rgba(31,168,160,0.4), transparent 25%, transparent 75%, rgba(194,58,130,0.4))',
            mask: 'radial-gradient(circle, transparent 48%, black 50%, black 56%, transparent 58%)',
            WebkitMask: 'radial-gradient(circle, transparent 48%, black 50%, black 56%, transparent 58%)',
          }}
        />

        {/* Teal bloom orb */}
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: size * 0.32,
            height: size * 0.32,
            top: '8%',
            left: '4%',
            background: 'radial-gradient(circle, rgba(31,168,160,0.35) 0%, transparent 75%)',
          }}
        />

        {/* Magenta bloom orb */}
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: size * 0.34,
            height: size * 0.34,
            bottom: '6%',
            right: '2%',
            background: 'radial-gradient(circle, rgba(194,58,130,0.32) 0%, transparent 75%)',
          }}
        />

        {/* Dove — glides in once, then rests with a gentle float */}
        <motion.svg
          viewBox="0 0 64 64"
          className="absolute"
          style={{ width: size * 0.16, height: size * 0.16, top: '14%', right: '18%' }}
          initial={reduceMotion ? { opacity: 0.9 } : { opacity: 0, x: -40, y: 18, scale: 0.85 }}
          animate={
            reduceMotion
              ? { opacity: 0.9 }
              : { opacity: 0.92, x: 0, y: [0, -6, 0], scale: 1 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  opacity: { duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  x: { duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 4.5, delay: 1.6, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <path
            d="M32 10c2 6 8 10 16 9-5 4-7 8-7 13 6-2 11 0 15 5-7 1-12 4-15 9-5-7-12-10-20-10-9 0-17 4-21 11-2-7 1-14 7-19-5-1-9-4-11-9 6 1 11-1 14-6 2 5 6 8 11 8 1-5 4-9 11-11z"
            fill="url(#doveGradient)"
            opacity="0.95"
          />
          <defs>
            <linearGradient id="doveGradient" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E8C97A" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
    </div>
  )
}

function cnHalo(reduceMotion: boolean | null, spinClass: string) {
  return `absolute inset-0 rounded-full ${reduceMotion ? '' : spinClass}`
}
