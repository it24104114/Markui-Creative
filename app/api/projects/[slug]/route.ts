import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { projectSchema } from '@/lib/validations';
import {
  DEFAULT_PROJECT_COVER_IMAGE,
  DEFAULT_PROJECT_DESCRIPTION,
  extractDriveFolderId,
  getGallerySourceType,
  isSupportedSocialUrl,
  normalizeSocialEmbeds,
  SOCIAL_PLATFORMS,
} from '@/lib/project-content';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

function getInvalidSocialLinkError(socialEmbeds: ReturnType<typeof normalizeSocialEmbeds>) {
  for (const platform of SOCIAL_PLATFORMS) {
    const invalidUrl = socialEmbeds[platform].find((url) => !isSupportedSocialUrl(platform, url));
    if (invalidUrl) {
      return `${platform[0].toUpperCase()}${platform.slice(1)} link is not a supported embed URL`;
    }
  }

  return null;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const session = await auth();
    const isAdmin = !!session;

    const project = await prisma.project.findUnique({
      where: {
        slug,
        ...(!isAdmin && { status: 'PUBLISHED' }),
      },
      include: {
        category: true,
        media: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Increment views for public requests
    if (!isAdmin) {
      await prisma.project.update({
        where: { id: project.id },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json({ data: project });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const body = await req.json();
    const normalizedBody = { ...body };

    if ('socialEmbeds' in body) {
      normalizedBody.socialEmbeds = normalizeSocialEmbeds(body.socialEmbeds);
    }

    if (typeof body.driveFolderUrl === 'string') {
      normalizedBody.driveFolderUrl = body.driveFolderUrl.trim();
    }

    const parsed = projectSchema.partial().safeParse(normalizedBody);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
    }

    const updateData: Record<string, unknown> = { ...parsed.data };

    if ('socialEmbeds' in parsed.data) {
      const invalidSocialError = getInvalidSocialLinkError(parsed.data.socialEmbeds!);
      if (invalidSocialError) {
        return NextResponse.json({ error: invalidSocialError }, { status: 422 });
      }

      updateData.socialEmbeds = parsed.data.socialEmbeds;
      updateData.socialEmbeds = parsed.data.socialEmbeds as Prisma.InputJsonValue;
    }

    if ('driveFolderUrl' in parsed.data) {
      const driveFolderUrl = parsed.data.driveFolderUrl || '';
      const driveFolderId = driveFolderUrl ? extractDriveFolderId(driveFolderUrl) : null;
      const gallerySourceType = driveFolderUrl ? getGallerySourceType(driveFolderUrl) : null;

      if (driveFolderUrl && !gallerySourceType) {
        return NextResponse.json({ error: 'Gallery link is not recognized. Use a Google Drive folder or public Google Photos shared link.' }, { status: 422 });
      }

      const driveChanged = existing.driveFolderUrl !== (driveFolderUrl || null);
      updateData.driveFolderUrl = driveFolderUrl || null;
      updateData.driveFolderId = driveFolderId;

      if (driveChanged) {
        updateData.driveAssets = Prisma.DbNull;
        updateData.driveSyncError = null;
        updateData.driveLastSyncedAt = null;
        updateData.driveSyncStatus = driveFolderId ? 'IDLE' : 'IDLE';
      }
    }

    if ('description' in parsed.data) {
      updateData.description = parsed.data.description?.trim() || DEFAULT_PROJECT_DESCRIPTION;
    }

    if ('coverImage' in parsed.data) {
      updateData.coverImage = parsed.data.coverImage?.trim() || DEFAULT_PROJECT_COVER_IMAGE;
    }

    const project = await prisma.project.update({
      where: { id: existing.id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json({ data: project });
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    await prisma.project.delete({ where: { id: existing.id } });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
