import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { projectSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import type { ProjectFilters } from '@/types';
import {
  DEFAULT_PROJECT_COVER_IMAGE,
  DEFAULT_PROJECT_DESCRIPTION,
  extractDriveFolderId,
  isSupportedSocialUrl,
  normalizeSocialEmbeds,
  SOCIAL_PLATFORMS,
} from '@/lib/project-content';

function getInvalidSocialLinkError(socialEmbeds: ReturnType<typeof normalizeSocialEmbeds>) {
  for (const platform of SOCIAL_PLATFORMS) {
    const invalidUrl = socialEmbeds[platform].find((url) => !isSupportedSocialUrl(platform, url));
    if (invalidUrl) {
      return `${platform[0].toUpperCase()}${platform.slice(1)} link is not a supported embed URL`;
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters: ProjectFilters = {
      categorySlug: searchParams.get('category') ?? undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      search: searchParams.get('search') ?? undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      status: (searchParams.get('status') as ProjectFilters['status']) ?? undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 12,
      sortBy: (searchParams.get('sortBy') as ProjectFilters['sortBy']) ?? 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc',
    };

    const session = await auth();
    const isAdmin = !!session;

    const where: any = {
      ...(filters.featured !== undefined && { featured: filters.featured }),
      ...(!isAdmin && { status: 'PUBLISHED' }),
      ...(isAdmin && filters.status && { status: filters.status }),
      ...(filters.categorySlug && {
        category: { slug: filters.categorySlug },
      }),
      ...(filters.year && { year: filters.year }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { clientName: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const page = filters.page ?? 1;
    const pageSize = Math.min(filters.pageSize ?? 12, 50);

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: { category: true, _count: { select: { media: true } } },
        orderBy: { [filters.sortBy ?? 'createdAt']: filters.sortOrder ?? 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const normalizedSocialEmbeds = normalizeSocialEmbeds(body.socialEmbeds);
    const driveFolderUrl = typeof body.driveFolderUrl === 'string' ? body.driveFolderUrl.trim() : '';
    const parsed = projectSchema.safeParse({
      ...body,
      socialEmbeds: normalizedSocialEmbeds,
      driveFolderUrl,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
    }

    const data = parsed.data;
    const invalidSocialError = getInvalidSocialLinkError(normalizedSocialEmbeds);
    if (invalidSocialError) {
      return NextResponse.json({ error: invalidSocialError }, { status: 422 });
    }

    const driveFolderId = data.driveFolderUrl ? extractDriveFolderId(data.driveFolderUrl) : null;
    if (data.driveFolderUrl && !driveFolderId) {
      return NextResponse.json({ error: 'Drive folder link is not recognized' }, { status: 422 });
    }

    const slug = data.slug || generateSlug(data.title);

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 });
    }

    const project = await prisma.project.create({
      data: {
        ...data,
        description: data.description?.trim() || DEFAULT_PROJECT_DESCRIPTION,
        coverImage: data.coverImage?.trim() || DEFAULT_PROJECT_COVER_IMAGE,
        slug,
        socialEmbeds: normalizedSocialEmbeds as unknown as Prisma.InputJsonValue,
        driveFolderUrl: data.driveFolderUrl || null,
        driveFolderId,
        driveAssets: Prisma.DbNull,
        driveSyncStatus: 'IDLE',
        driveSyncError: null,
      },
      include: { category: true },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
