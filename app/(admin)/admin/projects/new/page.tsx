import { prisma } from '@/lib/prisma';
import { ProjectForm } from '@/components/admin/ProjectForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Project | Mark UI Admin' };

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return <ProjectForm categories={categories} />;
}
