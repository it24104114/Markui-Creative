import type { Metadata } from 'next';
import { CTASection } from '@/components/sections/CTASection';
import { StatsSection } from '@/components/sections/StatsSection';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Mark UI Creative',
  description: 'We are a creative studio specializing in brand identity, UI/UX, motion, and digital experiences.',
};

const team = [
  {
    name: 'Mark Perera',
    role: 'Creative Director & Founder',
    bio: 'With 8+ years of experience in brand identity and digital design, Mark leads creative vision across every project — ensuring each outcome is both strategically sound and visually exceptional.',
    initials: 'MP',
  },
  {
    name: 'Anuki Silva',
    role: 'Lead UI/UX Designer',
    bio: 'Anuki brings a deep understanding of user behavior and interaction design to every digital product, crafting experiences that are intuitive, accessible, and beautiful.',
    initials: 'AS',
  },
  {
    name: 'Dilshan Fernando',
    role: 'Motion Designer',
    bio: 'Dilshan creates dynamic motion work that transforms static brands into living, breathing stories — from subtle UI micro-interactions to full brand films.',
    initials: 'DF',
  },
];

const values = [
  {
    title: 'Craft over commodity',
    description: 'We treat every project as a chance to make something genuinely great, not just good enough.',
  },
  {
    title: 'Strategy-first design',
    description: 'Beautiful work that doesn\'t serve a purpose isn\'t work we want to do. Design decisions are always rooted in intent.',
  },
  {
    title: 'Long-term partnerships',
    description: 'We build relationships, not just deliverables. Our best clients have worked with us for years.',
  },
  {
    title: 'Transparency always',
    description: 'Clear communication, honest timelines, and no surprises. You always know where your project stands.',
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section-padding bg-background border-b border-border">
        <div className="section-container">
          <div className="max-w-3xl">
            <span className="badge-primary mb-4 inline-block">About the Studio</span>
            <h1 className="text-display-lg font-display font-black text-foreground leading-none mb-6">
              Design is how we{' '}
              <span className="text-gradient">Solve Problems</span>
            </h1>
            <p className="text-text-muted text-lg leading-relaxed">
              Mark UI Creative is a premium creative studio based in Sri Lanka, working with brands across the globe. We specialize in visual identity, digital experiences, and motion — for companies that care about how they look.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding border-b border-border">
        <div className="section-container">
          <div className="mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Our Values</span>
            <h2 className="text-display-sm font-display font-black text-foreground mt-3">How We Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card">
                <h3 className="font-display font-bold text-foreground text-lg mb-2">{value.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding border-b border-border">
        <div className="section-container">
          <div className="mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">The Team</span>
            <h2 className="text-display-sm font-display font-black text-foreground mt-3">Who We Are</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="card text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-display font-bold text-xl">{member.initials}</span>
                </div>
                <h3 className="font-display font-bold text-foreground">{member.name}</h3>
                <p className="text-primary text-sm mt-1 mb-3">{member.role}</p>
                <p className="text-text-muted text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Quick CTA */}
      <section className="section-padding">
        <div className="section-container text-center">
          <h2 className="text-display-sm font-display font-black text-foreground mb-4">
            Ready to start a project?
          </h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            Tell us what you&apos;re building and we&apos;ll get back to you within 24 hours.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            Get in touch
          </Link>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
