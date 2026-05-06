import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: 'Media not found' }, { status: 404 });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.publicId);

    // Delete from DB
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { alt, caption, projectId, sortOrder } = body;

    const media = await prisma.media.update({
      where: { id },
      data: {
        ...(alt !== undefined && { alt }),
        ...(caption !== undefined && { caption }),
        ...(projectId !== undefined && { projectId }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({ data: media });
  } catch {
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}
