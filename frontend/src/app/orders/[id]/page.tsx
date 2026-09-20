'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '../../../types/order';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  
  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const updated = await api.cancelOrder(order!.id);
      setOrder(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const rupee = '\u20B9';

  useEffect(() => {
    async function loadOrder() {
      if (!orderId || !isAuthenticated) return;
      setIsLoading(true);
      try {
        const found = await api.getOrderById(orderId);
        setOrder(found);
      } catch (err: any) {
        setError(err.message || 'Order not found or permission denied');
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      loadOrder();
    }
  }, [orderId, isAuthenticated]);

  if (isLoading || authLoading) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-20 text-center'>
        <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-sm text-slate-500 font-semibold'>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className='max-w-2xl mx-auto px-4 py-20 text-center space-y-4'>
        <h2 className='text-2xl font-black text-slate-900 dark:text-white'>Order Not Found</h2>
        <p className='text-sm text-slate-500'>{error || 'The requested order could not be retrieved.'}</p>
        <Link href='/orders' className='inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs'>
          Back to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-2 text-xs font-semibold text-slate-400'>
        <Link href='/' className='hover:text-indigo-600 dark:hover:text-indigo-400'>Home</Link>
        <span>/</span>
        <Link href='/orders' className='hover:text-indigo-600 dark:hover:text-indigo-400'>Orders</Link>
        <span>/</span>
        <span className='text-slate-700 dark:text-slate-300 font-mono'>{order.orderNumber}</span>
      </nav>

      {/* Header Info */}
      <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4'>
          <div>
            <span className='text-xs font-bold uppercase tracking-wider text-slate-400'>Order Details</span>
            <h1 className='text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-1'>
              {order.orderNumber}
            </h1>
            <p className='text-xs text-slate-400 mt-1'>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className='flex flex-col sm:items-end gap-1.5'>
            <span className='text-xs text-slate-400'>Current Status</span>
            <div className='flex items-center gap-2'>
              <span className='px-3 py-1 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'>
                {order.orderStatus}
              </span>
              {(order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') && (
                <button
                  type='button'
                  onClick={handleCancel}
                  disabled={cancelling}
                  className='px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-full border border-rose-200 dark:border-rose-800 transition disabled:opacity-50 cursor-pointer'
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Shipping and Payment info */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
          <div className='p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5 border border-slate-200/60 dark:border-slate-700/60'>
            <span className='font-bold uppercase tracking-wider text-slate-400 block'>Delivery Address</span>
            <p className='font-semibold text-slate-800 dark:text-slate-200 leading-relaxed'>{order.shippingAddress}</p>
          </div>
          <div className='p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5 border border-slate-200/60 dark:border-slate-700/60'>
            <span className='font-bold uppercase tracking-wider text-slate-400 block'>Payment Details</span>
            <p className='font-semibold text-slate-800 dark:text-slate-200'>Status: <span className='text-emerald-600 dark:text-emerald-400 font-bold'>{order.paymentStatus}</span></p>
            <p className='text-slate-500'>Provider: Razorpay Test Simulation</p>
          </div>
        </div>

        {/* Ordered Books */}
        <div>
          <h3 className='text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4'>
            Purchased Books
          </h3>
          <div className='divide-y divide-slate-100 dark:divide-slate-800'>
            {order.items?.map((item) => (
              <div key={item.id} className='py-4 flex items-center justify-between gap-4'>
                <div className='flex items-center gap-4 min-w-0'>
                  <div className='w-14 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700'>
                    {item.book?.coverImage ? (
                      <img src={item.book.coverImage} alt={item.book.title} className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-xs text-slate-400'>Cover</div>
                    )}
                  </div>
                  <div className='space-y-1 min-w-0'>
                    <Link href={`/books/${item.bookId}`} className='text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block'>
                      {item.book?.title}
                    </Link>
                    <p className='text-xs text-slate-400'>by {item.book?.author}</p>
                    <p className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                      Qty: {item.quantity} x {rupee}{item.price}
                    </p>
                  </div>
                </div>
                <span className='text-sm font-black text-slate-900 dark:text-white shrink-0'>
                  {rupee}{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className='pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs'>
          <div className='flex justify-between text-slate-500'>
            <span>Gross Catalog Subtotal</span>
            <span>{rupee}{order.totalAmount}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className='flex justify-between text-emerald-600 dark:text-emerald-400'>
              <span>Discount Savings</span>
              <span>-{rupee}{order.discountAmount}</span>
            </div>
          )}
          <div className='flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800'>
            <span>Total Paid</span>
            <span className='text-indigo-600 dark:text-indigo-400'>{rupee}{order.finalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
