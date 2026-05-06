import { Project, Category, Media, Lead, User } from '@prisma/client';

// ─── Extended Types ─────────────────────────────────────────────────────────

export type ProjectWithCategory = Project & {
  category: Category;
};

export type ProjectWithMedia = Project & {
  category: Category;
  media: Media[];
};

export type ProjectWithDetails = Project & {
  category: Category;
  media: Media[];
  _count?: {
    media: number;
  };
};

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Filter & Query Types ───────────────────────────────────────────────────

export interface ProjectFilters {
  categorySlug?: string;
  year?: number;
  search?: string;
  featured?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalLeads: number;
  newLeads: number;
  totalMedia: number;
  totalCategories: number;
  recentProjects: ProjectWithCategory[];
  recentLeads: Lead[];
}

// ─── Media Upload ───────────────────────────────────────────────────────────

export interface UploadedMedia {
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  filename: string;
}

// ─── Nav Types ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// ─── Site Settings ──────────────────────────────────────────────────────────

export interface HeroSettings {
  hero_headline: string;
  hero_subtext: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
}
