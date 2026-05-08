'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2, Phone, Mail, MapPin } from 'lucide-react';
import { contactSchema, type ContactFormValues } from '@/lib/validations';
import { SectionReveal, RevealItem } from '@/components/ui/SectionReveal';
import { staggerContainer } from '@/lib/animations';
import type { Metadata } from 'next';

const SERVICES = [
  'Brand Identity',
  'UI/UX Design',
  'Motion Design',
  'Web Design',
  'Print & Packaging',
  'Creative Direction',
  'Other',
];

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'info@markui.lk', href: 'mailto:info@markui.lk' },
  { icon: Phone, label: 'Phone', value: '+94 760 887 702', href: 'tel:+94760887702' },
  { icon: MapPin, label: 'Address', value: '548, 1 Avissawella Rd, Wellampitiya 00800', href: 'https://maps.app.goo.gl/MVY8JbaCu7T3wGXW7' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setServerError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Submission failed');
      setSubmitted(true);
      reset();
    } catch (err: any) {
      setServerError(err.message ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="section-container section-padding pt-28">
      {/* Header */}
      <SectionReveal className="mb-16 max-w-2xl">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
          Get In Touch
        </p>
        <h1 className="text-display-lg font-display font-bold text-foreground mb-4">
          Let&apos;s Build Something
          <br />
          <span className="text-gradient">Remarkable</span>
        </h1>
        <p className="text-text-muted text-lg leading-relaxed">
          Tell us about your project and we&apos;ll get back to you within 24 hours.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Contact Info */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-8"
        >
          {contactInfo.map(({ icon: Icon, label, value, href }) => (
            <RevealItem key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-subtle uppercase tracking-widest mb-0.5">{label}</p>
                {href ? (
                  <a href={href} className="text-foreground hover:text-primary transition-colors font-medium" target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    {value}
                  </a>
                ) : (
                  <p className="text-foreground font-medium">{value}</p>
                )}
              </div>
            </RevealItem>
          ))}
        </motion.div>

        {/* Form */}
        <SectionReveal className="lg:col-span-3">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Message Received!</h3>
              <p className="text-text-muted max-w-sm">
                Thanks for reaching out. We&apos;ll review your message and get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary mt-6"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Name *</label>
                  <input
                    {...register('name')}
                    placeholder="Your full name"
                    className="input-field"
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="your@email.com"
                    className="input-field"
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="input-field"
                  />
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="form-label">Service</label>
                  <select {...register('service')} className="input-field">
                    <option value="">Select a service...</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Message *</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Tell us about your project, timeline, and budget..."
                  className="input-field resize-none"
                />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
              </div>

              {serverError && (
                <p className="text-sm text-red-400 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </SectionReveal>
      </div>
    </div>
  );
}
