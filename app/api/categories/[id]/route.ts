import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface Params { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, slug, description } = body;

  try {
    if (slug) {
      const existing = await prisma.category.findFirst({
        where: { slug, NOT: { id: params.id } },
      });
      if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
}
