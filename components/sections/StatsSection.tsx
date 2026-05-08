'use client';

import { SectionReveal, RevealItem } from '@/components/ui/SectionReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const stats = [
  { value: 120, suffix: '+', label: 'Projects Delivered', description: 'Across multiple industries' },
  { value: 8, suffix: '+', label: 'Years Experience', description: 'In creative design' },
  { value: 60, suffix: '+', label: 'Happy Clients', description: 'Globally distributed' },
  { value: 15, suffix: '+', label: 'Awards Won', description: 'Design excellence recognition' },
];

export function StatsSection() {
  return (
    <section className="section-padding border-t border-border bg-surface/40">
      <div className="section-container">
        <SectionReveal className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            By the Numbers
          </p>
          <h2 className="text-display-md font-display font-bold text-foreground">
            Results That Speak
          </h2>
        </SectionReveal>

        <SectionReveal stagger className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <div className="p-6 rounded-2xl border border-border bg-surface text-center group hover:border-primary/30 hover:shadow-soft transition-all duration-300">
                <div className="text-[3rem] font-display font-bold text-foreground mb-1 leading-none">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-xs text-text-muted">{stat.description}</p>
              </div>
            </RevealItem>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
