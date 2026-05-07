import { z } from 'zod';
import {
  EMPTY_SOCIAL_EMBEDS,
  PROJECT_CONTENT_TYPES,
  PROJECT_ORIENTATIONS,
} from '@/lib/project-content';

// ─── Project ───────────────────────────────────────────────────────────────

const projectLinkArraySchema = z.array(z.string().url('Please enter a valid URL')).default([]);

const socialEmbedsSchema = z.object({
  youtube: projectLinkArraySchema,
  instagram: projectLinkArraySchema,
  tiktok: projectLinkArraySchema,
  facebook: projectLinkArraySchema,
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  categoryId: z.string().cuid('Invalid category'),
  clientName: z.string().max(100).optional(),
  description: z.string().max(3000).optional().or(z.literal('')),
  objective: z.string().optional(),
  process: z.string().optional(),
  results: z.string().optional(),
  coverImage: z.string().url('Cover image must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  orientation: z.enum(PROJECT_ORIENTATIONS).default('LANDSCAPE'),
  contentType: z.enum(PROJECT_CONTENT_TYPES).default('POST'),
  socialEmbeds: socialEmbedsSchema.default(EMPTY_SOCIAL_EMBEDS),
  driveFolderUrl: z.string().url('Drive folder must be a valid URL').optional().or(z.literal('')),
  year: z.number().int().min(2000).max(2099).optional(),
  tags: z.array(z.string()).default([]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

// ─── Category ──────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// ─── Lead / Contact ─────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  service: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

// ─── Auth ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
