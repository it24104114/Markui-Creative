'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { staggerContainerDramatic, heroWordReveal, clipRevealUp } from '@/lib/animations';

const HEADLINE_WORDS_1 = ['We', 'Create'];
const HEADLINE_WORDS_2 = ['Visual'];
const HEADLINE_WORDS_3 = ['Experiences'];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const headlineY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const subtextY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const bgBlobY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 100);
    const t2 = setTimeout(() => setPreloaderDone(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {/* Pre-loader flash */}
      <AnimatePresence>
        {!preloaderDone && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-[100] bg-[#0D0D0D] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-display font-bold text-white text-2xl tracking-tight">
                Mark<span className="text-primary">UI</span>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Animated gradient blobs */}
        <motion.div
          style={{ y: bgBlobY }}
          initial={{ opacity: 0, scale: 0.5, filter: 'blur(60px)' }}
          animate={{ opacity: 0.25, scale: 1, filter: 'blur(90px)' }}
          transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary rounded-full pointer-events-none"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '20%']) }}
          initial={{ opacity: 0, scale: 0.4, filter: 'blur(80px)' }}
          animate={{ opacity: 0.12, scale: 1, filter: 'blur(120px)' }}
          transition={{ duration: 2.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary-700 rounded-full pointer-events-none"
        />

        {/* Main content */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="section-container relative z-10 text-center pt-24"
        >
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
              Premium Creative Studio
            </span>
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.5 }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </motion.div>

          {/* Headline with word-by-word clip reveal */}
          <motion.div style={{ y: headlineY }}>
            {/* Line 1: "We Create" */}
            <div className="overflow-hidden mb-2">
              <div className="flex flex-wrap justify-center gap-x-[0.3em]">
                {HEADLINE_WORDS_1.map((word, i) => (
                  <motion.span
                    key={word}
                    variants={heroWordReveal}
                    initial="hidden"
                    animate={loaded ? 'visible' : 'hidden'}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    className="inline-block text-[clamp(3rem,8vw,7rem)] font-display font-black leading-[1.0] tracking-tight text-foreground"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Line 2: "Visual" — in orange */}
            <div className="overflow-hidden mb-2">
              <div className="flex flex-wrap justify-center gap-x-[0.3em]">
                {HEADLINE_WORDS_2.map((word, i) => (
                  <motion.span
                    key={word}
                    variants={heroWordReveal}
                    initial="hidden"
                    animate={loaded ? 'visible' : 'hidden'}
                    transition={{ delay: 1.0 + i * 0.08 }}
                    className="inline-block text-[clamp(3rem,8vw,7rem)] font-display font-black leading-[1.0] tracking-tight text-gradient"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Line 3: "Experiences" */}
            <div className="overflow-hidden">
              <div className="flex flex-wrap justify-center gap-x-[0.3em]">
                {HEADLINE_WORDS_3.map((word, i) => (
                  <motion.span
                    key={word}
                    variants={heroWordReveal}
                    initial="hidden"
                    animate={loaded ? 'visible' : 'hidden'}
                    transition={{ delay: 1.1 + i * 0.08 }}
                    className="inline-block text-[clamp(3rem,8vw,7rem)] font-display font-black leading-[1.0] tracking-tight text-foreground"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Subtext + CTAs */}
          <motion.div
            style={{ y: subtextY }}
            variants={staggerContainerDramatic}
            initial="hidden"
            animate={loaded ? 'visible' : 'hidden'}
          >
            {/* Subtext */}
            <motion.p
              variants={clipRevealUp}
              transition={{ delay: 1.4 }}
              className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed mt-8 mb-10"
            >
              Premium creative studio crafting brands, interfaces, and digital experiences
              that leave lasting impressions. Based in Sri Lanka, working globally.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={clipRevealUp}
              transition={{ delay: 1.55 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/projects" className="btn-primary px-8 py-3.5 text-base group">
                View Our Work
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <ArrowUpRight size={16} />
                </motion.span>
              </Link>
              <Link href="/contact" className="btn-secondary px-8 py-3.5 text-base">
                Start a Project
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 2, duration: 0.6 }}
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
    </>
  );
}
