import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { projectSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ slug: string }>;
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
    const parsed = projectSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
    }

    const project = await prisma.project.update({
      where: { id: existing.id },
      data: parsed.data,
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
