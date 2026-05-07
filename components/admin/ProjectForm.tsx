'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, ArrowLeft, Trash2, Eye, Plus, Link2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { projectSchema, type ProjectFormValues } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { MediaUploader } from '@/components/ui/MediaUploader';
import {
  EMPTY_SOCIAL_EMBEDS,
  formatProjectContentType,
  formatProjectOrientation,
  isSupportedSocialUrl,
  normalizeDriveAssets,
  normalizeSocialEmbeds,
  PROJECT_CONTENT_TYPES,
  PROJECT_ORIENTATIONS,
  type SocialPlatform,
} from '@/lib/project-content';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProjectFormProps {
  project?: any;
  categories: Category[];
}

export function ProjectForm({ project, categories }: ProjectFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [error, setError] = useState('');
  const [driveMessage, setDriveMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'media'>('details');

  const isEditing = !!project;
  const driveAssets = project ? normalizeDriveAssets(project.driveAssets) : [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          title: project.title,
          slug: project.slug,
          categoryId: project.categoryId,
          clientName: project.clientName ?? '',
          description: project.description,
          objective: project.objective ?? '',
          process: project.process ?? '',
          results: project.results ?? '',
          coverImage: project.coverImage,
          featured: project.featured,
          status: project.status,
          orientation: project.orientation ?? 'LANDSCAPE',
          contentType: project.contentType ?? 'POST',
          socialEmbeds: normalizeSocialEmbeds(project.socialEmbeds),
          driveFolderUrl: project.driveFolderUrl ?? '',
          year: project.year ?? new Date().getFullYear(),
          tags: project.tags ?? [],
        }
      : {
          status: 'DRAFT',
          featured: false,
          orientation: 'LANDSCAPE',
          contentType: 'POST',
          socialEmbeds: EMPTY_SOCIAL_EMBEDS,
          driveFolderUrl: '',
          year: new Date().getFullYear(),
          tags: [],
        },
  });

  const title = watch('title');
  const socialEmbeds = watch('socialEmbeds');
  const driveFolderUrl = watch('driveFolderUrl');

  useEffect(() => {
    if (!isEditing && title) {
      setValue('slug', generateSlug(title), { shouldDirty: true });
    }
  }, [title, isEditing, setValue]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSaving(true);
    setError('');
    try {
      const payload: ProjectFormValues = {
        ...data,
        socialEmbeds: normalizeSocialEmbeds(data.socialEmbeds),
        driveFolderUrl: data.driveFolderUrl?.trim() ?? '',
      };

      const url = isEditing ? `/api/projects/${project.slug}` : '/api/projects';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Failed to save');

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  const handleDriveSync = async () => {
    if (!isEditing) return;

    setIsSyncingDrive(true);
    setDriveMessage('');
    setError('');

    try {
      const response = await fetch(`/api/projects/${project.slug}/drive-sync`, { method: 'POST' });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Drive sync failed');
      }

      setDriveMessage(`Synced ${result.data?.count ?? 0} Drive image${result.data?.count === 1 ? '' : 's'}.`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const updateSocialLinks = (platform: SocialPlatform, links: string[]) => {
    setValue(`socialEmbeds.${platform}`, links, { shouldDirty: true });
  };

  const addSocialLink = (platform: SocialPlatform) => {
    updateSocialLinks(platform, [...(socialEmbeds?.[platform] ?? []), '']);
  };

  const removeSocialLink = (platform: SocialPlatform, index: number) => {
    updateSocialLinks(platform, (socialEmbeds?.[platform] ?? []).filter((_, itemIndex) => itemIndex !== index));
  };

  const linkGroups: Array<{
    platform: SocialPlatform;
    label: string;
    placeholder: string;
  }> = [
    {
      platform: 'youtube',
      label: 'YouTube',
      placeholder: 'https://www.youtube.com/watch?v=...',
    },
    {
      platform: 'instagram',
      label: 'Instagram',
      placeholder: 'https://www.instagram.com/reel/...',
    },
    {
      platform: 'tiktok',
      label: 'TikTok',
      placeholder: 'https://www.tiktok.com/@creator/video/...',
    },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold text-white">
              {isEditing ? 'Edit Project' : 'New Project'}
            </h1>
            {isEditing && (
              <p className="text-xs text-text-subtle mt-0.5">/{project.slug}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="btn-secondary py-2 text-xs"
              >
                <Eye size={13} />
                Preview
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                title="Delete project"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface rounded-lg w-fit">
        {(['details', 'media'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'details' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main fields */}
            <div className="lg:col-span-2 space-y-5">
              <div className="card space-y-5">
                <div>
                  <label className="form-label">Title *</label>
                  <input {...register('title')} className="input-field" placeholder="Project title" />
                  {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="form-label">Slug *</label>
                  <input {...register('slug')} className="input-field font-mono text-sm" placeholder="project-slug" />
                  {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea {...register('description')} rows={4} className="input-field resize-none" placeholder="Project overview..." />
                  <p className="text-xs text-text-subtle mt-1">This copy powers the animated description block on the public project page.</p>
                  {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <label className="form-label">Objective</label>
                  <textarea {...register('objective')} rows={3} className="input-field resize-none" placeholder="Project objective..." />
                </div>
                <div>
                  <label className="form-label">Process</label>
                  <textarea {...register('process')} rows={3} className="input-field resize-none" placeholder="Creative process..." />
                </div>
                <div>
                  <label className="form-label">Results</label>
                  <textarea {...register('results')} rows={3} className="input-field resize-none" placeholder="Outcomes and results..." />
                </div>
              </div>

              <div className="card space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Social Media Embeds</h3>
                    <p className="text-xs text-text-subtle mt-1">Add multiple YouTube, Instagram, and TikTok links to display directly on the website.</p>
                  </div>
                  <span className="badge-muted text-xs">Inline embeds</span>
                </div>

                <div className="space-y-4">
                  {linkGroups.map(({ platform, label, placeholder }) => (
                    <div key={platform} className="rounded-xl border border-border bg-surface/50 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">{label}</p>
                          <p className="text-xs text-text-subtle">Supports embeddable public posts and videos.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addSocialLink(platform)}
                          className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
                        >
                          <Plus size={13} />
                          Add link
                        </button>
                      </div>

                      {(socialEmbeds?.[platform] ?? []).length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-text-muted">
                          No {label} links yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(socialEmbeds?.[platform] ?? []).map((_, index) => {
                            const value = socialEmbeds?.[platform]?.[index] ?? '';
                            const isValid = value ? isSupportedSocialUrl(platform, value) : true;
                            const fieldError = errors.socialEmbeds?.[platform]?.[index]?.message;

                            return (
                              <div key={`${platform}-${index}`} className="space-y-2">
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
                                    <input
                                      {...register(`socialEmbeds.${platform}.${index}` as const)}
                                      className="input-field pl-10"
                                      placeholder={placeholder}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeSocialLink(platform, index)}
                                    className="rounded-lg border border-border px-3 text-text-muted hover:text-white hover:border-primary/40 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                {value && (
                                  <p className={`text-xs ${isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {isValid ? 'Embed ready for display.' : 'This link is not recognized as an embeddable URL.'}
                                  </p>
                                )}
                                {fieldError && <p className="text-xs text-red-400">{fieldError}</p>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="card space-y-4">
                <h3 className="text-sm font-semibold text-white">Publish</h3>
                <div>
                  <label className="form-label">Status *</label>
                  <select {...register('status')} className="input-field">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-text-muted">Featured</label>
                  <input type="checkbox" {...register('featured')} className="w-4 h-4 accent-primary" />
                </div>
              </div>

              <div className="card space-y-4">
                <h3 className="text-sm font-semibold text-white">Details</h3>
                <div>
                  <label className="form-label">Category *</label>
                  <select {...register('categoryId')} className="input-field">
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-xs text-red-400 mt-1">{errors.categoryId.message}</p>}
                </div>
                <div>
                  <label className="form-label">Client Name</label>
                  <input {...register('clientName')} className="input-field" placeholder="Client name" />
                </div>
                <div>
                  <label className="form-label">Orientation</label>
                  <select {...register('orientation')} className="input-field">
                    {PROJECT_ORIENTATIONS.map((orientation) => (
                      <option key={orientation} value={orientation}>{formatProjectOrientation(orientation)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Content Type</label>
                  <select {...register('contentType')} className="input-field">
                    {PROJECT_CONTENT_TYPES.map((contentType) => (
                      <option key={contentType} value={contentType}>{formatProjectContentType(contentType)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Year</label>
                  <input {...register('year', { valueAsNumber: true })} type="number" min="2000" max="2099" className="input-field" />
                </div>
                <div>
                  <label className="form-label">Cover Image URL</label>
                  <input {...register('coverImage')} className="input-field font-mono text-xs" placeholder="https://..." />
                  {errors.coverImage && <p className="text-xs text-red-400 mt-1">{errors.coverImage.message}</p>}
                </div>
              </div>

              <div className="card space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Google Drive Gallery</h3>
                  <p className="text-xs text-text-subtle mt-1">Paste a shared folder link, save the project, then sync images into the public mosaic gallery.</p>
                </div>
                <div>
                  <label className="form-label">Drive Folder Link</label>
                  <input
                    {...register('driveFolderUrl')}
                    className="input-field font-mono text-xs"
                    placeholder="https://drive.google.com/drive/folders/..."
                  />
                  {errors.driveFolderUrl && <p className="text-xs text-red-400 mt-1">{errors.driveFolderUrl.message}</p>}
                </div>
                <div className="rounded-xl border border-border bg-surface/40 px-4 py-3 space-y-2 text-xs text-text-muted">
                  <p>Status: <span className="text-white">{project?.driveSyncStatus ?? 'IDLE'}</span></p>
                  {project?.driveLastSyncedAt && (
                    <p>Last sync: <span className="text-white">{new Date(project.driveLastSyncedAt).toLocaleString()}</span></p>
                  )}
                  {project?.driveSyncError && (
                    <p className="text-red-400">{project.driveSyncError}</p>
                  )}
                  <p>{driveAssets.length} synced image{driveAssets.length === 1 ? '' : 's'} ready for the project gallery.</p>
                </div>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleDriveSync}
                    disabled={isSyncingDrive || !driveFolderUrl?.trim()}
                    className="btn-secondary w-full justify-center"
                  >
                    {isSyncingDrive ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {isSyncingDrive ? 'Syncing Drive...' : 'Sync Drive Images'}
                  </button>
                ) : (
                  <p className="text-xs text-text-subtle">Save the project first to sync Google Drive assets.</p>
                )}
                {driveMessage && <p className="text-xs text-emerald-400">{driveMessage}</p>}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
            </button>
            <Link href="/admin/projects" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      ) : (
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Project Media</h3>
          {isEditing ? (
            <MediaUploader
              projectId={project.id}
              onUploadComplete={() => router.refresh()}
            />
          ) : (
            <p className="text-sm text-text-muted">Save the project first, then you can upload media.</p>
          )}
        </div>
      )}
    </div>
  );
}
