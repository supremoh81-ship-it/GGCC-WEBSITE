'use client'

import { useEffect } from 'react'
import { RefreshCw, Home } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">
          Something Went Wrong
        </h1>
        <p className="text-text-muted mb-8">
          An unexpected error occurred. Our team has been notified.
          Please try again or return to the homepage.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={reset} className="btn-gold">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <a href="/" className="btn-ghost">
            <Home className="h-4 w-4" />
            Go Home
          </a>
        </div>
        {error.digest && (
          <p className="text-xs text-text-muted/40 mt-6">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
