'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpRight, Palette, Monitor, Film, Globe, Package, Sparkles } from 'lucide-react';
import { SectionReveal, RevealItem } from '@/components/ui/SectionReveal';
import { staggerContainer } from '@/lib/animations';

const services = [
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Logo design, visual systems, brand guidelines, and complete identity packages that define who you are.',
    href: '/services#branding',
    color: '#FF6A00',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=70',
  },
  {
    icon: Monitor,
    title: 'UI/UX Design',
    description: 'User interface and experience design for web and mobile. From wireframes to pixel-perfect handoffs.',
    href: '/services#ui-ux',
    color: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=500&q=70',
  },
  {
    icon: Film,
    title: 'Motion Design',
    description: 'Animation, motion graphics, and video production that breathes life into your brand stories.',
    href: '/services#motion',
    color: '#06B6D4',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&q=70',
  },
  {
    icon: Globe,
    title: 'Web Design',
    description: 'Beautiful, responsive websites and landing pages built for performance, conversion, and delight.',
    href: '/services#web',
    color: '#10B981',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&q=70',
  },
  {
    icon: Package,
    title: 'Print & Packaging',
    description: 'Packaging design, marketing collateral, and print materials that command attention on any shelf.',
    href: '/services#print',
    color: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=70',
  },
  {
    icon: Sparkles,
    title: 'Creative Direction',
    description: 'End-to-end creative strategy and art direction for campaigns, photoshoots, and brand activations.',
    href: '/services#direction',
    color: '#EC4899',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&q=70',
  },
];

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const sectionY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  return (
    <section ref={ref} className="section-padding border-t border-border bg-white">
      <motion.div style={{ y: sectionY }} className="section-container">
        <SectionReveal className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-display-md font-display font-bold text-foreground">
              Our <span className="text-gradient">Services</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-foreground transition-colors group mb-2"
          >
            All services
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </SectionReveal>

        {/* ── Grid of service cards with image on hover ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <RevealItem key={service.title}>
                <Link
                  href={service.href}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface hover:border-transparent hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-500"
                  style={{ '--service-color': service.color } as React.CSSProperties}
                >
                  {/* Image — slides down from top on hover */}
                  <div className="relative h-0 overflow-hidden group-hover:h-[180px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/60" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                      style={{ background: service.color + '18' }}
                    >
                      <Icon size={18} style={{ color: service.color }} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-base group-hover:text-primary transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed flex-1">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-1 mt-5 text-xs font-semibold text-text-subtle group-hover:text-primary transition-colors duration-200">
                      Learn more
                      <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Bottom color accent bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: service.color }}
                  />
                </Link>
              </RevealItem>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}


