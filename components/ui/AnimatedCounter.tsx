'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const displayValue = useTransform(springValue, (val) =>
    Math.round(val).toLocaleString()
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          motionValue.set(to);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [motionValue, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}
