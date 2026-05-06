'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          style={{ y }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '20%']) }}
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="section-container relative z-10 text-center pt-20"
      >
        {/* Tag */}
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            Premium Creative Studio
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-[clamp(3rem,8vw,7rem)] font-display font-bold leading-[1.05] tracking-tight text-white mb-6"
        >
          We Create
          <br />
          <span className="text-gradient">Visual</span>{' '}
          <span className="text-gradient-white">Experiences</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeInUp}
          className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed mb-10"
        >
          Premium creative studio crafting brands, interfaces, and digital experiences
          that leave lasting impressions. Based in Sri Lanka, working globally.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/projects" className="btn-primary px-8 py-3.5 text-base">
            View Our Work
            <ArrowUpRight size={16} />
          </Link>
          <Link href="/contact" className="btn-secondary px-8 py-3.5 text-base">
            Start a Project
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeInUp}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ArrowDown size={16} className="text-text-subtle" />
          </motion.div>
          <span className="text-xs text-text-subtle tracking-widest uppercase">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
