import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') ?? '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '20'), 50);

    const where = status ? { status: status as any } : {};

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({ data: leads, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 });
    }

    const lead = await prisma.lead.create({ data: parsed.data });
    return NextResponse.json({ data: lead, message: 'Your message has been received. We\'ll be in touch soon!' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
