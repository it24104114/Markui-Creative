'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { slideInLeft, slideInRight } from '@/lib/animations';

const steps = [
  {
    num: '01',
    title: 'Discover',
    body: 'We dive deep into your brand, audience, and competitive landscape. Every great creative decision starts with real understanding.',
    image: 'https://images.unsplash.com/photo-1531498860502-7c67cf519b9e?w=800&q=75',
    alt: 'Discovery and research phase',
  },
  {
    num: '02',
    title: 'Design',
    body: 'Ideas become visual systems. We craft concepts, iterate with your feedback, and refine every pixel until it\'s exactly right.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=75',
    alt: 'Design and creation phase',
  },
  {
    num: '03',
    title: 'Deliver',
    body: 'Polished assets, clean handoffs, and ongoing support. Your brand lands in the world ready to make an impression.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=75',
    alt: 'Delivery and launch phase',
  },
];

export function ProcessSection() {
  return (
    <section className="section-padding border-t border-border bg-surface/30">
      <div className="section-container">
        <SectionReveal className="text-center mb-20">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            How We Work
          </p>
          <h2 className="text-display-md font-display font-bold text-foreground">
            Our <span className="text-gradient">Process</span>
          </h2>
          <p className="text-text-muted mt-4 max-w-lg mx-auto">
            A proven creative process refined over 8+ years of studio work.
          </p>
        </SectionReveal>

        <div className="space-y-24 md:space-y-32">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <ProcessRow key={step.num} step={step} reversed={!isEven} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProcessRow({ step, reversed }: { step: typeof steps[0]; reversed: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY  = useTransform(scrollYProgress, [0, 1], [reversed ? '6%' : '-6%', reversed ? '-6%' : '6%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['3%', '-3%']);

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reversed ? 'md:[&>*:first-child]:order-2' : ''}`}
    >
      {/* Image side */}
      <motion.div
        style={{ y: imgY }}
        variants={reversed ? slideInRight : slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="relative"
      >
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <Image
            src={step.image}
            alt={step.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Step number watermark */}
          <div className="absolute top-4 right-4 text-[5rem] font-display font-black text-white/10 leading-none select-none pointer-events-none">
            {step.num}
          </div>
        </div>
        {/* Decorative floating dot */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-primary shadow-orange-glow hidden md:block"
        />
      </motion.div>

      {/* Text side */}
      <motion.div
        style={{ y: textY }}
        variants={reversed ? slideInLeft : slideInRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="flex flex-col gap-5"
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl font-display font-black text-primary/20 leading-none">{step.num}</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h3
          className="font-display font-black text-foreground"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          {step.title}
        </h3>
        <p className="text-text-muted text-lg leading-relaxed">{step.body}</p>

        {/* Subtle progress indicator */}
        <div className="flex gap-2 mt-2">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`h-1 rounded-full transition-all duration-300 ${
                s.num === step.num ? 'w-8 bg-primary' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
