import Link from 'next/link';
import { ArrowUpRight, Instagram, Twitter, Linkedin, Dribbble } from 'lucide-react';

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

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/markui.lk' },
  { icon: Twitter, label: 'Twitter/X', href: 'https://twitter.com/markui' },
  { icon: Dribbble, label: 'Dribbble', href: 'https://dribbble.com/markui' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/markui' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="section-container py-16 md:py-20">
        {/* Top */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">
                Mark<span className="text-primary">UI</span> Creative
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Premium creative studio crafting brands, interfaces, and digital experiences
              that leave lasting impressions.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center
                             text-text-muted hover:text-white hover:border-primary/50 hover:bg-surface
                             transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-4">
                  {category}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-muted hover:text-white transition-colors duration-200"
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
            <p className="text-text-muted text-sm mb-3">Have a project in mind?</p>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-text-subtle">
            © {new Date().getFullYear()} Mark UI Creative. All rights reserved.
          </p>
          <p className="text-xs text-text-subtle">
            Crafted with{' '}
            <span className="text-primary">♥</span>
            {' '}in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
