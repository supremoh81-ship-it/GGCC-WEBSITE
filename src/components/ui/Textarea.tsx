import { cn } from '@/lib/utils/cn'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-text-muted resize-none',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold',
            error
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-white/10 hover:border-brand-gold/30',
            className
          )}
          rows={props.rows ?? 4}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
