import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { projectSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import type { ProjectFilters } from '@/types';

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
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
    }

    const data = parsed.data;
    const slug = data.slug || generateSlug(data.title);

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 });
    }

    const project = await prisma.project.create({
      data: { ...data, slug },
      include: { category: true },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
