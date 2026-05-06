import type { Metadata } from 'next';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { CTASection } from '@/components/sections/CTASection';
import { StatsSection } from '@/components/sections/StatsSection';

export const metadata: Metadata = {
  title: 'Services | Mark UI Creative',
  description: 'Branding, UI/UX design, motion graphics, web design, print, and creative direction services.',
};

const services = [
  {
    title: 'Branding & Identity',
    slug: 'branding',
    description:
      'Comprehensive brand systems that communicate your values and differentiate you in the market. From logo design to full brand guidelines.',
    deliverables: ['Logo Design', 'Brand Guidelines', 'Color Systems', 'Typography', 'Brand Voice', 'Style Guides'],
  },
  {
    title: 'UI/UX Design',
    slug: 'ui-ux',
    description:
      'User-centered digital experiences that balance beauty with function. From wireframes to fully tested, production-ready interfaces.',
    deliverables: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Handoff'],
  },
  {
    title: 'Motion & Animation',
    slug: 'motion',
    description:
      'Dynamic motion work that brings brands to life — from micro-interactions to full broadcast-quality animation sequences.',
    deliverables: ['Logo Animation', 'UI Animations', 'Motion Graphics', 'Video Editing', 'Social Content', 'Reels'],
  },
  {
    title: 'Web Design',
    slug: 'web',
    description:
      'Pixel-perfect, conversion-optimized websites built with modern frameworks. Fast, accessible, and designed for results.',
    deliverables: ['Landing Pages', 'Portfolio Sites', 'E-commerce', 'CMS Setup', 'SEO Foundations', 'Analytics'],
  },
  {
    title: 'Print & Collateral',
    slug: 'print',
    description:
      'High-impact print design that extends your brand to the physical world — from business cards to large-format signage.',
    deliverables: ['Business Cards', 'Brochures', 'Packaging', 'Signage', 'Presentations', 'Posters'],
  },
  {
    title: 'Creative Direction',
    slug: 'creative-direction',
    description:
      'Strategic creative leadership for campaigns, product launches, and brand pivots. We bring vision and execution together.',
    deliverables: ['Art Direction', 'Campaign Strategy', 'Photo Direction', 'Content Planning', 'Brand Audits', 'Team Workshops'],
  },
];

export default function ServicesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section-padding bg-background border-b border-border">
        <div className="section-container">
          <div className="max-w-3xl">
            <span className="badge-primary mb-4 inline-block">What We Do</span>
            <h1 className="text-display-lg font-display font-black text-white leading-none mb-6">
              Services Built for{' '}
              <span className="text-gradient">Modern Brands</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed">
              We offer end-to-end creative services — from strategy and identity through to digital experiences and motion. Every project is crafted with intention and executed with precision.
            </p>
          </div>
        </div>
      </section>

      {/* Services detail */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.slug} className="card hover:border-primary/30 transition-all duration-300 group">
                <h3 className="font-display font-bold text-white text-lg mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-5">{service.description}</p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider">Deliverables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.deliverables.map((d) => (
                      <span key={d} className="badge-muted text-xs">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
      <CTASection />
    </main>
  );
}
