'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: '✉',
      label: 'Email',
      value: 'hello@bookly.store',
      href: 'mailto:hello@bookly.store',
      color: 'var(--bg-accent-blue)',
    },
    {
      icon: '☎',
      label: 'Phone',
      value: '+91 98765 43210',
      href: 'tel:+919876543210',
      color: 'var(--bg-accent-mint)',
    },
    {
      icon: '◎',
      label: 'Location',
      value: 'Ahmedabad, Gujarat, India',
      href: '#',
      color: 'var(--bg-accent-yellow)',
    },
    {
      icon: '◷',
      label: 'Hours',
      value: 'Mon — Sat, 9AM — 7PM IST',
      href: '#',
      color: 'var(--bg-accent-violet)',
    },
  ];

  return (
    <div className='min-h-screen bg-[var(--bg-page)]'>
      {/* Page Header */}
      <div className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div>
              <p className='font-editorial-mono text-[9px] uppercase tracking-[0.3em] text-[var(--bg-accent-pink)] font-bold mb-2'>
                GET IN TOUCH
              </p>
              <h1 className='font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--text-main)] leading-tight'>
                Contact{' '}
                <span className='italic editorial-highlighter'>Bookly</span>
              </h1>
              <p className='font-editorial-sans text-sm text-[var(--text-muted)] mt-3 max-w-lg leading-relaxed'>
                Questions, feedback, bulk orders, or partnership inquiries — we&apos;d love to hear from you.
              </p>
            </div>
            <Link
              href='/faq'
              className='neo-btn-secondary px-6 py-3 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-2 shrink-0'
            >
              View FAQ ↗
            </Link>
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 items-start'>
          {/* Contact Methods Sidebar */}
          <div className='lg:col-span-2 space-y-4'>
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className='block border-2 border-[var(--border-main)] bg-[var(--bg-surface)] p-5 hover:translate-x-1 hover:shadow-[var(--shadow-neo)] transition-all duration-200 group'
              >
                <div className='flex items-start gap-4'>
                  <div
                    className='w-10 h-10 border-2 border-[var(--border-main)] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform'
                    style={{ backgroundColor: method.color }}
                  >
                    {method.icon}
                  </div>
                  <div>
                    <p className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)] font-bold'>
                      {method.label}
                    </p>
                    <p className='font-editorial-sans text-sm text-[var(--text-main)] mt-0.5 group-hover:text-[var(--bg-accent-blue)] transition-colors'>
                      {method.value}
                    </p>
                  </div>
                </div>
              </a>
            ))}

            {/* Social Links */}
            <div className='border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] p-5'>
              <p className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)] font-bold mb-3'>
                FOLLOW US
              </p>
              <div className='flex gap-2'>
                {['Twitter / X', 'Instagram', 'LinkedIn', 'GitHub'].map(
                  (platform) => (
                    <span
                      key={platform}
                      className='px-3 py-1.5 border border-[var(--border-subtle)] font-editorial-mono text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:border-[var(--border-main)] hover:text-[var(--text-main)] hover:bg-[var(--bg-accent-yellow)] cursor-pointer transition-all'
                    >
                      {platform}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-3'>
            <div className='border-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
              {/* Form header */}
              <div className='px-6 py-4 border-b-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)]'>
                <div className='flex items-center gap-3'>
                  <span className='inline-block w-3 h-3 bg-[var(--bg-accent-pink)] border-2 border-[var(--border-main)]' />
                  <div>
                    <p className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)]'>
                      SEND A MESSAGE
                    </p>
                    <h2 className='font-editorial-serif text-xl text-[var(--text-main)] mt-0.5'>
                      Write to Us
                    </h2>
                  </div>
                </div>
              </div>

              {/* Success message */}
              {isSubmitted && (
                <div className='mx-6 mt-6 border-2 border-[var(--bg-accent-mint)] bg-[var(--bg-accent-mint)]/10 p-4 animate-fade-in-up'>
                  <p className='font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--bg-accent-mint)]'>
                    ✓ Message sent successfully!
                  </p>
                  <p className='font-editorial-sans text-xs text-[var(--text-muted)] mt-1'>
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className='p-6 space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)] block mb-1.5'>
                      Your Name *
                    </label>
                    <input
                      type='text'
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder='Full name'
                      className='w-full px-3 py-2.5 font-editorial-mono text-sm bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-main)] transition-colors'
                    />
                  </div>
                  <div>
                    <label className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)] block mb-1.5'>
                      Email Address *
                    </label>
                    <input
                      type='email'
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder='name@example.com'
                      className='w-full px-3 py-2.5 font-editorial-mono text-sm bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-main)] transition-colors'
                    />
                  </div>
                </div>

                <div>
                  <label className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)] block mb-1.5'>
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className='w-full px-3 py-2.5 font-editorial-mono text-sm bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--border-main)] transition-colors cursor-pointer'
                  >
                    <option value=''>Select a topic...</option>
                    <option value='order'>Order Inquiry</option>
                    <option value='return'>Return / Refund</option>
                    <option value='bulk'>Bulk Order</option>
                    <option value='partnership'>Partnership / Collaboration</option>
                    <option value='feedback'>Feedback</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div>
                  <label className='font-editorial-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-faint)] block mb-1.5'>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder='Tell us how we can help...'
                    className='w-full px-3 py-2.5 font-editorial-mono text-sm bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-main)] resize-none transition-colors'
                  />
                </div>

                <div className='flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]'>
                  <p className='font-editorial-mono text-[9px] text-[var(--text-faint)] uppercase tracking-wider'>
                    We respond within 24 hours
                  </p>
                  <button
                    type='submit'
                    className='neo-btn-primary px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer'
                  >
                    Send Message →
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map / Location Banner */}
        <div className='mt-10 border-2 border-[var(--border-main)] bg-[var(--bg-surface)] p-8 flex flex-col md:flex-row items-center justify-between gap-6'>
          <div>
            <p className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)] font-bold mb-1'>
              BOOKLY HEADQUARTERS
            </p>
            <h3 className='font-editorial-serif text-2xl text-[var(--text-main)]'>
              Ahmedabad, Gujarat
            </h3>
            <p className='font-editorial-sans text-sm text-[var(--text-muted)] mt-1'>
              Innovation Hub, Near SG Highway, Ahmedabad — 380015, India
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <span className='w-2 h-2 rounded-full bg-[var(--bg-accent-mint)] animate-pulse' />
            <span className='font-editorial-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)] font-bold'>
              Open Now · Mon–Sat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
