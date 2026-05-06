'use client';

import { useState } from 'react';
import { formatDateShort } from '@/lib/utils';
import { MessageSquare, ChevronDown, Loader2 } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: Date;
}

const STATUSES = ['ALL', 'NEW', 'IN_PROGRESS', 'CONVERTED', 'CLOSED'] as const;
const statusColors: Record<string, string> = {
  NEW: 'badge-primary',
  IN_PROGRESS: 'badge-warning',
  CONVERTED: 'badge-success',
  CLOSED: 'badge-muted',
};

export function LeadsClient({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState<string>('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = filter === 'ALL' ? leads : leads.filter((l) => l.status === filter);

  const updateStatus = async (id: string, status: string) => {
    setLoading(id + '-status');
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: data.lead.status } : l)));
    } finally {
      setLoading(null);
    }
  };

  const saveNotes = async (id: string) => {
    setLoading(id + '-notes');
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editNotes[id] }),
      });
      const data = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes: data.lead.notes } : l)));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Leads</h1>
          <p className="text-text-muted text-sm mt-1">{leads.length} total</p>
        </div>

        {/* Status filter */}
        <div className="flex gap-1 p-1 bg-surface rounded-lg">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                filter === s ? 'bg-primary text-white' : 'text-text-muted hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
              {s !== 'ALL' && (
                <span className="ml-1 opacity-60">{leads.filter((l) => l.status === s).length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((lead) => (
          <div key={lead.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare size={14} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-white text-sm">{lead.name}</p>
                    <span className={statusColors[lead.status]}>{lead.status.replace('_', ' ').toLowerCase()}</span>
                    {lead.service && (
                      <span className="badge-muted">{lead.service}</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</p>
                  <p className="text-xs text-text-subtle mt-1">{formatDateShort(lead.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="input-field py-1.5 text-xs"
                  disabled={loading === lead.id + '-status'}
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <button
                  onClick={() => {
                    if (expanded === lead.id) {
                      setExpanded(null);
                    } else {
                      setExpanded(lead.id);
                      setEditNotes((prev) => ({ ...prev, [lead.id]: lead.notes ?? '' }));
                    }
                  }}
                  className="p-1.5 rounded-md text-text-subtle hover:text-white hover:bg-surface-2 transition-colors"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${expanded === lead.id ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* Expanded content */}
            {expanded === lead.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Message</p>
                  <p className="text-sm text-text-muted leading-relaxed">{lead.message}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Notes</p>
                  <textarea
                    value={editNotes[lead.id] ?? ''}
                    onChange={(e) => setEditNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                    rows={3}
                    className="input-field resize-none text-sm"
                    placeholder="Internal notes..."
                  />
                  <button
                    onClick={() => saveNotes(lead.id)}
                    disabled={loading === lead.id + '-notes'}
                    className="btn-primary mt-2 text-xs py-1.5"
                  >
                    {loading === lead.id + '-notes' ? <Loader2 size={12} className="animate-spin" /> : null}
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!filtered.length && (
          <div className="card text-center py-12 text-text-muted text-sm">
            No {filter === 'ALL' ? '' : filter.replace('_', ' ').toLowerCase() + ' '}leads found.
          </div>
        )}
      </div>
    </div>
  );
}
