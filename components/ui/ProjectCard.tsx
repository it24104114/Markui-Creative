'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cardHoverVariants, imageHoverVariants, overlayVariants } from '@/lib/animations';
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

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className={cn('group relative overflow-hidden rounded-xl bg-surface border border-border', className)}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        {/* Image */}
        <div className={cn('relative overflow-hidden', aspectRatio)}>
          <motion.div variants={imageHoverVariants} className="w-full h-full">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>

          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
          />

          {/* Arrow Icon */}
          <motion.div
            variants={overlayVariants}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary flex items-center justify-center"
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
              <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
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
