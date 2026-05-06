'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
}

export function SectionReveal({ children, className, delay = 0, stagger = false }: SectionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}
