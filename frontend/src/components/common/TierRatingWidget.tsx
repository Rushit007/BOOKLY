'use client';

import React, { useState } from 'react';
import { BookTierRating } from '../../types/book';

interface TierRatingWidgetProps {
  bookId: string;
  initialTier?: BookTierRating;
  initialVotes?: {
    perfection: number;
    go_for_it: number;
    timepass: number;
    skip: number;
  };
  compact?: boolean;
}

const TIER_META: Record<
  BookTierRating,
  { label: string; badge: string; color: string; bg: string; border: string; desc: string; icon: string }
> = {
  perfection: {
    label: 'Perfection',
    badge: '100% MASTERPIECE',
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    desc: 'Flawless literary work. Essential reading for everyone.',
    icon: '👑',
  },
  go_for_it: {
    label: 'Go For It',
    badge: 'HIGHLY RECOMMENDED',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    desc: 'Compelling insights, engaging craft, well worth your time.',
    icon: '⚡',
  },
  timepass: {
    label: 'Timepass',
    badge: 'CASUAL READ',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    desc: 'Light casual read when you have free time.',
    icon: '☕',
  },
  skip: {
    label: 'Skip',
    badge: 'NOT RECOMMENDED',
    color: '#ef4444',
    bg: '#fef2f2',
    border: '#fecaca',
    desc: 'Repetitive or disappointing. You can safely skip this.',
    icon: '⛔',
  },
};

export function TierRatingWidget({
  bookId,
  initialTier = 'perfection',
  initialVotes = { perfection: 120, go_for_it: 30, timepass: 10, skip: 2 },
  compact = false,
}: TierRatingWidgetProps) {
  const [userVoted, setUserVoted] = useState<BookTierRating | null>(null);
  const [votes, setVotes] = useState(initialVotes);

  const totalVotes = votes.perfection + votes.go_for_it + votes.timepass + votes.skip || 1;

  const handleVote = (tier: BookTierRating) => {
    if (userVoted === tier) return;
    setVotes((prev) => {
      const next = { ...prev };
      if (userVoted) {
        next[userVoted] = Math.max(0, next[userVoted] - 1);
      }
      next[tier] = next[tier] + 1;
      return next;
    });
    setUserVoted(tier);
  };

  const currentTier = userVoted || initialTier;
  const currentMeta = TIER_META[currentTier];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
          style={{
            color: currentMeta.color,
            backgroundColor: currentMeta.bg,
            borderColor: currentMeta.border,
          }}
        >
          <span>{currentMeta.icon}</span>
          <span>{currentMeta.label}</span>
        </span>
        <span className="text-[11px] text-zinc-500 font-medium">
          ({Math.round(((votes[currentTier] || 0) / totalVotes) * 100)}% readers agree)
        </span>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
            Reader Consensus Verdict
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl">{currentMeta.icon}</span>
            <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              {currentMeta.label}
            </h4>
            <span
              className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full"
              style={{
                color: currentMeta.color,
                backgroundColor: currentMeta.bg,
                border: `1px solid ${currentMeta.border}`,
              }}
            >
              {currentMeta.badge}
            </span>
          </div>
        </div>
        <div className="text-right sm:self-center">
          <span className="text-xs text-zinc-500 font-medium">
            {totalVotes.toLocaleString()} Reader Votes
          </span>
        </div>
      </div>

      {/* Breakdown Percentage Bars */}
      <div className="space-y-2">
        {(['perfection', 'go_for_it', 'timepass', 'skip'] as BookTierRating[]).map((tier) => {
          const meta = TIER_META[tier];
          const count = votes[tier] || 0;
          const pct = Math.round((count / totalVotes) * 100);
          const isSelected = userVoted === tier;

          return (
            <div key={tier} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                  {isSelected && (
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                      (Your Vote ✓)
                    </span>
                  )}
                </span>
                <span className="text-zinc-500 font-mono text-[11px]">
                  {count.toLocaleString()} votes · {pct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* User Vote CTA */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-[11px] font-medium text-zinc-500 mb-2">
          {userVoted ? 'Thank you for your rating! Change your verdict:' : 'How would you rate this book? Tap below:'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['perfection', 'go_for_it', 'timepass', 'skip'] as BookTierRating[]).map((tier) => {
            const meta = TIER_META[tier];
            const isSelected = userVoted === tier;
            return (
              <button
                key={tier}
                onClick={() => handleVote(tier)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'ring-2 ring-offset-1 shadow-xs font-extrabold'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: meta.bg,
                        color: meta.color,
                        borderColor: meta.border,
                      }
                    : {}
                }
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
