'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils/cn'

interface FadeInUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
  y?: number
}

export function FadeInUp({
  children,
  className,
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.1,
  y = 30,
}: FadeInUpProps) {
  const { ref, inView } = useInView({ threshold, triggerOnce: once })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
