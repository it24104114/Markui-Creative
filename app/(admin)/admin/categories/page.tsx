import { prisma } from '@/lib/prisma';
import { CategoriesClient } from '@/components/admin/CategoriesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Categories | Mark UI Admin' };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: 'asc' },
  });

  return <CategoriesClient initial={categories} />;
}
