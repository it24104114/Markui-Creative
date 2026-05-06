import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [
      totalProjects,
      publishedProjects,
      totalLeads,
      newLeads,
      totalMedia,
      totalCategories,
      recentProjects,
      recentLeads,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'PUBLISHED' } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.media.count(),
      prisma.category.count(),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      data: {
        totalProjects,
        publishedProjects,
        totalLeads,
        newLeads,
        totalMedia,
        totalCategories,
        recentProjects,
        recentLeads,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
