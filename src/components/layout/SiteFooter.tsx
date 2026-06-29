import Link from 'next/link'
import Image from 'next/image'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, Twitter } from 'lucide-react'

const footerLinks = {
  Media: [
    { label: 'Sermons', href: '/sermons' },
    { label: 'Podcasts', href: '/podcasts' },
    { label: 'Gallery', href: '/gallery' },
  ],
  Community: [
    { label: 'Prayer Hub', href: '/prayer' },
    { label: 'Testimonies', href: '/testimonies' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Events', href: '/events' },
  ],
  'About Us': [
    { label: 'Our Story', href: '/about' },
    { label: 'Global Impact', href: '/global-impact' },
    { label: 'Give', href: '/give' },
    { label: 'Contact', href: '/contact' },
  ],
  Members: [
    { label: 'Sign In', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'My Dashboard', href: '/member/dashboard' },
  ],
}

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter / X' },
]

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy border-t border-white/8">
      {/* Newsletter bar */}
      <div className="border-b border-white/8">
        <div className="container mx-auto px-4 max-w-7xl py-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-xl mb-1">Stay Connected</h3>
            <p className="text-text-muted text-sm">Receive weekly devotionals, event notices, and sermon updates.</p>
          </div>
          <form className="flex gap-3 w-full md:w-auto" action="/api/newsletter" method="POST">
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              required
              className="flex-1 md:w-72 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
            />
            <button type="submit" className="btn-gold px-6 py-3 text-sm whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Grace for Greatness Christian Centre"
                  fill
                  className="object-contain drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]"
                  sizes="48px"
                />
              </div>
              <div>
                <div className="font-display font-bold text-white text-base leading-none">Grace for Greatness</div>
                <div className="text-[9px] text-text-muted tracking-widest uppercase mt-0.5">Christian Centre</div>
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-xs">
              A global church community rooted in faith, serving the world with love, purpose, and the transforming power of the Gospel.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:border-brand-gold/40 hover:text-brand-gold transition-all hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-brand-gold tracking-widest uppercase mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-6">
            <a href="mailto:Connectggcchurch@gmail.com" className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
              <Mail className="h-4 w-4 text-brand-gold" />
              Connectggcchurch@gmail.com
            </a>
            <a href="tel:+23490557326674" className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
              <Phone className="h-4 w-4 text-brand-gold" />
              +234 905 5732 6674
            </a>
            <span className="flex items-center gap-2 text-sm text-text-muted">
              <MapPin className="h-4 w-4 text-brand-gold" />
              Ofatedo, Osogbo, Osun State
            </span>
          </div>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} GGCC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
