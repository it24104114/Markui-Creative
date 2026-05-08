import { prisma } from '@/lib/prisma';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { StatsSection } from '@/components/sections/StatsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { CTASection } from '@/components/sections/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mark UI Creative — Premium Creative Studio',
  description: 'Premium creative studio crafting brands, interfaces, and digital experiences that leave lasting impressions.',
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getFeaturedProjects() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.project.findMany({
      where: { status: 'PUBLISHED', featured: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load featured projects:', error);
    }

    return [];
  }
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <StatsSection />
      <ProcessSection />
      <ServicesSection />
      <CTASection />
    </>
  );
}
