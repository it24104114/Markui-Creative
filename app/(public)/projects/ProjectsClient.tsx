'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionReveal, RevealItem } from '@/components/ui/SectionReveal';
import type { ProjectWithCategory } from '@/types';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { projects: number };
}

interface ProjectsClientProps {
  initialProjects: ProjectWithCategory[];
  categories: Category[];
  total: number;
}

export function ProjectsClient({ initialProjects, categories, total }: ProjectsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') ?? 'createdAt');

  const fetchProjects = useCallback(async (params: Record<string, string>) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ ...params, status: 'PUBLISHED' });
      const res = await fetch(`/api/projects?${qs}`);
      const data = await res.json();
      setProjects(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (sortBy) params.sortBy = sortBy;

    const timeout = setTimeout(() => {
      fetchProjects(params);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, selectedCategory, sortBy, fetchProjects]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSortBy('createdAt');
  };

  const hasFilters = search || selectedCategory;

  return (
    <div className="section-container section-padding pt-28">
      {/* Header */}
      <SectionReveal className="mb-12">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Our Work</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-display-lg font-display font-bold text-white">
            All Projects
          </h1>
          <p className="text-text-muted">
            {total} projects across {categories.length} categories
          </p>
        </div>
      </SectionReveal>

      {/* Filters */}
      <SectionReveal className="mb-10 space-y-4">
        {/* Search + Sort row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="input-field pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field sm:w-44"
          >
            <option value="createdAt">Latest</option>
            <option value="views">Most Viewed</option>
            <option value="title">A–Z</option>
          </select>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              !selectedCategory
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-text-muted hover:text-white hover:border-primary/50',
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                cat.slug === selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-muted hover:text-white hover:border-primary/50',
              )}
            >
              {cat.name}
              <span className="ml-1.5 text-text-subtle">({cat._count.projects})</span>
            </button>
          ))}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-text-muted
                         hover:text-white flex items-center gap-1.5 ml-2"
            >
              <X size={11} />
              Clear filters
            </button>
          )}
        </div>
      </SectionReveal>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[16/10] rounded-xl bg-surface animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <p className="text-text-muted text-lg">No projects found.</p>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary mt-4 mx-auto">
              Clear filters
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, i) => (
            <motion.div key={project.id} variants={fadeInUp}>
              <ProjectCard project={project} priority={i < 3} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
