import { PrismaClient, ProjectStatus, LeadStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const hashedPassword = await bcrypt.hash('MarkUI@Admin2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@markui.lk' },
    update: {},
    create: {
      email: 'admin@markui.lk',
      name: 'Mark UI Admin',
      role: Role.SUPER_ADMIN,
      password: hashedPassword,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'branding' },
      update: {},
      create: { name: 'Branding', slug: 'branding', description: 'Brand identity and visual systems', color: '#FF6A00' },
    }),
    prisma.category.upsert({
      where: { slug: 'ui-ux' },
      update: {},
      create: { name: 'UI/UX Design', slug: 'ui-ux', description: 'User interface and experience design', color: '#8B5CF6' },
    }),
    prisma.category.upsert({
      where: { slug: 'motion' },
      update: {},
      create: { name: 'Motion Design', slug: 'motion', description: 'Animation and motion graphics', color: '#06B6D4' },
    }),
    prisma.category.upsert({
      where: { slug: 'web-design' },
      update: {},
      create: { name: 'Web Design', slug: 'web-design', description: 'Website design and development', color: '#10B981' },
    }),
    prisma.category.upsert({
      where: { slug: 'print' },
      update: {},
      create: { name: 'Print & Packaging', slug: 'print', description: 'Print design and packaging solutions', color: '#F59E0B' },
    }),
  ]);
  console.log('✅ Categories seeded:', categories.length);

  // Sample projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { slug: 'nova-brand-identity' },
      update: {},
      create: {
        title: 'Nova Brand Identity',
        slug: 'nova-brand-identity',
        categoryId: categories[0].id,
        clientName: 'Nova Tech',
        description: 'A complete brand identity system for a cutting-edge technology startup, featuring a bold visual language that communicates innovation and reliability.',
        objective: 'Create a distinctive brand identity that positions Nova Tech as a premium technology company in the competitive SaaS market.',
        process: 'We began with extensive discovery workshops, competitor analysis, and target audience research. Through multiple ideation rounds, we developed a visual system grounded in the concept of connectivity and precision.',
        results: 'The new brand identity resulted in a 40% increase in brand recognition and helped Nova Tech secure Series A funding of $5M.',
        coverImage: 'https://images.unsplash.com/photo-1636622433525-127afdf3662d?w=1200',
        featured: true,
        status: ProjectStatus.PUBLISHED,
        year: 2024,
        tags: ['branding', 'identity', 'logo', 'brand-system'],
      },
    }),
    prisma.project.upsert({
      where: { slug: 'luxe-ecommerce-ui' },
      update: {},
      create: {
        title: 'Luxe E-Commerce Platform',
        slug: 'luxe-ecommerce-ui',
        categoryId: categories[1].id,
        clientName: 'Luxe Fashion',
        description: 'A premium e-commerce UI/UX design for a luxury fashion brand, prioritizing high-end aesthetics and seamless shopping experience.',
        objective: 'Redesign the digital shopping experience to match the brand\'s premium positioning and increase conversion rates.',
        process: 'Conducted user journey mapping, A/B testing of key flows, and extensive prototyping to validate design decisions before development handoff.',
        results: 'Achieved 65% improvement in conversion rate and 3x increase in average order value post-launch.',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        featured: true,
        status: ProjectStatus.PUBLISHED,
        year: 2024,
        tags: ['ui-design', 'ux', 'ecommerce', 'luxury'],
      },
    }),
    prisma.project.upsert({
      where: { slug: 'pulse-motion-reel' },
      update: {},
      create: {
        title: 'Pulse Motion Graphics Reel',
        slug: 'pulse-motion-reel',
        categoryId: categories[2].id,
        clientName: 'Pulse Media',
        description: 'An energetic motion graphics package for a media production company, including logo animations, lower thirds, and broadcast templates.',
        objective: 'Develop a cohesive motion design system that elevates broadcast production quality.',
        process: 'Developed style frames, motion principles, and a comprehensive animation library using After Effects and Cinema 4D.',
        results: 'Motion package is now used across 50+ broadcast productions per year.',
        coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200',
        featured: false,
        status: ProjectStatus.PUBLISHED,
        year: 2023,
        tags: ['motion', 'animation', 'broadcast', 'after-effects'],
      },
    }),
  ]);
  console.log('✅ Projects seeded:', projects.length);

  // Sample lead
  await prisma.lead.upsert({
    where: { id: 'seed-lead-001' },
    update: {},
    create: {
      id: 'seed-lead-001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      service: 'Branding',
      message: 'We need a complete rebrand for our fintech startup. Looking for a premium design partner.',
      status: LeadStatus.NEW,
    },
  });
  console.log('✅ Sample lead seeded');

  // Site settings
  const settings = [
    { key: 'hero_headline', value: 'We Create\nVisual Experiences' },
    { key: 'hero_subtext', value: 'Premium creative studio crafting brands, interfaces, and digital experiences that leave lasting impressions.' },
    { key: 'hero_cta_primary', value: 'View Our Work' },
    { key: 'hero_cta_secondary', value: 'Start a Project' },
    { key: 'featured_project_ids', value: JSON.stringify([]) },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Site settings seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('Admin login: admin@markui.lk / MarkUI@Admin2024!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
