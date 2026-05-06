import { prisma } from '@/lib/prisma';
import { LeadsClient } from '@/components/admin/LeadsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Leads | Mark UI Admin' };

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });

  return <LeadsClient initial={leads} />;
}
