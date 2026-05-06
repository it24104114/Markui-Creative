import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, ArrowUpRight, Eye } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
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
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
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

  const sections = [
    { title: 'Overview', content: project.description },
    { title: 'Objective', content: project.objective },
    { title: 'Process', content: project.process },
    { title: 'Results', content: project.results },
  ].filter((s) => s.content);

  return (
    <article className="pt-20">
      {/* Hero */}
      <div className="relative aspect-[21/9] overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge-primary">{project.category.name}</span>
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
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-12">
            {sections.map(({ title, content }) => (
              <section key={title}>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                  <span className="w-6 h-px bg-primary" />
                  {title}
                </h2>
                <div className="text-text-muted leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </section>
            ))}
          </div>

          {/* Tags sidebar */}
          {project.tags.length > 0 && (
            <aside>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="badge-muted text-xs">{tag}</span>
                ))}
              </div>
            </aside>
          )}
        </div>

        {/* Media Gallery */}
        {project.media.length > 0 && (
          <section className="mb-16">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-primary" />
              Project Gallery
            </h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {project.media.map((item) => (
                <div key={item.id} className="relative overflow-hidden rounded-xl break-inside-avoid">
                  <Image
                    src={item.url}
                    alt={item.alt ?? item.filename}
                    width={item.width ?? 800}
                    height={item.height ?? 600}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
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
