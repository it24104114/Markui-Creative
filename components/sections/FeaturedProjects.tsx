'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionReveal, RevealItem } from '@/components/ui/SectionReveal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { staggerContainerSlow } from '@/lib/animations';
import type { ProjectWithCategory } from '@/types';

interface FeaturedProjectsProps {
  projects: ProjectWithCategory[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects.length) return null;

  const [featured, ...rest] = projects;

  return (
    <section className="section-padding border-t border-border">
      <div className="section-container">
        {/* Header */}
        <SectionReveal className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              Selected Work
            </p>
            <h2 className="text-display-md font-display font-bold text-white">
              Featured
              <br />
              Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-text-muted
                       hover:text-white transition-colors group"
          >
            View all work
            <ArrowUpRight
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </SectionReveal>

        {/* Grid */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Large featured card */}
          <RevealItem className="md:col-span-2">
            <ProjectCard project={featured} size="large" priority />
          </RevealItem>

          {/* Side cards */}
          <div className="flex flex-col gap-6">
            {rest.slice(0, 2).map((project) => (
              <RevealItem key={project.id}>
                <ProjectCard project={project} size="small" />
              </RevealItem>
            ))}
          </div>
        </motion.div>

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
