'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { MediaUploader } from '@/components/ui/MediaUploader';
import { formatBytes } from '@/lib/utils';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  format: string;
  bytes: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  publicId: string;
}

interface MediaLibraryClientProps {
  initial: MediaItem[];
}

export function MediaLibraryClient({ initial }: MediaLibraryClientProps) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleUploadComplete = useCallback(async () => {
    const res = await fetch('/api/media?limit=200');
    const data = await res.json();
    setItems(data.media ?? []);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media? It will be removed from Cloudinary.')) return;
    setLoading(id);
    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setLoading(null);
    }
  };

  const handleSaveAlt = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt: altText }),
      });
      const data = await res.json();
      setItems((prev) => prev.map((m) => (m.id === id ? { ...m, alt: data.media.alt } : m)));
      setEditing(null);
    } finally {
      setLoading(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} items? This cannot be undone.`)) return;
    await Promise.all([...selected].map((id) => fetch(`/api/media/${id}`, { method: 'DELETE' })));
    setItems((prev) => prev.filter((m) => !selected.has(m.id)));
    setSelected(new Set());
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Media Library</h1>
          <p className="text-text-muted text-sm mt-1">{items.length} assets</p>
        </div>
        {selected.size > 0 && (
          <button onClick={handleBulkDelete} className="btn-secondary text-red-400 border-red-500/30 hover:bg-red-500/10">
            <Trash2 size={14} />
            Delete {selected.size} selected
          </button>
        )}
      </div>

      {/* Uploader */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Upload New Assets</h2>
        <MediaUploader onUploadComplete={handleUploadComplete} />
      </div>

      {/* Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-xl overflow-hidden bg-surface-2 border transition-all duration-200 cursor-pointer ${
                selected.has(item.id) ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/40'
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              <div className="aspect-square relative">
                <Image
                  src={item.url}
                  alt={item.alt ?? item.filename}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {/* Selection check */}
                {selected.has(item.id) && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(item.id);
                      setAltText(item.alt ?? '');
                    }}
                    className="p-1.5 rounded-md bg-surface/80 text-white hover:bg-surface transition-colors"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="p-1.5 rounded-md bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                  >
                    {loading === item.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                  </button>
                </div>
              </div>
              <div className="p-2">
                {editing === item.id ? (
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      className="input-field py-1 text-xs flex-1 min-w-0"
                      placeholder="Alt text"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveAlt(item.id)}
                      className="p-1 rounded bg-primary text-white"
                    >
                      <Check size={10} />
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="p-1 rounded bg-surface-3 text-text-muted"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-white truncate font-medium">{item.filename}</p>
                    <p className="text-xs text-text-subtle mt-0.5">{item.bytes != null ? formatBytes(item.bytes) : '—'}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!items.length && (
        <div className="card text-center py-16 text-text-muted text-sm">
          No media yet. Upload your first assets above.
        </div>
      )}
    </div>
  );
}
