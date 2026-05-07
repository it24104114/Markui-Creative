'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { cn, formatBytes } from '@/lib/utils';

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  url?: string;
}

interface MediaUploaderProps {
  projectId?: string;
  onUploadComplete?: (mediaItems: any[]) => void;
  maxFiles?: number;
  className?: string;
}

interface ExistingMediaItem {
  id: string;
  url: string;
  filename: string;
  bytes?: number | null;
}

export function MediaUploader({ projectId, onUploadComplete, maxFiles = 20, className }: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [existingMedia, setExistingMedia] = useState<ExistingMediaItem[]>([]);

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    const loadExistingMedia = async () => {
      try {
        const response = await fetch(`/api/media?projectId=${projectId}&pageSize=100`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? 'Failed to load project media');
        }

        if (isMounted) {
          setExistingMedia(data.data ?? []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message ?? 'Failed to load project media');
        }
      }
    };

    loadExistingMedia();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('');
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
  }, [maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'] },
    maxFiles,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (!pendingFiles.length) return;

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    pendingFiles.forEach((f) => formData.append('files', f.file));
    if (projectId) formData.append('projectId', projectId);

    // Mark as uploading
    setFiles((prev) =>
      prev.map((f) => (f.status === 'pending' ? { ...f, status: 'uploading' } : f)),
    );

    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Upload failed');

      setFiles((prev) =>
        prev.map((f, i) => {
          const uploaded = data.data[i];
          return uploaded ? { ...f, status: 'done', url: uploaded.url } : { ...f, status: 'error' };
        }),
      );

      setExistingMedia((prev) => [...data.data, ...prev]);

      onUploadComplete?.(data.data);
    } catch (err: any) {
      setError(err.message ?? 'Upload failed');
      setFiles((prev) =>
        prev.map((f) => (f.status === 'uploading' ? { ...f, status: 'error' } : f)),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;

  return (
    <div className={cn('space-y-4', className)}>
      {error && (
        <p className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {existingMedia.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-white">Saved To This Project</h4>
            <span className="text-xs text-text-subtle">{existingMedia.length} item{existingMedia.length === 1 ? '' : 's'}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {existingMedia.map((item) => (
              <div key={item.id} className="relative rounded-lg overflow-hidden bg-surface border border-border aspect-square">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                  <p className="text-xs text-white truncate">{item.filename}</p>
                  <p className="text-xs text-text-subtle">{item.bytes != null ? formatBytes(item.bytes) : 'Saved'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-surface',
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
            isDragActive ? 'bg-primary/20' : 'bg-surface-2',
          )}>
            <Upload size={20} className={isDragActive ? 'text-primary' : 'text-text-muted'} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {isDragActive ? 'Drop files here' : 'Drag & drop images, or click to browse'}
            </p>
            <p className="text-xs text-text-subtle mt-1">
              JPG, PNG, WebP, GIF, SVG · Max 20MB per file · Up to {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      {/* File Grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group rounded-lg overflow-hidden bg-surface border border-border aspect-square"
                >
                  <Image
                    src={file.preview}
                    alt={file.file.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />

                  {/* Status overlay */}
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                      <Loader2 size={20} className="text-primary animate-spin" />
                    </div>
                  )}
                  {file.status === 'done' && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <CheckCircle size={20} className="text-emerald-400" />
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <X size={20} className="text-red-400" />
                    </div>
                  )}

                  {/* Remove */}
                  {file.status === 'pending' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/80 
                                 opacity-0 group-hover:opacity-100 flex items-center justify-center
                                 hover:bg-red-500/80 transition-all duration-150"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  )}

                  {/* File size */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/80 to-transparent p-1.5">
                    <p className="text-xs text-text-muted truncate">{formatBytes(file.file.size)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Upload Button */}
            {pendingCount > 0 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-text-muted">
                  {pendingCount} file{pendingCount > 1 ? 's' : ''} ready to upload
                </p>
                <button
                  onClick={uploadAll}
                  disabled={isUploading}
                  className="btn-primary"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Upload {pendingCount} file{pendingCount > 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
