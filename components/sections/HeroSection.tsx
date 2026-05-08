'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { heroWordReveal, clipRevealUp, staggerContainerDramatic } from '@/lib/animations';

// Real creative portfolio imagery from Unsplash (free, no auth needed)
const FLOATING_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    alt: 'Brand design work',
    cls: 'top-[12%] left-[3%] w-[220px] md:w-[280px]',
    rotate: -8,
    delay: 1.1,
  },
  {
    src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80',
    alt: 'UI design work',
    cls: 'top-[8%] right-[4%] w-[200px] md:w-[260px]',
    rotate: 6,
    delay: 1.3,
  },
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
    alt: 'Motion design work',
    cls: 'bottom-[18%] left-[5%] w-[180px] md:w-[230px]',
    rotate: 5,
    delay: 1.5,
  },
  {
    src: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80',
    alt: 'Web design work',
    cls: 'bottom-[14%] right-[3%] w-[200px] md:w-[250px]',
    rotate: -5,
    delay: 1.7,
  },
];

const HEADLINE_WORDS_1 = ['We', 'Create'];
const HEADLINE_WORDS_2 = ['Visual'];
const HEADLINE_WORDS_3 = ['Experiences'];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Parallax layers — each at a different depth
  const headlineY   = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const subtextY    = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const blobY       = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const imgLeft1Y   = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const imgRight1Y  = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const imgLeft2Y   = useTransform(scrollYProgress, [0, 1], ['0%', '-24%']);
  const imgRight2Y  = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale     = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  // Spring-damped opacity for smoother fade
  const smoothOpacity = useSpring(contentOpacity, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 80);
    const t2 = setTimeout(() => setPreloaderDone(true), 550);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const imgYValues = [imgLeft1Y, imgRight1Y, imgLeft2Y, imgRight2Y];

  return (
    <>
      {/* ── Preloader ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!preloaderDone && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-[100] bg-[#0D0D0D] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.4 } }}
              exit={{ scale: 1.15, opacity: 0, transition: { duration: 0.3 } }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-orange-glow">
                <span className="text-white font-black text-xl">M</span>
              </div>
              <span className="font-display font-bold text-white text-3xl tracking-tight">
                Mark<span className="text-primary">UI</span>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero section ──────────────────────────────────────────────────── */}
      <section
        ref={ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
      >
        {/* Subtle dot-grid background */}
        <motion.div
          style={{
            scale: bgScale,
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
        />

        {/* Orange gradient blobs — parallax depth */}
        <motion.div
          style={{ y: blobY }}
          initial={{ opacity: 0, scale: 0.4, filter: 'blur(80px)' }}
          animate={{ opacity: 0.18, scale: 1, filter: 'blur(100px)' }}
          transition={{ duration: 2.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/4 left-[35%] -translate-x-1/2 w-[700px] h-[700px] bg-primary rounded-full pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.3, filter: 'blur(100px)' }}
          animate={{ opacity: 0.08, scale: 1, filter: 'blur(130px)' }}
          transition={{ duration: 3, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-1/4 right-[20%] w-[500px] h-[500px] bg-primary-700 rounded-full pointer-events-none"
        />

        {/* ── Floating Portfolio Images ────────────────────────────────────── */}
        {FLOATING_IMAGES.map((img, i) => (
          <motion.div
            key={img.src}
            style={{ y: imgYValues[i] }}
            initial={{ opacity: 0, scale: 0.85, rotate: img.rotate * 0.3 }}
            animate={loaded ? {
              opacity: 1,
              scale: 1,
              rotate: img.rotate,
              transition: { duration: 0.9, delay: img.delay, ease: [0.16, 1, 0.3, 1] },
            } : {}}
            whileHover={{ scale: 1.04, rotate: 0, transition: { duration: 0.4 } }}
            className={`absolute ${img.cls} z-10 hidden lg:block`}
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-white/80">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="280px"
              />
              {/* Subtle sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        ))}

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: smoothOpacity }}
          className="section-container relative z-20 text-center pt-28 pb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full border border-border bg-surface/80 backdrop-blur-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-primary block"
            />
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.22em]">
              Premium Creative Studio — Sri Lanka
            </span>
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.7 }}
              className="w-1.5 h-1.5 rounded-full bg-primary block"
            />
          </motion.div>

          {/* ── Headline ── */}
          <motion.div style={{ y: headlineY }}>
            {/* Line 1 */}
            <div className="flex flex-wrap justify-center gap-x-[0.28em] overflow-hidden mb-1">
              {HEADLINE_WORDS_1.map((word, i) => (
                <motion.span
                  key={word}
                  variants={heroWordReveal}
                  initial="hidden"
                  animate={loaded ? 'visible' : 'hidden'}
                  transition={{ delay: 0.75 + i * 0.09 }}
                  className="inline-block text-[clamp(3.2rem,8.5vw,7.5rem)] font-display font-black leading-[1.0] tracking-[-0.03em] text-foreground"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Line 2 — orange */}
            <div className="flex flex-wrap justify-center gap-x-[0.28em] overflow-hidden mb-1">
              {HEADLINE_WORDS_2.map((word, i) => (
                <motion.span
                  key={word}
                  variants={heroWordReveal}
                  initial="hidden"
                  animate={loaded ? 'visible' : 'hidden'}
                  transition={{ delay: 0.95 + i * 0.09 }}
                  className="inline-block text-[clamp(3.2rem,8.5vw,7.5rem)] font-display font-black leading-[1.0] tracking-[-0.03em] text-gradient"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Line 3 */}
            <div className="flex flex-wrap justify-center gap-x-[0.28em] overflow-hidden">
              {HEADLINE_WORDS_3.map((word, i) => (
                <motion.span
                  key={word}
                  variants={heroWordReveal}
                  initial="hidden"
                  animate={loaded ? 'visible' : 'hidden'}
                  transition={{ delay: 1.1 + i * 0.09 }}
                  className="inline-block text-[clamp(3.2rem,8.5vw,7.5rem)] font-display font-black leading-[1.0] tracking-[-0.03em] text-foreground"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* ── Subtext + CTAs ─────────────────────────────────────────────── */}
          <motion.div style={{ y: subtextY }}>
            <motion.p
              variants={clipRevealUp}
              initial="hidden"
              animate={loaded ? 'visible' : 'hidden'}
              transition={{ delay: 1.35 }}
              className="max-w-xl mx-auto text-lg text-text-muted leading-relaxed mt-10 mb-10"
            >
              Crafting brands, interfaces, and digital experiences that leave
              lasting impressions. Based in Colombo, working globally.
            </motion.p>

            <motion.div
              variants={clipRevealUp}
              initial="hidden"
              animate={loaded ? 'visible' : 'hidden'}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/projects" className="btn-primary px-8 py-4 text-base group">
                View Our Work
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
                  <ArrowUpRight size={16} />
                </motion.span>
              </Link>
              <Link href="/contact" className="btn-secondary px-8 py-4 text-base">
                Start a Project
              </Link>
            </motion.div>

            {/* Social proof row */}
            <motion.div
              variants={clipRevealUp}
              initial="hidden"
              animate={loaded ? 'visible' : 'hidden'}
              transition={{ delay: 1.7 }}
              className="flex items-center justify-center gap-6 mt-12"
            >
              {[
                { num: '120+', label: 'Projects' },
                { num: '8+', label: 'Years' },
                { num: '60+', label: 'Clients' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-display font-black text-foreground">{num}</div>
                  <div className="text-xs text-text-subtle uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 2.1, duration: 0.7 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
              <ArrowDown size={14} className="text-text-subtle" />
            </motion.div>
            <span className="text-[10px] text-text-subtle tracking-[0.3em] uppercase">Scroll</span>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}


