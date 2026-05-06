import { prisma } from '@/lib/prisma';
import { MediaLibraryClient } from '@/components/admin/MediaLibraryClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Media | Mark UI Admin' };

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return <MediaLibraryClient initial={media} />;
}
