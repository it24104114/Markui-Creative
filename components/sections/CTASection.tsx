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
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-surface border border-primary/20 p-12 md:p-16 text-center">
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />

            <div className="relative z-10">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
                Ready to Start?
              </p>
              <h2 className="text-display-md font-display font-bold text-white mb-5 max-w-2xl mx-auto">
                Let&apos;s Build Something
                <br />
                <span className="text-gradient">Remarkable Together</span>
              </h2>
              <p className="text-text-muted text-lg mb-10 max-w-lg mx-auto">
                Tell us about your project and we&apos;ll get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary px-8 py-3.5 text-base">
                  Start a Project
                  <ArrowUpRight size={16} />
                </Link>
                <Link href="/projects" className="btn-secondary px-8 py-3.5 text-base">
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
