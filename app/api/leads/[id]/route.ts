import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { status, notes } = body;

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ data: lead });
  } catch {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.lead.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Lead deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
