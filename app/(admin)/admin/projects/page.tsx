import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Projects | Mark UI Admin' };

const statusColors: Record<string, string> = {
  PUBLISHED: 'badge-success',
  DRAFT: 'badge-muted',
  ARCHIVED: 'badge-warning',
};

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { category: true, _count: { select: { media: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Projects</h1>
          <p className="text-text-muted text-sm mt-1">{projects.length} total projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus size={15} />
          New Project
        </Link>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-subtle uppercase tracking-wider">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-subtle uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-subtle uppercase tracking-wider hidden lg:table-cell">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-subtle uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-subtle uppercase tracking-wider hidden sm:table-cell">Media</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-subtle uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-subtle uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white line-clamp-1">{project.title}</p>
                        <p className="text-xs text-text-subtle mt-0.5">/{project.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-text-muted">{project.category.name}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-text-muted">{project.clientName ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusColors[project.status]}>{project.status.toLowerCase()}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-text-muted">{project._count.media}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-text-muted">{formatDateShort(project.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-md text-text-subtle hover:text-white hover:bg-surface-2 transition-colors"
                        title="View live"
                      >
                        <Eye size={13} />
                      </Link>
                      <Link
                        href={`/admin/projects/${project.slug}`}
                        className="p-1.5 rounded-md text-text-subtle hover:text-white hover:bg-surface-2 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {!projects.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-text-muted text-sm">
                    No projects yet.{' '}
                    <Link href="/admin/projects/new" className="text-primary hover:underline">
                      Create your first project
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
