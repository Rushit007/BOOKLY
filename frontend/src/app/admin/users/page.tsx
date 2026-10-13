'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminUsers(1, 50);
      setUsers(res.data);
    } catch {
      // Fallback local patrons
      const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('bookly_user') : null;
      const current = localUserStr ? JSON.parse(localUserStr) : null;
      setUsers([
        current || {
          id: 'u-admin',
          name: 'BOOKLY Master Owner',
          email: 'boss@bookly.com',
          phone: '+91 9876543210',
          role: 'ADMIN',
          _count: { orders: 12 },
          createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
        },
        {
          id: 'u-2',
          name: 'Aarav Sharma',
          email: 'aarav@gmail.com',
          phone: '+91 9820194821',
          role: 'CUSTOMER',
          _count: { orders: 4 },
          createdAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
        },
        {
          id: 'u-3',
          name: 'Pooja Patel',
          email: 'pooja.patel@gmail.com',
          phone: '+91 9928104812',
          role: 'CUSTOMER',
          _count: { orders: 6 },
          createdAt: new Date(Date.now() - 3600000 * 24 * 28).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleRole = async (userId: string, currentRole: string, userName: string) => {
    const nextRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!confirm(`Are you sure you want to change ${userName}'s clearance to ${nextRole}?`)) return;

    try {
      await api.updateUserRole(userId, nextRole as any);
      setMessage({ type: 'success', text: `Updated ${userName}'s privilege to ${nextRole}!` });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Role change failed' });
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#42BFDD]">
              SECURITY CLEARANCE & PATRONAGE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[var(--text-main)] tracking-tight">
            Patron & Account Directory
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Registered bookstore accounts, purchase histories, and administrative roles.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-xl text-xs font-mono font-bold transition shadow-[2px_2px_0px_var(--border-main)] cursor-pointer self-start sm:self-center"
        >
          <span>↺</span>
          <span>Refresh</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border-2 animate-scale-in ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100 cursor-pointer">✕</button>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by patron name, email address, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-[var(--bg-surface-elevated)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] rounded-xl border-2 border-[var(--border-main)] focus:outline-none focus:border-amber-400 font-mono shadow-xs"
          />
          <span className="w-4 h-4 absolute left-3 top-2.5 text-xs text-[var(--text-faint)]">🔍</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-xs text-[var(--text-faint)] hover:text-[var(--text-main)]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Users Table ── */}
      <div className="rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[var(--bg-surface-elevated)] border-b-2 border-[var(--border-main)] text-[var(--text-faint)] font-mono text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4 font-bold">Patron Identity</th>
                <th className="py-3 px-4 font-bold">Contact</th>
                <th className="py-3 px-4 font-bold">Clearance Role</th>
                <th className="py-3 px-4 font-bold">Orders Placed</th>
                <th className="py-3 px-4 font-bold">Member Since</th>
                <th className="py-3 px-4 font-bold text-right">Privileges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredUsers.map((u) => {
                const isAdmin = u.role === 'ADMIN';
                return (
                  <tr key={u.id} className="hover:bg-[var(--bg-surface-elevated)]/60 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                        isAdmin
                          ? 'bg-amber-400 text-black border-amber-500 shadow-xs'
                          : 'bg-[var(--bg-surface-elevated)] text-[var(--text-main)] border-[var(--border-main)]'
                      }`}>
                        {isAdmin ? '👑' : u.name?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[var(--text-main)]">{u.name}</p>
                        <p className="text-[11px] text-[var(--text-muted)] font-mono">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--text-muted)]">
                      {u.phone || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        isAdmin
                          ? 'bg-amber-400 text-black border-amber-500 shadow-xs'
                          : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                      }`}>
                        {isAdmin ? '⚡ Master Admin' : '📖 Reader'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-main)]">
                      {u._count?.orders ?? u.orders?.length ?? 1} editions
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2026'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role, u.name)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border transition cursor-pointer ${
                          isAdmin
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white'
                            : 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border-amber-400/40 hover:bg-amber-400 hover:text-black'
                        }`}
                      >
                        {isAdmin ? 'Demote to Reader' : 'Promote to Admin ⚡'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
