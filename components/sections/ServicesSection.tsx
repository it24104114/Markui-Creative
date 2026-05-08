'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
  },
  {
    icon: Monitor,
    title: 'UI/UX Design',
    description: 'User interface and experience design for web and mobile applications. From wireframes to pixel-perfect handoffs.',
    href: '/services#ui-ux',
    color: '#8B5CF6',
  },
  {
    icon: Film,
    title: 'Motion Design',
    description: 'Animation, motion graphics, and video production that breathes life into your brand stories.',
    href: '/services#motion',
    color: '#06B6D4',
  },
  {
    icon: Globe,
    title: 'Web Design',
    description: 'Beautiful, responsive websites and landing pages built for performance, conversion, and delight.',
    href: '/services#web',
    color: '#10B981',
  },
  {
    icon: Package,
    title: 'Print & Packaging',
    description: 'Packaging design, marketing collateral, and print materials that command attention on any shelf.',
    href: '/services#print',
    color: '#F59E0B',
  },
  {
    icon: Sparkles,
    title: 'Creative Direction',
    description: 'End-to-end creative strategy and art direction for campaigns, photoshoots, and brand activations.',
    href: '/services#direction',
    color: '#EC4899',
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding border-t border-border">
      <div className="section-container">
        <SectionReveal className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
              What We Do
            </p>
            <h2 className="text-display-md font-display font-bold text-foreground">
              Our Services
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-text-muted
                       hover:text-foreground transition-colors group"
          >
            All services
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </SectionReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <RevealItem key={service.title}>
                <Link
                  href={service.href}
                  className="group flex flex-col p-6 rounded-2xl border border-border bg-surface
                             hover:border-[var(--service-color)] hover:bg-surface-2
                             hover:shadow-soft transition-all duration-300"
                  style={{ '--service-color': service.color + '40' } as React.CSSProperties}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: service.color + '20' }}
                  >
                    <Icon size={18} style={{ color: service.color }} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-medium text-text-subtle
                                  group-hover:text-primary transition-colors">
                    Learn more
                    <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
