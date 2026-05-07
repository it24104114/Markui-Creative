import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, ArrowUpRight, Eye } from 'lucide-react';
import type { Metadata } from 'next';
import { SectionReveal } from '@/components/ui/SectionReveal';
import {
  formatProjectContentType,
  formatProjectOrientation,
  getProjectAspectRatioClass,
  normalizeDriveAssets,
  normalizeSocialEmbeds,
  resolveSocialEmbed,
} from '@/lib/project-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: { title: true, description: true, coverImage: true },
  });
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.coverImage, width: 1200, height: 630 }],
    },
  };
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!project) notFound();

  // Increment views
  await prisma.project.update({
    where: { id: project.id },
    data: { views: { increment: 1 } },
  });

  const socialEmbeds = normalizeSocialEmbeds(project.socialEmbeds);
  const resolvedEmbeds = [
    ...socialEmbeds.youtube.flatMap((url) => {
      const embed = resolveSocialEmbed('youtube', url);
      return embed ? [embed] : [];
    }),
    ...socialEmbeds.instagram.flatMap((url) => {
      const embed = resolveSocialEmbed('instagram', url);
      return embed ? [embed] : [];
    }),
    ...socialEmbeds.tiktok.flatMap((url) => {
      const embed = resolveSocialEmbed('tiktok', url);
      return embed ? [embed] : [];
    }),
    ...socialEmbeds.facebook.flatMap((url) => {
      const embed = resolveSocialEmbed('facebook', url);
      return embed ? [embed] : [];
    }),
  ];
  const driveAssets = normalizeDriveAssets(project.driveAssets);
  const galleryItems = [
    ...project.media.map((item) => ({
      id: item.id,
      kind: 'media' as const,
      url: item.url,
      alt: item.alt ?? item.filename,
      width: item.width ?? 1200,
      height: item.height ?? 900,
    })),
    ...driveAssets.map((asset) => ({
      id: asset.id,
      kind: 'drive' as const,
      url: asset.url,
      alt: asset.name ?? project.title,
      width: asset.width ?? 1200,
      height: asset.height ?? 900,
    })),
  ];

  const sections = [
    { title: 'Overview', content: project.description },
    { title: 'Objective', content: project.objective },
    { title: 'Process', content: project.process },
    { title: 'Results', content: project.results },
  ].filter((s) => s.content);

  const mosaicPattern = [
    'col-span-12 md:col-span-7 row-span-3',
    'col-span-6 md:col-span-5 row-span-2',
    'col-span-6 md:col-span-5 row-span-2',
    'col-span-12 md:col-span-4 row-span-2',
    'col-span-12 md:col-span-8 row-span-3',
  ];

  return (
    <article className="pt-20">
      {/* Hero */}
      <div className={`relative overflow-hidden ${getProjectAspectRatioClass(project.orientation, 'large')}`}>
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="section-container py-16">
        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Projects
        </Link>

        {/* Header */}
        <SectionReveal className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge-primary">{project.category.name}</span>
              <span className="badge-muted text-xs uppercase tracking-[0.25em]">{formatProjectContentType(project.contentType)}</span>
              <span className="badge-muted text-xs uppercase tracking-[0.25em]">{formatProjectOrientation(project.orientation)}</span>
              {project.year && <span className="text-sm text-text-subtle">{project.year}</span>}
              <span className="flex items-center gap-1 text-xs text-text-subtle">
                <Eye size={12} />
                {project.views.toLocaleString()}
              </span>
            </div>
            <h1 className="text-display-lg font-display font-bold text-white mb-4">
              {project.title}
            </h1>
            {project.clientName && (
              <p className="text-text-muted">Client: <span className="text-white">{project.clientName}</span></p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/contact" className="btn-primary text-center">
              Start a Similar Project
              <ArrowUpRight size={14} />
            </Link>
            <Link href="/projects" className="btn-secondary text-center">
              Browse More Work
            </Link>
          </div>
        </SectionReveal>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-12">
            {sections.map(({ title, content }) => (
              <SectionReveal key={title}>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                  <span className="w-6 h-px bg-primary" />
                  {title}
                </h2>
                <div className="text-text-muted leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Tags sidebar */}
          {project.tags.length > 0 && (
            <SectionReveal>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="badge-muted text-xs">{tag}</span>
                ))}
              </div>
            </SectionReveal>
          )}
        </div>

        {resolvedEmbeds.length > 0 && (
          <SectionReveal className="mb-16">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-primary" />
              Live Social Content
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {resolvedEmbeds.map((embed) => {
                const isVertical = embed.platform === 'instagram' || embed.platform === 'tiktok';
                const embedAspectClass = embed.platform === 'facebook'
                  ? 'aspect-[4/5]'
                  : isVertical
                    ? 'aspect-[9/16]'
                    : 'aspect-video';

                return (
                  <div key={`${embed.platform}-${embed.url}`} className="group rounded-[1.5rem] border border-border bg-surface/70 p-4 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4 gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{embed.platform}</p>
                        <p className="text-sm text-text-muted">Embedded playback inside the project page.</p>
                      </div>
                      <Link href={embed.url} target="_blank" className="text-xs text-text-subtle hover:text-white transition-colors">
                        Open source
                      </Link>
                    </div>
                    <div className={`overflow-hidden rounded-[1.25rem] bg-black ${embedAspectClass}`}>
                      <iframe
                        src={embed.embedUrl}
                        title={`${project.title} ${embed.platform} embed`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionReveal>
        )}

        {/* Media Gallery */}
        {galleryItems.length > 0 && (
          <SectionReveal className="mb-16">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-primary" />
              Project Gallery
            </h2>
            <div className="grid grid-cols-12 auto-rows-[110px] md:auto-rows-[150px] gap-4">
              {galleryItems.map((item, index) => (
                <div
                  key={`${item.kind}-${item.id}`}
                  className={`group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-surface ${mosaicPattern[index % mosaicPattern.length]}`}
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-70" />
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-primary mb-1">{item.kind === 'drive' ? 'Synced gallery' : 'Library upload'}</p>
                      <p className="text-sm text-white/90 line-clamp-2">{item.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center">
          <h3 className="text-2xl font-display font-bold text-white mb-3">
            Love What You See?
          </h3>
          <p className="text-text-muted mb-6">Let&apos;s create something amazing for your brand.</p>
          <Link href="/contact" className="btn-primary px-8 py-3.5">
            Get in Touch
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
