import Link from 'next/link'
import { ShieldX, Home } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="h-8 w-8 text-red-400" />
        </div>
        <div className="text-[80px] font-display font-black text-red-500/10 leading-none select-none mb-2">
          403
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">Access Denied</h1>
        <p className="text-text-muted mb-8">
          You do not have permission to view this page. Please contact an administrator
          if you believe this is an error.
        </p>
        <Link href="/" className="btn-gold">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
