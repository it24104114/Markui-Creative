'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { overlayVariants } from '@/lib/animations';
import { formatProjectContentType, getProjectAspectRatioClass } from '@/lib/project-content';
import type { ProjectWithCategory } from '@/types';

interface ProjectCardProps {
  project: ProjectWithCategory;
  className?: string;
  priority?: boolean;
  size?: 'default' | 'large' | 'small';
}

export function ProjectCard({ project, className, priority = false, size = 'default' }: ProjectCardProps) {
  const aspectRatio = getProjectAspectRatioClass(project.orientation, size);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ scale: 1.015, transition: { duration: 0.35, ease: 'easeOut' } }}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-surface border border-border shadow-soft',
        'transition-shadow duration-300 hover:shadow-card-hover',
        className
      )}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        {/* Image */}
        <div className={cn('relative overflow-hidden', aspectRatio)}>
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>

          {/* Dark overlay — clip reveals from bottom */}
          <motion.div
            variants={overlayVariants}
            initial="rest"
            whileHover="hover"
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          />

          {/* Arrow icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-orange-glow"
          >
            <ArrowUpRight size={16} className="text-white" />
          </motion.div>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 left-4">
              <span className="badge-primary text-xs font-semibold px-2 py-1">Featured</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-primary mb-1 truncate">
                {project.category.name}
                {project.clientName && ` · ${project.clientName}`}
              </p>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge-muted text-[10px] uppercase tracking-[0.2em]">
                  {formatProjectContentType(project.contentType)}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {project.title}
              </h3>
            </div>
            {project.year && (
              <span className="text-xs text-text-subtle shrink-0 mt-1">{project.year}</span>
            )}
          </div>

          {size !== 'small' && (
            <p className="mt-2 text-sm text-text-muted line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
