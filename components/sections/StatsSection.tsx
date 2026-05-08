'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionReveal, RevealItem } from '@/components/ui/SectionReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const stats = [
  { value: 120, suffix: '+', label: 'Projects Delivered', description: 'Across multiple industries' },
  { value: 8,   suffix: '+', label: 'Years Experience',   description: 'In creative design' },
  { value: 60,  suffix: '+', label: 'Happy Clients',      description: 'Globally distributed' },
  { value: 15,  suffix: '+', label: 'Awards Won',         description: 'Design excellence recognition' },
];

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // The background image moves slower than scroll → parallax depth
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border">
      {/* ── Full-bleed background image with dark overlay ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-[-15%] z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=75"
          alt="Creative studio workspace"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0D0D0D]/88" />
      </motion.div>

      {/* ── Content ── */}
      <motion.div style={{ y: textY }} className="relative z-10 section-padding">
        <div className="section-container">
          <SectionReveal className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              By the Numbers
            </p>
            <h2 className="text-display-md font-display font-bold text-white">
              Results That{' '}
              <span className="text-gradient">Speak</span>
            </h2>
          </SectionReveal>

          <SectionReveal stagger className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {stats.map((stat) => (
              <RevealItem key={stat.label}>
                <div className="p-8 md:p-10 bg-[#0D0D0D]/60 backdrop-blur-sm text-center group hover:bg-primary/10 transition-colors duration-500">
                  <div className="text-[3.2rem] font-display font-black text-white mb-1 leading-none">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="font-semibold text-white/80 text-sm mb-1">{stat.label}</p>
                  <p className="text-xs text-white/40">{stat.description}</p>
                </div>
              </RevealItem>
            ))}
          </SectionReveal>
        </div>
      </motion.div>
    </section>
  );
}

