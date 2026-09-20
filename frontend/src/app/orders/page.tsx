'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order } from '../../types/order';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const rupee = '\u20B9';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    async function loadOrders() {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, authLoading, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'SHIPPED':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'PROCESSING':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-20 text-center'>
        <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-sm text-slate-500 font-semibold'>Loading order history...</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex items-baseline justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800/80'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
            Order History
          </h1>
          <p className='text-xs text-slate-400 mt-1'>View and track all your previous purchases</p>
        </div>
        <Link href='/#catalog' className='text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline'>
          Browse Books
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className='py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8'>
          <div className='w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4'>
            <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>No orders yet</h2>
          <p className='text-sm text-slate-500 max-w-sm mx-auto mb-6'>
            You have not placed any orders. Start building your personal library today!
          </p>
          <Link
            href='/#catalog'
            className='inline-block px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition'
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order) => (
            <div
              key={order.id}
              className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-lg transition-all duration-200'
            >
              <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono font-bold text-sm text-slate-900 dark:text-white'>
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className='text-xs text-slate-400'>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <span className='text-xs text-slate-400 block'>Total Amount</span>
                    <span className='text-lg font-black text-slate-900 dark:text-white'>{rupee}{order.finalAmount}</span>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className='px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition'
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Items List */}
              <div className='pt-4 divide-y divide-slate-100 dark:divide-slate-800'>
                {order.items?.map((item) => (
                  <div key={item.id} className='py-3 flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-3 min-w-0'>
                      <div className='w-10 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700'>
                        {item.book?.coverImage ? (
                          <img src={item.book.coverImage} alt={item.book.title} className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-[9px] text-slate-400'>Cover</div>
                        )}
                      </div>
                      <div className='min-w-0'>
                        <p className='text-xs font-bold text-slate-900 dark:text-white truncate'>
                          {item.book?.title}
                        </p>
                        <p className='text-[11px] text-slate-400'>Qty: {item.quantity} x {rupee}{item.price}</p>
                      </div>
                    </div>
                    <span className='text-xs font-bold text-slate-900 dark:text-white shrink-0'>
                      {rupee}{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
