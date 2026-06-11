import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-[120px] font-display font-black text-brand-gold/10 leading-none select-none mb-2">
          404
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-text-muted mb-8">
          The page you are looking for does not exist or may have moved.
          Let us help you find your way back.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-gold">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link href="/sermons" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            Browse Sermons
          </Link>
        </div>
      </div>
    </div>
  )
}
