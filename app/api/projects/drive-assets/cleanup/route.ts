import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { filterProjectDriveAssets, normalizeDriveAssets } from '@/lib/project-content';

export async function POST(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const projects = await prisma.project.findMany({
      where: {
        NOT: {
          driveAssets: Prisma.DbNull as unknown as Prisma.JsonNullableFilter,
        },
      },
      select: {
        id: true,
        driveAssets: true,
      },
    });

    let updatedProjects = 0;
    let droppedAssets = 0;

    for (const project of projects) {
      const normalized = normalizeDriveAssets(project.driveAssets);
      const { assets, dropped } = filterProjectDriveAssets(project.driveAssets);

      if (dropped === 0 && normalized.length === assets.length) {
        continue;
      }

      await prisma.project.update({
        where: { id: project.id },
        data: {
          driveAssets: assets.length > 0
            ? (assets as unknown as Prisma.InputJsonValue)
            : Prisma.DbNull,
        },
      });

      updatedProjects += 1;
      droppedAssets += dropped;
    }

    return NextResponse.json({
      data: {
        projectsScanned: projects.length,
        projectsUpdated: updatedProjects,
        assetsDropped: droppedAssets,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to clean synced assets' }, { status: 500 });
  }
}
