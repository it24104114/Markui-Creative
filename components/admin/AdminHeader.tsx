'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, User } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface AdminHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div />

      <div className="flex items-center gap-3">
        {/* Notifications placeholder */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-white hover:bg-surface-2 transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            {user?.name ? getInitials(user.name) : <User size={14} />}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white leading-none">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-text-subtle mt-0.5">{user?.email ?? 'No email'}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="ml-2 p-2 rounded-lg text-text-subtle hover:text-white hover:bg-surface-2 transition-colors"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
