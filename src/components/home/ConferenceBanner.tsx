/**
 * CONFERENCE BANNER — Greatness Conference 2026 & 5th Year Anniversary
 * Theme: Grace for Exploits | 29 Jul – 2 Aug 2026
 * Safe to remove or swap after 2 August 2026.
 */

import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'

const WA_URL = 'https://chat.whatsapp.com/DhSLv5ZAzbQEvPYPiXbKu0'
const FB_URL = 'https://www.facebook.com/share/17uqVxtMPn/?mibextid=wwXIfr'

const CONFERENCE = {
  title: 'Greatness Conference 2026',
  subtitle: '5th Year Anniversary',
  theme: 'Grace for Exploits',
  dates: 'Wed 29th July – Sun 2nd August 2026',
  times: '5:00 PM (Wed–Fri) | 10:00 AM (Sunday)',
  venue: '07, Covenant Avenue, Dele Yes Sir Area, Ofatedo, Osogbo, Osun State',
  bannerSrc: '/images/greatness-conference-2026.jpg',
}

function WhatsAppIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L.057 23.571a.5.5 0 0 0 .611.611l5.715-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 0 1-5.003-1.37l-.36-.213-3.731.962.984-3.614-.235-.371A9.818 9.818 0 1 1 12 21.818z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function ConferenceBanner() {
  return (
    <FadeInUp>
      <section className="bg-brand-navy relative overflow-hidden border-t border-b border-brand-gold/15">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(201,168,76,0.07)_0%,transparent_70%)] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl py-8 sm:py-10 relative">

          {/* Status pill */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
              Happening Now
            </span>
            <span className="text-text-muted text-sm">{CONFERENCE.dates}</span>
          </div>

          {/* Banner image — full, object-contain, opens full-size on click */}
          <a
            href={CONFERENCE.bannerSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden border border-brand-gold/20 hover:border-brand-gold/50 transition-all duration-500 shadow-[0_0_50px_rgba(201,168,76,0.06)] group"
            aria-label="View Greatness Conference 2026 flyer"
          >
            <div className="relative w-full bg-brand-blue" style={{ aspectRatio: '16/7' }}>
              <Image
                src={CONFERENCE.bannerSrc}
                alt="Greatness Conference 2026 – Grace for Exploits"
                fill
                className="object-contain group-hover:scale-[1.01] transition-transform duration-700"
                priority
                sizes="(max-width: 768px) 100vw, 960px"
              />
            </div>
          </a>

          {/* Caption row */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-white font-display font-bold text-xl leading-snug">
                Join us — You&apos;re Invited!
              </p>
              <p className="text-brand-gold text-sm font-semibold mt-0.5 italic">
                Theme: &ldquo;{CONFERENCE.theme}&rdquo;
              </p>
              <p className="text-text-muted text-xs mt-1 leading-relaxed">
                {CONFERENCE.times}<br />
                {CONFERENCE.venue}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <WhatsAppIcon />
                Get updates on WhatsApp
              </a>
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <FacebookIcon />
                Follow on Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </FadeInUp>
  )
}
