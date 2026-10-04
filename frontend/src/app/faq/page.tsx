'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'ORDERS & SHIPPING',
    question: 'How long does delivery take?',
    answer:
      'Standard delivery within India takes 3–7 business days. We dispatch within 24 hours of order confirmation. Express shipping (1–3 days) is available at checkout for select pin codes.',
  },
  {
    category: 'ORDERS & SHIPPING',
    question: 'Do you ship internationally?',
    answer:
      'Yes — Bookly ships worldwide. International orders typically arrive within 10–21 business days depending on the destination. Customs duties may apply and are the responsibility of the buyer.',
  },
  {
    category: 'ORDERS & SHIPPING',
    question: 'Can I track my order?',
    answer:
      "Absolutely. Once your order ships, you will receive an email with a tracking number and a link to our courier partner tracking page. You can also check your order status in the Order Archive section of your account.",
  },
  {
    category: 'PAYMENTS',
    question: 'What payment methods do you accept?',
    answer:
      'We accept UPI, Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery (COD). Online payments are processed securely via Razorpay. Prepaid orders enjoy a 5% discount.',
  },
  {
    category: 'PAYMENTS',
    question: 'Is it safe to pay online on Bookly?',
    answer:
      'Yes. All transactions are encrypted using industry-standard TLS/SSL. We use Razorpay — a PCI DSS Level 1 certified payment gateway — to process all online payments. We never store your card details.',
  },
  {
    category: 'RETURNS & REFUNDS',
    question: 'What is your return policy?',
    answer:
      'We accept returns within 7 days of delivery for damaged, defective, or incorrect items. Books must be in their original condition. Initiate a return from your Order Archive or contact us directly.',
  },
  {
    category: 'RETURNS & REFUNDS',
    question: 'How long do refunds take?',
    answer:
      "Once we receive your returned item, refunds are processed within 3\u20135 business days. The amount is credited back to your original payment method. COD refunds are issued via bank transfer.",
  },
  {
    category: 'ACCOUNT & FEATURES',
    question: 'How does Book Match work?',
    answer:
      "Book Match is our AI-powered recommendation engine. Answer a few questions about your reading preferences, mood, and interests, and we'll suggest curated titles from our catalog that match your profile.",
  },
  {
    category: 'ACCOUNT & FEATURES',
    question: 'How do I use the Compare feature?',
    answer:
      "Click the Compare button on any book card to add it to your comparison tray (up to 4 books). Navigate to the Compare page to see a side-by-side breakdown of price, ratings, genre, and more.",
  },
  {
    category: 'ACCOUNT & FEATURES',
    question: 'Do I need an account to browse or buy?',
    answer:
      'You can browse the full catalog without an account. However, creating an account lets you save items to your wishlist, track orders, access Book Match, and enjoy a faster checkout experience.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = Array.from(new Set(FAQ_DATA.map((f) => f.category)));

  return (
    <div className='min-h-screen bg-[var(--bg-page)]'>
      {/* Page Header */}
      <div className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
          <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div>
              <p className='font-editorial-mono text-[9px] uppercase tracking-[0.3em] text-[var(--bg-accent-blue)] font-bold mb-2'>
                HELP CENTER
              </p>
              <h1 className='font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--text-main)] leading-tight'>
                Frequently Asked{' '}
                <span className='italic editorial-highlighter'>Questions</span>
              </h1>
              <p className='font-editorial-sans text-sm text-[var(--text-muted)] mt-3 max-w-lg leading-relaxed'>
                Everything you need to know about ordering, shipping, payments, and using Bookly.
              </p>
            </div>
            <Link
              href='/contact'
              className='neo-btn-secondary px-6 py-3 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-2 shrink-0'
            >
              Contact Us ↗
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start'>
          {/* Category Navigation Sidebar */}
          <div className='lg:col-span-1 sticky top-24'>
            <div className='border-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
              <div className='px-4 py-3 border-b-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)]'>
                <p className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)] font-bold'>
                  TOPICS
                </p>
              </div>
              <div className='divide-y divide-[var(--border-subtle)]'>
                {categories.map((cat) => (
                  <a
                    key={cat}
                    href={`#${cat.toLowerCase().replace(/[^a-z]/g, '-')}`}
                    className='block px-4 py-3 font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] transition-colors'
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className='lg:col-span-3 space-y-8'>
            {categories.map((cat) => (
              <div
                key={cat}
                id={cat.toLowerCase().replace(/[^a-z]/g, '-')}
                className='scroll-mt-28'
              >
                {/* Category Header */}
                <div className='flex items-center gap-3 mb-4 pb-3 border-b-2 border-[var(--border-main)]'>
                  <span className='inline-block w-3 h-3 bg-[var(--bg-accent-yellow)] border-2 border-[var(--border-main)]' />
                  <h2 className='font-editorial-serif text-xl text-[var(--text-main)]'>
                    {cat.charAt(0) + cat.slice(1).toLowerCase().replace(/&/g, '&')}
                  </h2>
                </div>

                {/* Questions */}
                <div className='border-2 border-[var(--border-main)] divide-y-2 divide-[var(--border-subtle)] bg-[var(--bg-surface)]'>
                  {FAQ_DATA.filter((f) => f.category === cat).map((faq, idx) => {
                    const globalIdx = FAQ_DATA.indexOf(faq);
                    const isOpen = openIndex === globalIdx;

                    return (
                      <div key={globalIdx}>
                        <button
                          onClick={() =>
                            setOpenIndex(isOpen ? null : globalIdx)
                          }
                          className='w-full px-5 py-4 flex items-center justify-between text-left group hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer'
                        >
                          <div className='flex items-center gap-3 min-w-0'>
                            <span className='font-editorial-mono text-[10px] font-bold text-[var(--text-faint)] shrink-0'>
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <h3 className='font-editorial-sans text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--bg-accent-blue)] transition-colors'>
                              {faq.question}
                            </h3>
                          </div>
                          <span
                            className={
                              'font-editorial-mono text-lg text-[var(--text-faint)] transition-transform duration-300 shrink-0 ml-3 ' +
                              (isOpen ? 'rotate-45' : 'rotate-0')
                            }
                          >
                            +
                          </span>
                        </button>
                        {isOpen && (
                          <div className='px-5 pb-5 animate-fade-in-up'>
                            <div className='pl-8 border-l-2 border-[var(--bg-accent-yellow)]'>
                              <p className='font-editorial-sans text-sm text-[var(--text-muted)] leading-relaxed'>
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* CTA Section */}
            <div className='border-2 border-[var(--border-main)] bg-[var(--bg-surface-elevated)] p-8 text-center'>
              <p className='font-editorial-serif text-2xl text-[var(--text-main)] mb-2'>
                Still have questions?
              </p>
              <p className='font-editorial-sans text-sm text-[var(--text-muted)] mb-6'>
                We&apos;re always happy to help. Reach out and we&apos;ll get back within 24 hours.
              </p>
              <Link
                href='/contact'
                className='neo-btn-primary px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-2'
              >
                Get in Touch ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
