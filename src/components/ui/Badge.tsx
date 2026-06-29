import { cn } from '@/lib/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full text-xs font-semibold px-3 py-1 transition-colors',
  {
    variants: {
      variant: {
        gold: 'bg-brand-gold/15 text-brand-gold border border-brand-gold/25',
        teal: 'bg-brand-teal/15 text-brand-teal-light border border-brand-teal/25',
        magenta: 'bg-brand-magenta/15 text-brand-magenta-light border border-brand-magenta/25',
        blue: 'bg-brand-blue-mid/60 text-brand-gold-light border border-brand-gold/15',
        white: 'bg-white/10 text-white border border-white/15',
        success: 'bg-green-500/15 text-green-400 border border-green-500/25',
        warning: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
        danger: 'bg-red-500/15 text-red-400 border border-red-500/25',
        muted: 'bg-white/5 text-text-muted border border-white/8',
      },
    },
    defaultVariants: {
      variant: 'gold',
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
