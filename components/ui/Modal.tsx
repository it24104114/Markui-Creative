'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { backdropVariants, modalVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative w-full rounded-2xl border border-border bg-surface shadow-card-hover',
              sizeClasses[size],
              className,
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted
                             hover:text-white hover:bg-surface-2 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Close button when no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                           text-text-muted hover:text-white hover:bg-surface-2 transition-colors z-10"
              >
                <X size={16} />
              </button>
            )}

            {/* Content */}
            <div className={cn(!title && 'pt-8')}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
