'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AdminTestimonyActionsProps {
  id: string
}

export function AdminTestimonyActions({ id }: AdminTestimonyActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  async function act(action: 'approve' | 'reject') {
    setLoading(action)
    try {
      const res = await fetch(`/api/testimonies/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error()
      toast.success(action === 'approve' ? 'Testimony approved' : 'Testimony rejected')
      router.refresh()
    } catch {
      toast.error('Failed to update testimony.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        onClick={() => act('approve')}
        disabled={loading !== null}
        className="w-7 h-7 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 flex items-center justify-center transition-colors"
        title="Approve"
      >
        <Check className="h-3.5 w-3.5 text-green-400" />
      </button>
      <button
        onClick={() => act('reject')}
        disabled={loading !== null}
        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-colors"
        title="Reject"
      >
        <X className="h-3.5 w-3.5 text-red-400" />
      </button>
    </div>
  )
}
