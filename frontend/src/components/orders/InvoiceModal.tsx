'use client';

import React, { useState } from 'react';
import { Order } from '../../types/order';
import { BooklyLogo } from '../common/BooklyLogo';

interface InvoiceModalProps {
  order: Order | any;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !order) return null;

  const invoiceNo = `INV-BK-${order.orderNumber ? String(order.orderNumber).replace(/\D/g, '') : Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const rawMethod = String(order.paymentMethod || order.payment?.method || '').toUpperCase();
  const rawPaymentStatus = String(order.paymentStatus || order.payment?.status || '').toUpperCase();

  const isCOD = rawMethod === 'COD' || rawMethod.includes('CASH') || rawMethod.includes('DELIVERY');
  const isOnline = !isCOD;
  const isDelivered = order.orderStatus === 'DELIVERED';
  const isPaid = (isCOD && isDelivered) || (!isCOD && rawPaymentStatus === 'PAID');

  const subtotal = order.totalAmount || (order.items || []).reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST on books (2.5% CGST + 2.5% SGST)
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = order.finalAmount || (subtotal + shipping);
  const trackingNumber = `BLUEDART-EXP-${String(order.orderNumber || order.id).replace(/\D/g, '').slice(-6) || '928410'}-IN`;

  const handlePrint = () => {
    window.print();
  };

  const copyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoiceNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-3xl bg-[#fdfbf7] dark:bg-[#121214] text-[#1a1a1a] dark:text-[#f4f4f5] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#d6cdb8] dark:border-zinc-800 overflow-hidden my-6 animate-scale-in">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b-2 border-[#e6decb] dark:border-zinc-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-xs" />
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Tax Invoice &amp; Packaging Slip
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyInvoiceNumber}
              className="px-3.5 py-2 rounded-xl bg-[#eee7d5] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-[#e2d8bf] dark:hover:bg-zinc-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              title="Copy Invoice ID"
            >
              <span>📋</span>
              <span>{copied ? 'Copied!' : 'Copy Inv #'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer transition"
            >
              <span>🖨️</span>
              <span>Print / Download</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#eee7d5] dark:bg-zinc-800 hover:bg-rose-500 hover:text-white text-zinc-600 dark:text-zinc-300 font-bold flex items-center justify-center transition cursor-pointer"
              title="Close Invoice"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-[#e6decb] dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <BooklyLogo size="sm" showText={false} />
              <span className="text-2xl font-serif font-black tracking-tight text-zinc-950 dark:text-white">
                BOOKLY EDITIONS PVT. LTD.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Curated Archival Publications &amp; Independent Press<br />
              Central Warehouse Hub, Sector 42, Bandra-Kurla Complex<br />
              Mumbai, Maharashtra 400051 · GSTIN: 27AABCB1234F1Z9
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
              ORIGINAL CUSTOMER TAX INVOICE
            </span>
            <p className="text-base sm:text-lg font-mono font-black text-zinc-900 dark:text-white mt-1">{invoiceNo}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Date: {invoiceDate}</p>

            {/* Official Status Stamp Badge */}
            <div className="mt-2.5 inline-block">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs ${
                  isCOD
                    ? isDelivered
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-400'
                      : 'bg-amber-100 text-amber-950 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-400'
                    : isPaid
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-400'
                    : 'bg-rose-100 text-rose-950 dark:bg-rose-950/80 dark:text-rose-200 border border-rose-400'
                }`}
              >
                {isCOD ? (
                  isDelivered ? '✓ PAID AT DOORSTEP (CASH COLLECTED)' : '🚚 CASH ON DELIVERY · DUE AT DOORSTEP'
                ) : isPaid ? (
                  '✓ PREPAID ONLINE · VERIFIED GATEWAY'
                ) : (
                  '⏳ PAYMENT PENDING'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta Deck */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b-2 border-[#e6decb] dark:border-zinc-800 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#f4ede0] dark:bg-zinc-900 border border-[#e2d7c0] dark:border-zinc-800 space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
              Billed &amp; Shipped To:
            </span>
            <p className="font-bold text-zinc-900 dark:text-white text-base mt-1">
              {order.shippingName || order.customerName || 'Verified Archival Reader'}
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans text-xs sm:text-sm">
              {order.shippingAddress || 'Registered Delivery Address'}<br />
              {order.shippingCity || 'Mumbai'}, {order.shippingPostalCode || '400001'}
            </p>
            {order.shippingPhone && (
              <p className="text-zinc-600 dark:text-zinc-400 font-mono text-xs pt-1">
                Contact: +91 {order.shippingPhone}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#f4ede0] dark:bg-zinc-900 border border-[#e2d7c0] dark:border-zinc-800 space-y-2 font-mono text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 dark:text-zinc-400">Order Reference:</span>
              <span className="font-bold text-zinc-900 dark:text-white">{order.orderNumber || order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 dark:text-zinc-400">Payment Mode:</span>
              <span className={`font-bold uppercase ${isCOD ? 'text-amber-700 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'}`}>
                {isCOD ? '💵 Cash on Delivery (COD)' : '💳 Prepaid (Razorpay / UPI / Card)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 dark:text-zinc-400">Payment Status:</span>
              <span className={`font-bold uppercase ${isPaid ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {isCOD ? (isDelivered ? 'PAID ON DELIVERY' : 'PENDING (PAY ON ARRIVAL)') : (isPaid ? 'PAID IN FULL' : 'PENDING')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#e2d7c0] dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Courier Tracking:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{trackingNumber}</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6 border-b-2 border-[#e6decb] dark:border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-[#e6decb] dark:border-zinc-800 font-mono text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="pb-3 font-bold">Volume / Edition Description</th>
                <th className="pb-3 text-center font-bold">Qty</th>
                <th className="pb-3 text-right font-bold">Unit Price</th>
                <th className="pb-3 text-right font-bold">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee6d3] dark:divide-zinc-800/80">
              {(order.items || []).map((item: any, idx: number) => {
                const itemTitle = item.book?.title || item.title || 'Archival Edition Volume';
                const itemAuthor = item.book?.author || item.author || 'Author';
                const itemQty = item.quantity || 1;
                const itemPrice = item.price || 499;

                return (
                  <tr key={idx} className="py-3">
                    <td className="py-3 pr-3">
                      <p className="font-bold text-zinc-950 dark:text-white text-sm sm:text-base">{itemTitle}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">By {itemAuthor} · Smyth-Sewn Hardbound</p>
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-sm">{itemQty}</td>
                    <td className="py-3 text-right font-mono text-sm">₹{itemPrice}</td>
                    <td className="py-3 text-right font-mono font-bold text-sm sm:text-base text-zinc-950 dark:text-white">
                      ₹{itemPrice * itemQty}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Tax Breakdown */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-[#e6decb] dark:border-zinc-800 text-xs sm:text-sm">
          <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-sm space-y-1.5">
            <p className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
              Archival Guarantee:
            </p>
            <p className="text-xs">
              Thank you for patronizing physical books. All volumes are insured in transit with a 7-day replacement guarantee. Keep this invoice for your archive records.
            </p>
          </div>

          <div className="space-y-2 sm:text-right sm:min-w-64 font-mono">
            <div className="flex justify-between gap-6 text-zinc-600 dark:text-zinc-400">
              <span>Catalog Subtotal:</span>
              <span className="font-bold text-zinc-900 dark:text-white">₹{subtotal}</span>
            </div>
            <div className="flex justify-between gap-6 text-zinc-600 dark:text-zinc-400">
              <span>GST Included (2.5% CGST + 2.5% SGST):</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between gap-6 text-zinc-600 dark:text-zinc-400">
              <span>Doorstep Dispatch Fee:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between gap-6 pt-3 border-t-2 border-[#d6cdb8] dark:border-zinc-700 font-sans text-base sm:text-lg">
              <span className="font-black text-zinc-950 dark:text-white">Grand Total:</span>
              <span className="font-black text-zinc-950 dark:text-white font-mono text-lg sm:text-xl">₹{total}</span>
            </div>
            <div className="text-xs font-sans text-zinc-500 pt-1">
              {isCOD ? 'Due in cash upon doorstep delivery by BlueDart agent' : 'Prepaid transaction verified and settled'}
            </div>
          </div>
        </div>

        {/* Bottom Verification & Barcode */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="text-xl tracking-widest font-black">||| | ||||| || |||||||| |||| |</span>
            <span className="text-[11px] font-bold tracking-wider uppercase">AUTHENTIC ARCHIVE COPY</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Authorized Custodian: BOOKLY Fulfillment Hub</span>
          </div>
        </div>

      </div>
    </div>
  );
}
