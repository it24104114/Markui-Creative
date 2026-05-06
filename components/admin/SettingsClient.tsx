'use client';

import { useState } from 'react';
import { Loader2, Save, Globe, Share2, LayoutTemplate, BarChart3, Phone } from 'lucide-react';

interface SettingsClientProps {
  initial: Record<string, string>;
}

const DEFAULT: Record<string, string> = {
  // General
  site_name: 'Mark UI Creative',
  site_tagline: 'Premium Creative Studio',
  contact_email: '',
  contact_phone: '',
  contact_address: '',
  // Social
  social_instagram: '',
  social_behance: '',
  social_dribbble: '',
  social_linkedin: '',
  social_twitter: '',
  // Hero
  hero_headline_line1: 'We Create',
  hero_headline_line2: 'Visual Experiences',
  hero_subtext:
    'Premium creative studio crafting brands, interfaces, and digital experiences that leave lasting impressions. Based in Sri Lanka, working globally.',
  hero_cta_primary: 'View Our Work',
  hero_cta_secondary: 'Start a Project',
  // Stats
  stats_projects_value: '120',
  stats_projects_label: 'Projects Delivered',
  stats_years_value: '8',
  stats_years_label: 'Years Experience',
  stats_clients_value: '60',
  stats_clients_label: 'Happy Clients',
  stats_awards_value: '15',
  stats_awards_label: 'Awards Won',
};

interface Section {
  id: string;
  label: string;
  icon: React.ElementType;
  fields: { key: string; label: string; type?: string; placeholder?: string; textarea?: boolean }[];
}

const SECTIONS: Section[] = [
  {
    id: 'general',
    label: 'General',
    icon: Globe,
    fields: [
      { key: 'site_name', label: 'Site Name', placeholder: 'Mark UI Creative' },
      { key: 'site_tagline', label: 'Tagline', placeholder: 'Premium Creative Studio' },
      { key: 'contact_email', label: 'Contact Email', type: 'email', placeholder: 'hello@markui.com' },
      { key: 'contact_phone', label: 'Phone', placeholder: '+94 77 000 0000' },
      { key: 'contact_address', label: 'Address', placeholder: 'Colombo, Sri Lanka', textarea: true },
    ],
  },
  {
    id: 'social',
    label: 'Social Links',
    icon: Share2,
    fields: [
      { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
      { key: 'social_behance', label: 'Behance URL', placeholder: 'https://behance.net/...' },
      { key: 'social_dribbble', label: 'Dribbble URL', placeholder: 'https://dribbble.com/...' },
      { key: 'social_linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
      { key: 'social_twitter', label: 'X / Twitter URL', placeholder: 'https://x.com/...' },
    ],
  },
  {
    id: 'hero',
    label: 'Hero Section',
    icon: LayoutTemplate,
    fields: [
      { key: 'hero_headline_line1', label: 'Headline Line 1', placeholder: 'We Create' },
      { key: 'hero_headline_line2', label: 'Headline Line 2', placeholder: 'Visual Experiences' },
      { key: 'hero_subtext', label: 'Subtext', placeholder: 'Describe your studio...', textarea: true },
      { key: 'hero_cta_primary', label: 'Primary CTA Label', placeholder: 'View Our Work' },
      { key: 'hero_cta_secondary', label: 'Secondary CTA Label', placeholder: 'Start a Project' },
    ],
  },
  {
    id: 'stats',
    label: 'Stats Section',
    icon: BarChart3,
    fields: [
      { key: 'stats_projects_value', label: 'Projects — Value', placeholder: '120' },
      { key: 'stats_projects_label', label: 'Projects — Label', placeholder: 'Projects Delivered' },
      { key: 'stats_years_value', label: 'Years — Value', placeholder: '8' },
      { key: 'stats_years_label', label: 'Years — Label', placeholder: 'Years Experience' },
      { key: 'stats_clients_value', label: 'Clients — Value', placeholder: '60' },
      { key: 'stats_clients_label', label: 'Clients — Label', placeholder: 'Happy Clients' },
      { key: 'stats_awards_value', label: 'Awards — Value', placeholder: '15' },
      { key: 'stats_awards_label', label: 'Awards — Label', placeholder: 'Awards Won' },
    ],
  },
];

export function SettingsClient({ initial }: SettingsClientProps) {
  const [values, setValues] = useState<Record<string, string>>({ ...DEFAULT, ...initial });
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState('');

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const saveSection = async (section: Section) => {
    setSaving(section.id);
    setError('');
    const payload: Record<string, string> = {};
    for (const f of section.fields) {
      payload[f.key] = values[f.key] ?? '';
    }
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaved(section.id);
      setTimeout(() => setSaved(null), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Manage site-wide content and configuration.</p>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const isSaving = saving === section.id;
        const wasSaved = saved === section.id;

        return (
          <div key={section.id} className="card space-y-5">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-white text-sm">
                <Icon size={15} className="text-primary" />
                {section.label}
              </h2>
              <button
                onClick={() => saveSection(section)}
                disabled={isSaving}
                className={`btn-primary py-1.5 text-xs ${wasSaved ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
              >
                {isSaving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}
                {wasSaved ? 'Saved!' : isSaving ? 'Saving…' : 'Save'}
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) =>
                field.textarea ? (
                  <div key={field.key} className="sm:col-span-2">
                    <label className="form-label">{field.label}</label>
                    <textarea
                      rows={3}
                      value={values[field.key] ?? ''}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-field resize-none"
                    />
                  </div>
                ) : (
                  <div key={field.key}>
                    <label className="form-label">{field.label}</label>
                    <input
                      type={field.type ?? 'text'}
                      value={values[field.key] ?? ''}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-field"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
