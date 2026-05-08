'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionReveal } from '@/components/ui/SectionReveal';

export function CTASection() {
  return (
    <section className="section-padding border-t border-border">
      <div className="section-container">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#0D0D0D] p-12 md:p-16 text-center border border-white/5">
            {/* Animated background orb */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] pointer-events-none"
            />

            <div className="relative z-10">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
                Ready to Start?
              </p>
              <h2 className="text-display-md font-display font-bold text-white mb-5 max-w-2xl mx-auto">
                Let&apos;s Build Something
                <br />
                <span className="text-gradient">Remarkable Together</span>
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">
                Tell us about your project and we&apos;ll get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary px-8 py-3.5 text-base">
                  Start a Project
                  <ArrowUpRight size={16} />
                </Link>
                <Link href="/projects" className="btn-ghost-dark px-8 py-3.5 text-base">
                  See Our Work
                </Link>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
