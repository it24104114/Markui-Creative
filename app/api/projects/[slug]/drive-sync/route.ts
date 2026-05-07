import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { listDriveFolderImages } from '@/lib/google-drive';

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

    if (!project.driveFolderId) {
      return NextResponse.json({ error: 'Add a Google Drive folder link before syncing' }, { status: 422 });
    }

    await prisma.project.update({
      where: { id: project.id },
      data: {
        driveSyncStatus: 'SYNCING',
        driveSyncError: null,
      },
    });

    try {
      const driveAssets = await listDriveFolderImages(project.driveFolderId);

      const updatedProject = await prisma.project.update({
        where: { id: project.id },
        data: {
          driveAssets: driveAssets as unknown as Prisma.InputJsonValue,
          driveSyncStatus: 'READY',
          driveSyncError: null,
          driveLastSyncedAt: new Date(),
        },
      });

      return NextResponse.json({
        data: {
          count: Array.isArray(updatedProject.driveAssets) ? updatedProject.driveAssets.length : driveAssets.length,
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