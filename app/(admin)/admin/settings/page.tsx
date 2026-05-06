import { prisma } from '@/lib/prisma';
import { SettingsClient } from '@/components/admin/SettingsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Settings | Mark UI Admin' };

async function getSettings(): Promise<Record<string, string>> {
  if (!process.env.DATABASE_URL) return {};
  try {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsClient initial={settings} />;
}
