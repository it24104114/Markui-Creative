import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProjectForm } from '@/components/admin/ProjectForm';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }, select: { title: true } });
  return { title: project ? `Edit: ${project.title} | Admin` : 'Not Found' };
}

export default async function EditProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { slug },
      include: { media: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!project) notFound();

  return <ProjectForm project={project} categories={categories} />;
}
