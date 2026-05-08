'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { SectionReveal, RevealItem } from '@/components/ui/SectionReveal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { staggerContainerSlow, staggerContainerDramatic } from '@/lib/animations';
import type { ProjectWithCategory } from '@/types';

interface FeaturedProjectsProps {
  projects: ProjectWithCategory[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects.length) return null;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Parallax offsets for different rows
  const row1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const row2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-3%']);

  const [first, second, third, ...remaining] = projects;

  return (
    <section ref={ref} className="section-padding border-t border-border">
      <div className="section-container">
        {/* Header */}
        <SectionReveal className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Selected Work
            </p>
            <h2 className="font-display font-black text-foreground" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              Featured
              <br />
              Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-text-muted
                       hover:text-foreground transition-colors group"
          >
            View all work
            <ArrowUpRight
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </SectionReveal>

        {/* Row 1: Full-width hero project */}
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

        {/* Row 2: Two equal columns */}
        {(second || third) && (
          <motion.div
            style={{ y: row2Y }}
            variants={staggerContainerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          >
            {second && (
              <RevealItem>
                <ProjectCard project={second} size="default" />
              </RevealItem>
            )}
            {third && (
              <RevealItem>
                <ProjectCard project={third} size="default" />
              </RevealItem>
            )}
          </motion.div>
        )}

        {/* Row 3: Asymmetric — large + small */}
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
    </section>
  );
}
