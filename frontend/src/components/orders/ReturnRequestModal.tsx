'use client';

import React, { useState } from 'react';

interface ReturnRequestModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReturn: (returnData: {
    orderId: string;
    reason: string;
    details: string;
    refundUpi: string;
  }) => void;
}

const RETURN_REASONS = [
  'Damaged cover or torn pages upon arrival',
  'Wrong title or translation edition received',
  'Major print defect, illegible text or missing pages',
  'Outer packaging unsealed or package tampered',
  'Duplicate order by mistake',
];

export function ReturnRequestModal({
  order,
  isOpen,
  onClose,
  onSubmitReturn,
}: ReturnRequestModalProps) {
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [details, setDetails] = useState('');
  const [refundUpi, setRefundUpi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReturn({
        orderId: order.id,
        reason,
        details,
        refundUpi: refundUpi.trim(),
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              RETURNS &amp; REVERSE DISPATCH
            </span>
            <h3 className="text-xl font-serif font-black text-zinc-900 dark:text-white mt-0.5">
              Request Order Return
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-400 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Process Info */}
        <div className="my-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
          <p className="font-bold text-zinc-900 dark:text-white">How Returns &amp; Refunds Work:</p>
          <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
            <li>Submit valid return reason &amp; notes below.</li>
            <li>Our courier partner schedules a free doorstep pickup.</li>
            <li>Book travels to Central Fulfillment Warehouse (Mumbai).</li>
            <li>Upon arrival at company boss address, QA inspects condition.</li>
            <li><strong>100% refund</strong> is immediately credited to your UPI ID / Bank.</li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Reason */}
          <div className="space-y-1">
            <label className="block font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Reason for Return
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Details & Proof Note */}
          <div className="space-y-1">
            <label className="block font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Details &amp; Proof Description
            </label>
            <textarea
              required
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the issue in detail (e.g., page 42 torn, spine creased)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Refund UPI / Bank */}
          <div className="space-y-1">
            <label className="block font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Refund UPI ID / Bank Account Details
            </label>
            <input
              type="text"
              required
              value={refundUpi}
              onChange={(e) => setRefundUpi(e.target.value)}
              placeholder="e.g. yourname@okaxis or Bank A/C & IFSC"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[10px] text-zinc-400">
              Refund amount: <strong>₹{order.totalAmount}</strong> will be deposited upon receipt at warehouse.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Return Request ↗'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
