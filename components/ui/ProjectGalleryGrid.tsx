'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProjectGalleryItem {
  id: string;
  kind: 'media' | 'drive';
  url: string;
  alt: string;
}

interface ProjectGalleryGridProps {
  items: ProjectGalleryItem[];
}

const mosaicPattern = [
  'col-span-12 md:col-span-7 row-span-3',
  'col-span-6 md:col-span-5 row-span-2',
  'col-span-6 md:col-span-5 row-span-2',
  'col-span-12 md:col-span-4 row-span-2',
  'col-span-12 md:col-span-8 row-span-3',
];

const tileReveal = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  visible: (i: number) => ({
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.65, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ProjectGalleryGrid({ items }: ProjectGalleryGridProps) {
  const [failedKeys, setFailedKeys] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const failedSet = useMemo(() => new Set(failedKeys), [failedKeys]);
  const visibleItems = useMemo(
    () => items.filter((item) => !failedSet.has(`${item.kind}-${item.id}`)),
    [items, failedSet],
  );

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex((i) => (i !== null ? (i - 1 + visibleItems.length) % visibleItems.length : null)), [visibleItems.length]);
  const nextImage = useCallback(() => setLightboxIndex((i) => (i !== null ? (i + 1) % visibleItems.length : null)), [visibleItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  if (visibleItems.length === 0) {
    return null;
  }

  const activeItem = lightboxIndex !== null ? visibleItems[lightboxIndex] : null;

  return (
    <>
      <div className="grid grid-cols-12 auto-rows-[110px] md:auto-rows-[150px] gap-4">
        {visibleItems.map((item, index) => {
          const tileKey = `${item.kind}-${item.id}`;

          return (
            <motion.div
              key={tileKey}
              custom={index}
              variants={tileReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-surface cursor-pointer ${mosaicPattern[index % mosaicPattern.length]}`}
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => {
                    setFailedKeys((prev) => (prev.includes(tileKey) ? prev : [...prev, tileKey]));
                  }}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-primary mb-1">{item.kind === 'drive' ? 'Synced gallery' : 'Library upload'}</p>
                  <p className="text-sm text-white/90 line-clamp-2">{item.alt}</p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeItem.url}
                alt={activeItem.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Prev */}
            {visibleItems.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Next */}
            {visibleItems.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50">
              {lightboxIndex + 1} / {visibleItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
