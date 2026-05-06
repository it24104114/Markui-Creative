'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Image,
  Tag,
  MessageSquare,
  Settings,
  ChevronLeft,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: FolderOpen, label: 'Projects', href: '/admin/projects' },
  { icon: Image, label: 'Media', href: '/admin/media' },
  { icon: Tag, label: 'Categories', href: '/admin/categories' },
  { icon: MessageSquare, label: 'Leads', href: '/admin/leads' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-surface border-r border-border overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border h-16">
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-display font-bold text-white text-sm whitespace-nowrap overflow-hidden"
            >
              Mark<span className="text-primary">UI</span> Admin
            </motion.span>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            'ml-auto p-1 rounded-md text-text-muted hover:text-white hover:bg-surface-2 transition-all duration-200',
            collapsed && 'rotate-180',
          )}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-text-muted hover:text-white hover:bg-surface-2',
              )}
            >
              <Icon size={16} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="p-2 border-t border-border space-y-1">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? 'View Site' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-text-subtle hover:text-white hover:bg-surface-2 transition-all duration-200"
        >
          <Globe size={14} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                View Site
                <ExternalLink size={10} />
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
}
