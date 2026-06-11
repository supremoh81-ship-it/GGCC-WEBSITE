'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  scale?: [number, number]
  opacity?: [number, number]
  y?: [number, number]
}

export function ScrollReveal({
  children,
  className,
  scale,
  opacity,
  y,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const scaleValue = useTransform(scrollYProgress, [0, 0.5], scale ?? [0.96, 1])
  const opacityValue = useTransform(scrollYProgress, [0, 0.2], opacity ?? [0.4, 1])
  const yValue = useTransform(scrollYProgress, [0, 0.4], y ?? [40, 0])

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{
        scale: scale !== undefined ? scaleValue : undefined,
        opacity: opacity !== undefined ? opacityValue : undefined,
        y: y !== undefined ? yValue : undefined,
      }}
    >
      {children}
    </motion.div>
  )
}
