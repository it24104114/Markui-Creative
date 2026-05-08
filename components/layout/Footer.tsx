import Link from 'next/link';
import { ArrowUpRight, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  Work: [
    { label: 'All Projects', href: '/projects' },
    { label: 'Branding', href: '/projects?category=branding' },
    { label: 'UI/UX Design', href: '/projects?category=ui-ux' },
    { label: 'Motion Design', href: '/projects?category=motion' },
  ],
  Studio: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Process', href: '/about#process' },
    { label: 'Contact', href: '/contact' },
  ],
};

const contactDetails = [
  { icon: Mail, label: 'info@markui.lk', href: 'mailto:info@markui.lk' },
  { icon: Phone, label: '+94 760 887 702', href: 'tel:+94760887702' },
  { icon: MapPin, label: '548, 1 Avissawella Rd, Wellampitiya 00800', href: 'https://maps.app.goo.gl/MVY8JbaCu7T3wGXW7' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0D0D0D]">
      <div className="section-container py-16 md:py-20">
        {/* Top */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">
                Mark<span className="text-primary">UI</span> Creative
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Premium creative studio crafting brands, interfaces, and digital experiences
              that leave lasting impressions.
            </p>
            {/* Contact Details */}
            <div className="space-y-2 mb-6">
              {contactDetails.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-2 text-xs text-white/40 hover:text-white/80 transition-colors duration-200 group"
                >
                  <Icon size={12} className="mt-0.5 shrink-0 text-primary group-hover:text-primary" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
            {/* Social */}
            <a
              href="https://www.instagram.com/_markui?igsh=d2hlczc2ZW5yYmNy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center gap-2 w-9 h-9 rounded-lg border border-white/10 justify-center
                         text-white/40 hover:text-white hover:border-primary/50 hover:bg-white/5
                         transition-all duration-200"
            >
              <Instagram size={15} />
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                  {category}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="md:text-right">
            <p className="text-white/40 text-sm mb-3">Have a project in mind?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold text-white
                         hover:text-primary transition-colors duration-200 group"
            >
              Let&apos;s talk
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Mark UI Creative. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/30">
              Crafted with{' '}
              <span className="text-primary">♥</span>
              {' '}in Sri Lanka
            </p>
            <Link
              href="/admin/login"
              className="text-xs text-white/20 hover:text-white/60 transition-colors duration-200"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
