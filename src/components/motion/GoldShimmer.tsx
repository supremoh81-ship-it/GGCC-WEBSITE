'use client'

import { cn } from '@/lib/utils/cn'

interface GoldShimmerProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p'
}

export function GoldShimmer({ children, className, as: Tag = 'span' }: GoldShimmerProps) {
  return (
    <Tag
      className={cn(
        'bg-gradient-gold bg-[length:200%_auto] bg-clip-text text-transparent',
        'animate-shimmer',
        className
      )}
    >
      {children}
    </Tag>
  )
}
