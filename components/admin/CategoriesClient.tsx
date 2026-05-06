'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { generateSlug } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { projects: number };
}

export function CategoriesClient({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const resetForm = () => setForm({ name: '', slug: '', description: '' });

  const handleCreate = async () => {
    setLoading('create');
    setError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setCategories((prev) => [...prev, { ...data.category, _count: { projects: 0 } }]);
      setCreating(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(id);
    setError('');
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data.category } : c)));
      setEditing(null);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Projects in this category won't be deleted but will lose their category.`)) return;
    setLoading(id + '-del');
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const startEdit = (cat: Category) => {
    setEditing(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '' });
    setCreating(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Categories</h1>
          <p className="text-text-muted text-sm mt-1">{categories.length} categories</p>
        </div>
        {!creating && (
          <button onClick={() => { setCreating(true); setEditing(null); resetForm(); }} className="btn-primary">
            <Plus size={14} />
            New Category
          </button>
        )}
      </div>

      {/* Create form */}
      {creating && (
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-white">New Category</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Name *</label>
              <input
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }));
                }}
                className="input-field"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="form-label">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="input-field font-mono text-sm"
                placeholder="category-slug"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input-field"
              placeholder="Brief description"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={loading === 'create'} className="btn-primary">
              {loading === 'create' ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              Create
            </button>
            <button onClick={() => { setCreating(false); resetForm(); }} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="card p-0 overflow-hidden divide-y divide-border">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4">
            {editing === cat.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input-field"
                    placeholder="Name"
                  />
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className="input-field font-mono text-sm"
                    placeholder="slug"
                  />
                </div>
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input-field"
                  placeholder="Description"
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(cat.id)} disabled={!!loading} className="btn-primary text-xs py-1.5">
                    {loading === cat.id ? <Loader2 size={12} className="animate-spin" /> : null}
                    Save
                  </button>
                  <button onClick={() => { setEditing(null); resetForm(); }} className="btn-secondary text-xs py-1.5">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderOpen size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-text-subtle mt-0.5">/{cat.slug} · {cat._count.projects} projects</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1.5 rounded-md text-text-subtle hover:text-white hover:bg-surface-2 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={loading === cat.id + '-del'}
                    className="p-1.5 rounded-md text-text-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    {loading === cat.id + '-del' ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!categories.length && (
          <p className="px-4 py-12 text-center text-sm text-text-muted">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
