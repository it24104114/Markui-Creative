import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { categorySchema } from '@/lib/validations';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { projects: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
    }

    const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 });
    }

    const category = await prisma.category.create({ data: parsed.data });
    return NextResponse.json({ data: category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
