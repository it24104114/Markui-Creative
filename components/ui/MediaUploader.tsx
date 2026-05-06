'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
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

export function MediaUploader({ projectId, onUploadComplete, maxFiles = 20, className }: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
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

      onUploadComplete?.(data.data);
    } catch {
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
