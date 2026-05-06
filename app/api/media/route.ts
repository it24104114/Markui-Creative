import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const projectId = formData.get('projectId') as string | null;

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: 'markui-creative',
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
          overwrite: false,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        });

        const media = await prisma.media.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            filename: file.name,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            ...(projectId && { projectId }),
          },
        });

        return media;
      }),
    );

    return NextResponse.json({ data: uploads }, { status: 201 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const page = parseInt(searchParams.get('page') ?? '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') ?? '24'), 100);

    const where = projectId ? { projectId } : {};

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({ data: media, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
