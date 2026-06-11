import { cn } from '@/lib/utils/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy disabled:opacity-50 disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        gold: 'btn-gold',
        'outline-gold': 'btn-outline-gold',
        ghost: 'btn-ghost',
        danger: 'bg-red-600 text-white rounded-full hover:bg-red-700 active:scale-95',
        link: 'text-brand-gold underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'text-sm px-4 py-2 rounded-full',
        md: 'text-base px-6 py-3 rounded-full',
        lg: 'text-lg px-8 py-4 rounded-full',
        icon: 'h-10 w-10 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'gold',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
