'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/common/Toast';
import { InvoiceModal } from '../../components/orders/InvoiceModal';
import { ReturnRequestModal } from '../../components/orders/ReturnRequestModal';

const ORDER_LIFECYCLE_STEPS = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: '📝', desc: 'Verified and queued for dispatch' },
  { key: 'PACKED', label: 'Archival Packing', icon: '📦', desc: 'Sealed with bubble cushioning in archive box' },
  { key: 'SHIPPED', label: 'In Transit', icon: '🚚', desc: 'Handed over to BlueDart express courier' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🛵', desc: 'Courier agent en route to your doorstep' },
  { key: 'DELIVERED', label: 'Safely Delivered', icon: '🏡', desc: 'Handed over at doorstep' },
];

const RETURN_LIFECYCLE_STEPS = [
  { key: 'RETURN_REQUESTED', label: 'Return Initiated', icon: '📋', desc: 'Reason and details approved' },
  { key: 'RETURN_PICKED_UP', label: 'Courier Picked Up', icon: '📦', desc: 'Courier collected parcel from customer' },
  { key: 'RETURN_IN_TRANSIT', label: 'In Reverse Transit', icon: '✈️', desc: 'Traveling to Central Hub (Mumbai)' },
  { key: 'RETURN_RECEIVED', label: 'Reached Central Hub', icon: '🏢', desc: 'Arrived at Bookly Headquarters' },
  { key: 'REFUND_PROCESSED', label: '100% Refund Credited', icon: '💰', desc: 'Refund sent to your UPI / Bank Account' },
];

// Sample demo orders for testing when offline
const DEMO_ORDERS: any[] = [
  {
    id: 'ord-demo-1',
    orderNumber: 'ORD-BK-92814',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    orderStatus: 'PACKED',
    paymentMethod: 'COD',
    totalAmount: 1198,
    finalAmount: 1198,
    shippingName: 'Aarav Sharma',
    shippingAddress: '402, Lotus Residency, MG Road, Bandra West',
    shippingCity: 'Mumbai',
    shippingPostalCode: '400050',
    shippingPhone: '9820194821',
    items: [
      {
        book: {
          id: 'clean-code',
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
        },
        quantity: 1,
        price: 699,
      },
      {
        book: {
          id: 'atomic-habits',
          title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
          author: 'James Clear',
        },
        quantity: 1,
        price: 499,
      },
    ],
  },
  {
    id: 'ord-demo-2',
    orderNumber: 'ORD-BK-88421',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    orderStatus: 'DELIVERED',
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    totalAmount: 1250,
    finalAmount: 1187,
    shippingName: 'Aarav Sharma',
    shippingAddress: '402, Lotus Residency, MG Road, Bandra West',
    shippingCity: 'Mumbai',
    shippingPostalCode: '400050',
    shippingPhone: '9820194821',
    items: [
      {
        book: {
          id: 'designing-data-intensive',
          title: 'Designing Data-Intensive Applications',
          author: 'Martin Kleppmann',
        },
        quantity: 1,
        price: 1250,
      },
    ],
  },
];

export function getStepIndex(currentStatus: string, steps: typeof ORDER_LIFECYCLE_STEPS) {
  if (currentStatus === 'PENDING') return 0;
  if (currentStatus === 'PROCESSING') return 1;
  const idx = steps.findIndex((s) => s.key === currentStatus);
  return idx >= 0 ? idx : 0;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showSuccess, showInfo } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'COD' | 'RETURNS'>('ALL');
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  // Modals state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<any | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const data = await api.getOrders();
        if (data && data.length > 0) {
          setOrders(data);
        } else if (!isAuthenticated) {
          setOrders(DEMO_ORDERS);
        } else {
          setOrders([]);
        }
      } catch (err) {
        if (!isAuthenticated) {
          setOrders(DEMO_ORDERS);
        } else {
          setOrders([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [isAuthenticated]);

  // Re-Order (Buy Again) functionality
  const handleBuyAgain = (order: any) => {
    let addedCount = 0;
    (order.items || []).forEach((item: any) => {
      const bookObj = item.book || {
        id: item.bookId || item.id || `reorder-${Date.now()}`,
        title: item.title || 'Archival Volume',
        author: item.author || 'Author',
        price: item.price || 499,
      };
      addToCart(bookObj, item.quantity || 1);
      addedCount += (item.quantity || 1);
    });

    showSuccess(
      'Re-ordered to Reading Bag! 🛍️',
      `Added ${addedCount} edition(s) from Order #${order.orderNumber} to your cart.`
    );
  };

  // Copy Tracking ID
  const handleCopyTracking = (trackingId: string) => {
    navigator.clipboard.writeText(trackingId);
    setCopiedTrackingId(trackingId);
    showInfo('Tracking Copied', `Tracking ID ${trackingId} copied to clipboard.`);
    setTimeout(() => setCopiedTrackingId(null), 2500);
  };

  const handleReturnSubmit = (returnData: {
    orderId: string;
    reason: string;
    details: string;
    refundUpi: string;
  }) => {
    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === returnData.orderId || o.orderNumber === returnData.orderId) {
          const modOrder = {
            ...o,
            orderStatus: 'RETURN_REQUESTED',
            returnRequest: {
              reason: returnData.reason,
              comments: returnData.details,
              upiId: returnData.refundUpi,
              requestedAt: new Date().toISOString(),
              status: 'PENDING',
              refundAmount: o.finalAmount || o.totalAmount,
            },
            updatedAt: new Date().toISOString(),
          };
          api.saveLocalOrder(modOrder);
          return modOrder;
        }
        return o;
      });
      return updated;
    });

    setNotificationBanner(
      `✓ Return request submitted for Order #${returnData.orderId}. Free BlueDart doorstep pickup scheduled! 100% refund will be deposited to ${returnData.refundUpi} once received at headquarters.`
    );
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        String(order.orderNumber || '').toLowerCase().includes(q) ||
        String(order.shippingCity || '').toLowerCase().includes(q) ||
        (order.items || []).some((item: any) =>
          String(item.book?.title || item.title || '').toLowerCase().includes(q) ||
          String(item.book?.author || item.author || '').toLowerCase().includes(q)
        );

      if (!matchesQuery) return false;

      // Status tab filter
      const status = String(order.orderStatus || '').toUpperCase();
      const method = String(order.paymentMethod || order.payment?.method || '').toUpperCase();
      const isCOD = method === 'COD' || method.includes('CASH');

      if (activeFilter === 'ACTIVE') {
        return status !== 'DELIVERED' && !status.startsWith('RETURN_') && status !== 'CANCELLED';
      }
      if (activeFilter === 'DELIVERED') {
        return status === 'DELIVERED';
      }
      if (activeFilter === 'COD') {
        return isCOD;
      }
      if (activeFilter === 'RETURNS') {
        return status.startsWith('RETURN_') || status === 'REFUND_PROCESSED';
      }
      return true;
    });
  }, [orders, searchQuery, activeFilter]);

  // Overall Statistics
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);
  }, [orders]);

  const activeShipments = useMemo(() => {
    return orders.filter(
      (o) => o.orderStatus !== 'DELIVERED' && !String(o.orderStatus).startsWith('RETURN_') && o.orderStatus !== 'CANCELLED'
    ).length;
  }, [orders]);

  const totalVolumesCount = useMemo(() => {
    return orders.reduce(
      (sum, o) => sum + (o.items || []).reduce((iSum: number, item: any) => iSum + (item.quantity || 1), 0),
      0
    );
  }, [orders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-sm uppercase tracking-widest text-[var(--text-muted)] animate-pulse font-bold">
            Retrieving Archival Orders &amp; Live Tracking...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] py-10 font-sans transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title with Archival Seal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-[var(--border-main)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2.5">
              <span>🚚</span>
              <span>LIVE SHIPMENT TRACKING &amp; TAX INVOICES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[var(--text-main)] tracking-tight">
              My Orders &amp; Archival Deliveries
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
              Track courier progress, download GST receipts, inspect dispatch waybills, and re-order with ease.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/books"
              className="px-5 py-3 rounded-2xl bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-main)] text-[var(--text-main)] hover:border-black dark:hover:border-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs"
            >
              <span>📚</span>
              <span>Browse Catalog</span>
            </Link>
            <Link
              href="/cart"
              className="px-5 py-3 rounded-2xl bg-[var(--bg-primary)] text-[var(--bg-page)] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:opacity-90"
            >
              <span>🛍️</span>
              <span>Reading Bag</span>
            </Link>
          </div>
        </div>

        {/* Live Notification Banner */}
        {notificationBanner && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200 text-sm font-semibold flex items-start gap-3 animate-fade-in">
            <span className="text-xl">✅</span>
            <div className="flex-1">
              <p>{notificationBanner}</p>
            </div>
            <button
              onClick={() => setNotificationBanner(null)}
              className="text-xs font-bold uppercase underline cursor-pointer hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── Stats Hub ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-xs">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-faint)]">Total Orders</p>
            <p className="text-2xl sm:text-3xl font-serif font-black text-[var(--text-main)] mt-1">{orders.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-xs">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-faint)]">Active Deliveries</p>
            <p className="text-2xl sm:text-3xl font-serif font-black text-amber-600 dark:text-amber-400 mt-1">{activeShipments}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-xs">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-faint)]">Volumes Collected</p>
            <p className="text-2xl sm:text-3xl font-serif font-black text-blue-600 dark:text-blue-400 mt-1">{totalVolumesCount}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-xs">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-faint)]">Total Investment</p>
            <p className="text-2xl sm:text-3xl font-serif font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{totalSpent}</p>
          </div>
        </div>

        {/* ── Search & Filter Controls Bar ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)]">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Orders' },
              { id: 'ACTIVE', label: 'Active Shipments' },
              { id: 'DELIVERED', label: 'Delivered' },
              { id: 'COD', label: 'Cash on Delivery' },
              { id: 'RETURNS', label: 'Returns & Refunds' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[var(--text-main)] text-[var(--bg-page)] shadow-xs'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-main)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order # or title..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-amber-500 font-sans"
            />
            <span className="absolute left-3 top-2.5 text-sm text-[var(--text-faint)]">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-[var(--text-faint)] hover:text-[var(--text-main)] font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Order List ── */}
        {filteredOrders.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] text-center space-y-4 shadow-xs">
            <span className="text-5xl block">📭</span>
            <h3 className="font-serif text-2xl font-bold text-[var(--text-main)]">
              {searchQuery || activeFilter !== 'ALL' ? 'No Matching Orders Found' : 'No Orders Placed Yet'}
            </h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
              {searchQuery || activeFilter !== 'ALL'
                ? 'Try clearing your search query or switching to "All Orders".'
                : 'Your archival bookshelf is currently empty. Explore our collection and add your first foundational volume.'}
            </p>
            <Link
              href="/books"
              className="inline-block mt-3 px-6 py-3 rounded-2xl bg-[var(--bg-primary)] text-[var(--bg-page)] font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90"
            >
              Explore Catalog Now →
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map((order) => {
              const isReturnMode = (order.orderStatus || '').startsWith('RETURN_') || order.orderStatus === 'REFUND_PROCESSED';
              const activeSteps = isReturnMode ? RETURN_LIFECYCLE_STEPS : ORDER_LIFECYCLE_STEPS;
              const currentStepIdx = getStepIndex(order.orderStatus, activeSteps);

              const rawMethod = String(order.paymentMethod || order.payment?.method || '').toUpperCase();
              const isCOD = rawMethod === 'COD' || rawMethod.includes('CASH') || rawMethod.includes('DELIVERY');
              const isDelivered = order.orderStatus === 'DELIVERED';
              const isPaid = (isCOD && isDelivered) || (!isCOD && String(order.paymentStatus).toUpperCase() === 'PAID');
              
              const trackingNumber = `BLUEDART-EXP-${String(order.orderNumber || order.id).replace(/\D/g, '').slice(-6) || '928410'}-IN`;

              return (
                <div
                  key={order.id}
                  className="bg-[var(--bg-surface)] border-2 border-[var(--border-main)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 hover:shadow-md transition-shadow"
                >
                  {/* Top Order Information Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b-2 border-[var(--border-subtle)]">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xl font-serif font-black text-[var(--text-main)]">
                          {order.orderNumber || order.id}
                        </span>
                        <span className="font-mono text-xs text-[var(--text-faint)]">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        
                        {/* Clear Payment Method Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            isCOD
                              ? isDelivered
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {isCOD ? (
                            isDelivered ? '✓ Cash Collected on Delivery' : '💵 Cash on Delivery (Due at Doorstep)'
                          ) : (
                            '💳 Prepaid Online (Card/UPI)'
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-serif font-black text-base text-[var(--text-main)]">
                          Total: ₹{order.finalAmount || order.totalAmount}
                        </span>
                        <span className="text-[var(--text-faint)]">·</span>
                        <span className="font-sans text-xs text-[var(--text-muted)]">
                          Ship to: <strong className="text-[var(--text-main)]">{order.shippingName || order.customerName || user?.name || 'Reader'}</strong> ({order.shippingCity || 'Mumbai'})
                        </span>
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Buy Again Button */}
                      <button
                        onClick={() => handleBuyAgain(order)}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                        title="Reorder editions into cart"
                      >
                        <span>🔄</span>
                        <span>Buy Again</span>
                      </button>

                      {/* Official Tax Invoice Bill */}
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-main)] text-[var(--text-main)] border border-[var(--border-main)] font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <span>🧾</span>
                        <span>Invoice Bill ↗</span>
                      </button>

                      {/* Return Request Button */}
                      {isDelivered && !isReturnMode && (
                        <button
                          onClick={() => setSelectedReturnOrder(order)}
                          className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-300 border border-rose-500/30 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          Request Return ↺
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Visual 5-Stage Stepper Tracker ── */}
                  <div className="py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-faint)]">
                          {isReturnMode ? 'REVERSE LOGISTICS RETURN JOURNEY' : 'FULFILLMENT & DELIVERY LIFECYCLE'}
                        </span>
                        <span className="text-[var(--text-faint)]">·</span>
                        <button
                          onClick={() => handleCopyTracking(trackingNumber)}
                          className="font-mono text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                          title="Copy tracking ID"
                        >
                          <span>{trackingNumber}</span>
                          <span>{copiedTrackingId === trackingNumber ? '✓ Copied' : '📋'}</span>
                        </button>
                      </div>

                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                        Stage {currentStepIdx + 1}/5: {activeSteps[currentStepIdx]?.label || order.orderStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 relative">
                      {/* Background connector bar */}
                      <div className="absolute top-5 left-8 right-8 h-1.5 bg-[var(--border-main)] -z-0 rounded-full" />
                      
                      {/* Active connector progress */}
                      <div
                        className="absolute top-5 left-8 h-1.5 bg-amber-500 transition-all duration-500 -z-0 rounded-full"
                        style={{
                          width: `${Math.min(100, (currentStepIdx / (activeSteps.length - 1)) * 100)}%`,
                        }}
                      />

                      {activeSteps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                            <div
                              className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold transition-all shadow-sm ${
                                isCompleted
                                  ? 'bg-amber-500 text-black ring-4 ring-[var(--bg-surface)] scale-110 font-black'
                                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-faint)] border-2 border-[var(--border-main)]'
                              }`}
                            >
                              <span>{step.icon}</span>
                            </div>

                            <div className="mt-3 space-y-1">
                              <p
                                className={`text-xs sm:text-sm font-bold uppercase tracking-wider leading-snug ${
                                  isCurrent
                                    ? 'text-[var(--text-main)] font-black underline underline-offset-4 decoration-amber-500'
                                    : isCompleted
                                    ? 'text-[var(--text-main)]'
                                    : 'text-[var(--text-faint)]'
                                }`}
                              >
                                {step.label}
                              </p>
                              <p className="hidden md:block text-xs text-[var(--text-muted)] leading-tight">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Purchased Items Deck ── */}
                  <div className="pt-5 border-t-2 border-[var(--border-subtle)] space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-faint)] block">
                      Enclosed Archival Editions ({order.items?.length || 0})
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(order.items || []).map((item: any, idx: number) => {
                        const bookTitle = item.book?.title || item.title || 'Archival Volume';
                        const bookAuthor = item.book?.author || item.author || 'Author';

                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-sm"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm text-[var(--text-main)] truncate" title={bookTitle}>
                                {bookTitle}
                              </p>
                              <p className="text-xs text-[var(--text-muted)] truncate">
                                By {bookAuthor} · Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="font-mono font-bold text-sm text-[var(--text-main)] shrink-0">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cash on Delivery Doorstep Alert */}
                  {isCOD && !isDelivered && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-3">
                      <span className="text-xl">💵</span>
                      <p>
                        <strong>Cash on Delivery:</strong> Please keep ₹{order.finalAmount || order.totalAmount} ready in cash when the courier delivery executive arrives at your doorstep.
                      </p>
                    </div>
                  )}

                  {/* Return Status details if returned */}
                  {isReturnMode && order.returnRequest && (
                    <div className="p-4 rounded-2xl bg-blue-500/10 border-2 border-blue-500/40 text-blue-900 dark:text-blue-200 text-xs sm:text-sm space-y-1">
                      <p className="font-bold">
                        Return Reason: {order.returnRequest.reason}
                      </p>
                      <p className="text-xs">
                        Refund Destination: <span className="font-mono font-bold">{order.returnRequest.upiId}</span> · Doorstep pickup insured with BlueDart reverse logistics.
                      </p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Tax Invoice Bill Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* Return Request Modal */}
      <ReturnRequestModal
        order={selectedReturnOrder}
        isOpen={!!selectedReturnOrder}
        onClose={() => setSelectedReturnOrder(null)}
        onSubmitReturn={handleReturnSubmit}
      />
    </div>
  );
}
