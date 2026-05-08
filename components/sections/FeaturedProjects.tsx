'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { SectionReveal, RevealItem } from '@/components/ui/SectionReveal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { staggerContainerSlow, staggerContainerDramatic } from '@/lib/animations';
import type { ProjectWithCategory } from '@/types';

// Client logo marquee — Unsplash-sourced brand-style marks
const MARQUEE_ITEMS = [
  'Brand Identity',
  'UI / UX Design',
  'Motion Graphics',
  'Web Design',
  'Packaging',
  'Creative Direction',
  'Photography',
  'Art Direction',
];

interface FeaturedProjectsProps {
  projects: ProjectWithCategory[];
}

function MarqueeStrip() {
  // Duplicate items so the strip appears infinite
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative border-y border-border bg-surface/50 overflow-hidden py-4 my-16">
      {/* Left + right fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
        className="flex gap-10 w-max"
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 shrink-0">
            <span className="text-sm font-semibold text-text-muted uppercase tracking-[0.2em]">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects.length) return null;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const row1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const row2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-4%']);
  const labelX = useTransform(scrollYProgress, [0, 0.5], ['-6%', '0%']);

  const [first, second, third, ...remaining] = projects;

  return (
    <section ref={ref} className="border-t border-border">
      <div className="section-container section-padding">
        {/* ── Header ── */}
        <SectionReveal className="flex items-end justify-between mb-14">
          <div>
            <motion.p
              style={{ x: labelX }}
              className="text-xs font-semibold text-primary uppercase tracking-widest mb-3"
            >
              Selected Work
            </motion.p>
            <h2
              className="font-display font-black text-foreground"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.0, letterSpacing: '-0.03em' }}
            >
              Featured
              <br />
              <span className="text-gradient">Projects</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-text-muted
                       hover:text-foreground transition-colors group mb-2"
          >
            View all work
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </SectionReveal>

        {/* ── Row 1: Full-width hero project ── */}
        {first && (
          <motion.div
            style={{ y: row1Y }}
            variants={staggerContainerDramatic}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mb-6"
          >
            <RevealItem>
              <ProjectCard project={first} size="large" priority />
            </RevealItem>
          </motion.div>
        )}

        {/* ── Row 2: Two equal columns ── */}
        {(second || third) && (
          <motion.div
            style={{ y: row2Y }}
            variants={staggerContainerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          >
            {second && <RevealItem><ProjectCard project={second} /></RevealItem>}
            {third  && <RevealItem><ProjectCard project={third} /></RevealItem>}
          </motion.div>
        )}

        {/* ── Row 3: Asymmetric ── */}
        {remaining.length > 0 && (
          <motion.div
            variants={staggerContainerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {remaining[0] && (
              <RevealItem className="md:col-span-2">
                <ProjectCard project={remaining[0]} size="large" />
              </RevealItem>
            )}
            {remaining[1] && (
              <RevealItem>
                <ProjectCard project={remaining[1]} size="small" />
              </RevealItem>
            )}
          </motion.div>
        )}

        {/* Mobile CTA */}
        <div className="md:hidden mt-8 text-center">
          <Link href="/projects" className="btn-secondary">
            View all projects
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Scrolling discipline marquee ── */}
      <MarqueeStrip />
    </section>
  );
}


