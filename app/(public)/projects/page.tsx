import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ProjectsClient } from './ProjectsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Browse our portfolio of branding, UI/UX, motion design, and web projects.',
};

export const revalidate = 60;

export default async function ProjectsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProjectsClient initialProjects={[]} categories={[]} total={0} />
      </Suspense>
    );
  }

  try {
    const [projects, categories] = await Promise.all([
      prisma.project.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        include: { _count: { select: { projects: { where: { status: 'PUBLISHED' } } } } },
        orderBy: { name: 'asc' },
      }),
    ]);

    return (
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProjectsClient
          initialProjects={projects}
          categories={categories}
          total={projects.length}
        />
      </Suspense>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load projects page data:', error);
    }

    return (
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProjectsClient initialProjects={[]} categories={[]} total={0} />
      </Suspense>
    );
  }
}
