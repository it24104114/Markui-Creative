'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Work', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function PublicNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-card'
            : 'bg-transparent',
        )}
      >
        <nav className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">
                Mark<span className="text-primary">UI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted
                               hover:text-white hover:bg-surface transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/contact" className="btn-primary text-xs px-4 py-2">
                Start a Project
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border md:hidden"
          >
            <nav className="section-container py-4">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-4 py-3 rounded-lg text-sm font-medium text-text-muted
                                 hover:text-white hover:bg-surface transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Start a Project
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
