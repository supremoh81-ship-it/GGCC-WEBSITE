'use client'

import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel,
  size = 'md',
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100)

  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>{Math.round(percent)}% funded</span>
        </div>
      )}
      <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full bg-gradient-gold rounded-full transition-all duration-700',
            heights[size]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
