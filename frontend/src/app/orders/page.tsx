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

    if (isAuthenticated) loadOrders();
  }, [isAuthenticated, authLoading, router]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-[var(--bg-accent-mint)] text-[var(--text-main)] border-[var(--border-main)]';
      case 'SHIPPED': return 'bg-[var(--bg-accent-blue)] text-white border-[var(--border-main)]';
      case 'PROCESSING': return 'bg-[var(--bg-accent-violet)] text-white border-[var(--border-main)]';
      case 'CONFIRMED': return 'bg-[var(--bg-accent-blue)] text-white border-[var(--border-main)]';
      case 'CANCELLED': return 'bg-[var(--bg-accent-pink)] text-white border-[var(--border-main)]';
      case 'PENDING':
      default: return 'bg-[var(--bg-accent-yellow)] text-[var(--text-main)] border-[var(--border-main)]';
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className='min-h-screen bg-[var(--bg-page)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='font-editorial-serif text-5xl text-[var(--text-faint)] animate-pulse mb-4'>
            ···
          </div>
          <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]'>
            Loading Archive
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[var(--bg-page)]'>
      {/* Page header */}
      <div className='border-b-2 border-[var(--border-main)] bg-[var(--bg-surface)]'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-baseline justify-between'>
          <div className='flex items-baseline gap-4'>
            <h1 className='font-editorial-serif text-3xl sm:text-4xl text-[var(--text-main)]'>
              Order Archive
            </h1>
            <span className='font-editorial-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-faint)]'>
              {orders.length} ORDER{orders.length !== 1 ? 'S' : ''}
            </span>
          </div>
          <Link
            href='/books'
            className='hidden sm:inline font-editorial-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)] hover:text-[var(--text-main)] border-b border-[var(--border-subtle)] hover:border-[var(--border-main)] transition-colors pb-0.5'
          >
            Browse Books ↗
          </Link>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        {orders.length === 0 ? (
          /* Empty State */
          <div className='border-2 border-[var(--border-main)] bg-[var(--bg-surface)] py-24 text-center'>
            <p className='font-editorial-serif text-5xl text-[var(--text-faint)] mb-4'>
              No Orders Yet
            </p>
            <p className='font-editorial-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8'>
              Start building your personal library
            </p>
            <Link
              href='/books'
              className='neo-btn-accent inline-flex items-center gap-2 px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider'
            >
              Start Shopping ↗
            </Link>
          </div>
        ) : (
          <div className='border-2 border-[var(--border-main)] divide-y-2 divide-[var(--border-subtle)] bg-[var(--bg-surface)]'>
            {orders.map((order) => (
              <div key={order.id} className='p-5'>
                {/* Order Header */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3 mb-4'>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                    <span className='font-editorial-mono text-xs font-bold text-[var(--text-main)]'>
                      {order.orderNumber}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 border text-[9px] font-bold font-editorial-mono uppercase tracking-widest ${getStatusStyle(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className='font-editorial-mono text-[9px] text-[var(--text-faint)]'>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='font-editorial-mono text-[8px] uppercase tracking-wider text-[var(--text-faint)]'>Total</p>
                      <p className='font-editorial-serif text-xl text-[var(--text-main)]'>
                        {rupee}{order.finalAmount}
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className='neo-btn-secondary px-4 py-2 text-[9px] font-bold uppercase tracking-wider inline-block'
                    >
                      Details ↗
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className='space-y-2'>
                  {order.items?.map((item) => (
                    <div key={item.id} className='flex items-center justify-between gap-4 py-1.5'>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className='w-8 h-11 border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] overflow-hidden shrink-0'>
                          {item.book?.coverImage ? (
                            <img src={item.book.coverImage} alt={item.book.title} className='w-full h-full object-cover' />
                          ) : (
                            <div className='w-full h-full bg-[var(--bg-surface-elevated)]' />
                          )}
                        </div>
                        <div className='min-w-0'>
                          <p className='font-editorial-serif text-sm text-[var(--text-main)] truncate'>
                            {item.book?.title}
                          </p>
                          <p className='font-editorial-mono text-[9px] text-[var(--text-faint)]'>
                            QTY {item.quantity} × {rupee}{item.price}
                          </p>
                        </div>
                      </div>
                      <span className='font-editorial-mono text-[10px] font-bold text-[var(--text-main)] shrink-0'>
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
    </div>
  );
}
