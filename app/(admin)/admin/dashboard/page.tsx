import { prisma } from '@/lib/prisma';
import { formatDateShort } from '@/lib/utils';
import Link from 'next/link';
import {
  FolderOpen,
  Image,
  MessageSquare,
  Tag,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Plus,
  Upload,
  Settings,
  Globe,
  Star,
  Eye,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard | Mark UI Admin' };

async function getDashboardStats() {
  if (!process.env.DATABASE_URL) {
    return {
      totalProjects: 0,
      publishedProjects: 0,
      totalLeads: 0,
      newLeads: 0,
      totalMedia: 0,
      totalCategories: 0,
      recentProjects: [],
      recentLeads: [],
    };
  }

  try {
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

    return { totalProjects, publishedProjects, totalLeads, newLeads, totalMedia, totalCategories, recentProjects, recentLeads };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load dashboard stats:', error);
    }

    return {
      totalProjects: 0,
      publishedProjects: 0,
      totalLeads: 0,
      newLeads: 0,
      totalMedia: 0,
      totalCategories: 0,
      recentProjects: [],
      recentLeads: [],
    };
  }
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'badge-success',
  DRAFT: 'badge-muted',
  ARCHIVED: 'badge-warning',
};

const leadStatusColors: Record<string, string> = {
  NEW: 'badge-primary',
  IN_PROGRESS: 'badge-warning',
  CONVERTED: 'badge-success',
  CLOSED: 'badge-muted',
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      icon: FolderOpen,
      label: 'Total Projects',
      value: stats.totalProjects,
      sub: `${stats.publishedProjects} published`,
      href: '/admin/projects',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: MessageSquare,
      label: 'Total Leads',
      value: stats.totalLeads,
      sub: `${stats.newLeads} new`,
      href: '/admin/leads',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      icon: Image,
      label: 'Media Assets',
      value: stats.totalMedia,
      sub: 'in library',
      href: '/admin/media',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: Tag,
      label: 'Categories',
      value: stats.totalCategories,
      sub: 'active',
      href: '/admin/categories',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Project', href: '/admin/projects/new', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Upload, label: 'Upload Media', href: '/admin/media', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: Tag, label: 'New Category', href: '/admin/categories', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Settings, label: 'Site Settings', href: '/admin/settings', color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { icon: Globe, label: 'View Site', href: '/', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: MessageSquare, label: 'View Leads', href: '/admin/leads', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, sub, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="card group hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
              <ArrowUpRight
                size={14}
                className="text-text-subtle group-hover:text-primary transition-colors"
              />
            </div>
            <p className="text-2xl font-display font-bold text-white">{value}</p>
            <p className="text-xs font-medium text-white mt-0.5">{label}</p>
            <p className="text-xs text-text-subtle mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-white text-sm">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map(({ icon: Icon, label, href, color, bg }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-surface-2 transition-all duration-200 group text-center"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
              <span className="text-xs font-medium text-text-muted group-hover:text-white transition-colors leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Clock size={14} className="text-primary" />
              Recent Projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs text-text-muted hover:text-primary transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.slug}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 transition-colors group"
              >
                <div className="min-w-0 flex items-center gap-2">
                  {project.featured && (
                    <Star size={10} className="text-amber-400 shrink-0" title="Featured" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                      {project.title}
                    </p>
                    <p className="text-xs text-text-subtle mt-0.5">
                      {project.category.name} · {formatDateShort(project.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`${statusColors[project.status]} ml-3 shrink-0`}>
                  {project.status.toLowerCase()}
                </span>
              </Link>
            ))}
            {!stats.recentProjects.length && (
              <p className="text-sm text-text-subtle text-center py-4">No projects yet</p>
            )}
          </div>
          <Link href="/admin/projects/new" className="btn-primary w-full text-center text-xs py-2">
            + New Project
          </Link>
        </div>

        {/* Recent Leads */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" />
              Recent Leads
            </h2>
            <Link
              href="/admin/leads"
              className="text-xs text-text-muted hover:text-primary transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                  <p className="text-xs text-text-subtle mt-0.5">
                    {lead.email} · {lead.service ?? 'No service'} · {formatDateShort(lead.createdAt)}
                  </p>
                </div>
                <span className={`${leadStatusColors[lead.status]} ml-3 shrink-0`}>
                  {lead.status.replace('_', ' ').toLowerCase()}
                </span>
              </div>
            ))}
            {!stats.recentLeads.length && (
              <p className="text-sm text-text-subtle text-center py-4">No leads yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Site overview */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-white text-sm flex items-center gap-2">
          <Globe size={14} className="text-primary" />
          Site Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Published projects breakdown */}
          <div className="rounded-lg border border-border bg-surface-2 p-4 space-y-2">
            <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider">Projects by Status</p>
            <div className="space-y-1.5 mt-3">
              {(['PUBLISHED', 'DRAFT', 'ARCHIVED'] as const).map((s) => {
                const count = stats.recentProjects.filter((p) => p.status === s).length;
                const label = s.charAt(0) + s.slice(1).toLowerCase();
                return (
                  <div key={s} className="flex items-center justify-between">
                    <span className={statusColors[s]}>{label}</span>
                    <span className="text-xs text-text-subtle">{count}</span>
                  </div>
                );
              })}
              <div className="pt-1 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-muted">Total shown</span>
                <span className="text-xs font-semibold text-white">{stats.recentProjects.length}</span>
              </div>
            </div>
          </div>

          {/* Leads breakdown */}
          <div className="rounded-lg border border-border bg-surface-2 p-4 space-y-2">
            <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider">Leads by Status</p>
            <div className="space-y-1.5 mt-3">
              {(['NEW', 'IN_PROGRESS', 'CONVERTED', 'CLOSED'] as const).map((s) => {
                const count = stats.recentLeads.filter((l) => l.status === s).length;
                const label = s.replace('_', ' ').charAt(0) + s.replace('_', ' ').slice(1).toLowerCase();
                return (
                  <div key={s} className="flex items-center justify-between">
                    <span className={leadStatusColors[s]}>{label}</span>
                    <span className="text-xs text-text-subtle">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-lg border border-border bg-surface-2 p-4 space-y-2">
            <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider">Public Pages</p>
            <div className="space-y-1.5 mt-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Projects', href: '/projects' },
                { label: 'Services', href: '/services' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  className="flex items-center justify-between text-xs text-text-muted hover:text-primary transition-colors group"
                >
                  <span>{label}</span>
                  <Eye size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
