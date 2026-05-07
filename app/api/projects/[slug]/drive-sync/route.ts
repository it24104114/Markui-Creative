import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { listDriveFolderImages } from '@/lib/google-drive';
import { listGooglePhotosSharedImages } from '@/lib/google-photos';
import { extractDriveFolderId, isGooglePhotosUrl } from '@/lib/project-content';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { slug } = await params;
    const project = await prisma.project.findUnique({ where: { slug } });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.driveFolderUrl) {
      return NextResponse.json({ error: 'Add a Google Drive folder or public Google Photos link before syncing' }, { status: 422 });
    }

    await prisma.project.update({
      where: { id: project.id },
      data: {
        driveSyncStatus: 'SYNCING',
        driveSyncError: null,
      },
    });

    try {
      const galleryUrl = project.driveFolderUrl;
      const galleryAssets = project.driveFolderId || extractDriveFolderId(galleryUrl)
        ? await listDriveFolderImages(project.driveFolderId ?? extractDriveFolderId(galleryUrl)!)
        : isGooglePhotosUrl(galleryUrl)
          ? await listGooglePhotosSharedImages(galleryUrl)
          : null;

      if (!galleryAssets) {
        throw new Error('Gallery link is not recognized. Use a Google Drive folder or public Google Photos shared link.');
      }

      const updatedProject = await prisma.project.update({
        where: { id: project.id },
        data: {
          driveAssets: galleryAssets as unknown as Prisma.InputJsonValue,
          driveSyncStatus: 'READY',
          driveSyncError: null,
          driveLastSyncedAt: new Date(),
        },
      });

      return NextResponse.json({
        data: {
          count: Array.isArray(updatedProject.driveAssets) ? updatedProject.driveAssets.length : galleryAssets.length,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Drive sync failed';

      await prisma.project.update({
        where: { id: project.id },
        data: {
          driveSyncStatus: 'ERROR',
          driveSyncError: message,
        },
      });

      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to sync Drive folder' }, { status: 500 });
  }
}