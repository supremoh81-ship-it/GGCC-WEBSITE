'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ background: '#0A1628', margin: 0, fontFamily: 'sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center',
            padding: '24px',
          }}
        >
          <h1 style={{ color: '#ffffff', fontSize: '28px', margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '400px', margin: 0 }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#C9A84C',
              color: '#0A1628',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
