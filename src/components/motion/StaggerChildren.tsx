'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils/cn'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  once?: boolean
}

export function StaggerChildren({
  children,
  className,
  stagger = 0.12,
  delay = 0,
  once = true,
}: StaggerChildrenProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: once })

  const container = {
    ...containerVariants,
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div className={cn(className)} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
