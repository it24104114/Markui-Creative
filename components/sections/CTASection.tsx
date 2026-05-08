'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { heroWordReveal } from '@/lib/animations';

const CTA_WORDS = ['Remarkable', 'Together'];

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const bgY  = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section ref={ref} className="relative section-padding border-t border-border overflow-hidden">
      <div className="section-container">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl min-h-[520px] flex items-center justify-center">

            {/* ── Background image with parallax ── */}
            <motion.div style={{ y: bgY }} className="absolute inset-[-15%] z-0">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=75"
                alt="Creative team at work"
                fill
                className="object-cover"
                sizes="100vw"
              />
              {/* Deep dark overlay so text is always legible */}
              <div className="absolute inset-0 bg-[#0D0D0D]/85" />
            </motion.div>

            {/* ── Pulsing orange orb ── */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              <div className="w-[600px] h-[600px] bg-primary rounded-full blur-[140px]" />
            </motion.div>

            {/* ── Content ── */}
            <motion.div style={{ y: textY }} className="relative z-10 text-center px-6 py-16 max-w-3xl">
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em] mb-6">
                Ready to Start?
              </p>

              <h2 className="font-display font-black text-white mb-2 leading-[1.0]"
                style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', letterSpacing: '-0.03em' }}>
                Let&apos;s Build Something
              </h2>

              {/* Word-by-word reveal on scroll */}
              <div className="flex flex-wrap justify-center gap-x-[0.28em] overflow-hidden mb-8">
                {CTA_WORDS.map((word, i) => (
                  <motion.span
                    key={word}
                    variants={heroWordReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="inline-block font-display font-black text-gradient"
                    style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', lineHeight: 1.0, letterSpacing: '-0.03em' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Tell us about your project and we&apos;ll get back to you within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary px-8 py-4 text-base">
                  Start a Project
                  <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="mailto:info@markui.lk"
                  className="btn-ghost-dark px-8 py-4 text-base flex items-center gap-2"
                >
                  <Mail size={15} />
                  info@markui.lk
                </Link>
              </div>
            </motion.div>

          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

